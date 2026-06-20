import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitResponse } from '@/lib/rate-limit';
import { validateName, validatePhone } from '@/lib/validation';

export const dynamic = 'force-dynamic';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadOrders(): any[] {
  ensureDataDir();
  if (!fs.existsSync(ORDERS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8')); } catch { return []; }
}

function saveOrders(orders: any[]) {
  ensureDataDir();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function generateId() {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') || 'unknown';
    const { allowed, retryAfter } = checkRateLimit(ip, 'orders');
    if (!allowed) return getRateLimitResponse(retryAfter!);

    const body = await request.json();
    const {
      customerName,
      customerPhone,
      address,
      neighborhood,
      complement,
      paymentMethod,
      changeFor,
      subtotal,
      deliveryFee,
      total,
      notes,
      items,
    } = body ?? {};

    if (!customerName || !customerPhone || !address || !items || (items?.length ?? 0) === 0) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const nameCheck = validateName(customerName);
    if (!nameCheck.valid) {
      return NextResponse.json({ error: nameCheck.error || 'Nome inválido' }, { status: 400 });
    }

    if (!validatePhone(customerPhone)) {
      return NextResponse.json({ error: 'Telefone inválido. Use DDD + número.' }, { status: 400 });
    }

    if (typeof total !== 'number' || total <= 0 || total > 50000) {
      return NextResponse.json({ error: 'Valor do pedido inválido' }, { status: 400 });
    }

    const order = {
      id: generateId(),
      customerName,
      customerPhone,
      address,
      neighborhood: neighborhood ?? '',
      complement: complement ?? '',
      paymentMethod,
      changeFor: changeFor ?? null,
      subtotal,
      deliveryFee,
      total,
      notes: notes ?? '',
      items: items ?? [],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: null,
    };

    // Tentar salvar no banco primeiro, fallback para arquivo JSON
    try {
      const { prisma } = await import('@/lib/prisma');
      const dbOrder = await prisma.order.create({
        data: {
          customerName,
          customerPhone,
          address,
          neighborhood: neighborhood ?? '',
          complement: complement ?? '',
          paymentMethod,
          changeFor: changeFor ?? null,
          subtotal,
          deliveryFee,
          total,
          notes: notes ?? '',
          items: {
            create: items?.map((item: { productId: string; quantity: number; price: number; name?: string }) => ({
              productId: item?.productId,
              quantity: item?.quantity,
              price: item?.price,
            })),
          },
        },
        include: { items: true },
      });
      // Salvar também no JSON para o admin
      const orders = loadOrders();
      orders.push({ ...order, id: dbOrder.id, dbId: dbOrder.id });
      saveOrders(orders);
      return NextResponse.json(dbOrder);
    } catch {
      // Fallback: salvar só no JSON
      const orders = loadOrders();
      orders.push(order);
      saveOrders(orders);
      return NextResponse.json(order);
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = loadOrders();
    return NextResponse.json(orders.reverse());
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Erro ao buscar pedidos' }, { status: 500 });
  }
}
