import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');
const CONFIG_FILE = path.join(process.cwd(), 'data', 'site-config.json');

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

// GET: listar pedidos
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get('password');
  if (password !== (process.env.ADMIN_PASSWORD || 'admin123')) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const orders = loadOrders();
  return NextResponse.json({ orders: orders.reverse() });
}

// PATCH: atualizar status de pedido
export async function PATCH(req: Request) {
  const body = await req.json();
  const { password, orderId, status } = body;
  if (password !== (process.env.ADMIN_PASSWORD || 'admin123')) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const orders = loadOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
  orders[idx].status = status;
  orders[idx].updatedAt = new Date().toISOString();
  if (status === 'paid') orders[idx].paidAt = new Date().toISOString();
  saveOrders(orders);
  return NextResponse.json({ success: true, order: orders[idx] });
}

// DELETE: apagar pedido
export async function DELETE(req: Request) {
  const body = await req.json();
  const { password, orderId } = body;
  if (password !== (process.env.ADMIN_PASSWORD || 'admin123')) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  let orders = loadOrders();
  orders = orders.filter(o => o.id !== orderId);
  saveOrders(orders);
  return NextResponse.json({ success: true });
}
