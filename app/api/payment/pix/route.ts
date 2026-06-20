import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitResponse } from '@/lib/rate-limit';
import { validateCPF, validateName } from '@/lib/validation';

export const dynamic = 'force-dynamic';

interface PixRequestBody {
  amount: number;
  customerName: string;
  customerCpf: string;
  items: Array<{
    title: string;
    unitPrice: number;
    quantity: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 'unknown';
    const { allowed, retryAfter } = checkRateLimit(ip, 'payment-pix');
    if (!allowed) return getRateLimitResponse(retryAfter!);

    const body: PixRequestBody = await request.json();
    const { amount, customerName, customerCpf, items } = body;

    if (!amount || !customerName || !customerCpf || !items?.length) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const nameCheck = validateName(customerName);
    if (!nameCheck.valid) {
      return NextResponse.json(
        { success: false, error: nameCheck.error || 'Nome inválido' },
        { status: 400 }
      );
    }

    if (!validateCPF(customerCpf)) {
      return NextResponse.json(
        { success: false, error: 'CPF inválido. Digite um CPF real.' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0 || amount > 50000) {
      return NextResponse.json(
        { success: false, error: 'Valor inválido' },
        { status: 400 }
      );
    }

    const nameParts = customerName.trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/).filter(Boolean);
    const nameSlug = nameParts.join('');
    const randomNum = Math.floor(100 + Math.random() * 900);
    const customerEmail = `${nameSlug}${randomNum}@gmail.com`;

    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 30);

    const cleanCpf = customerCpf.replace(/\D/g, '');

    const payload = {
      amount: Number(amount.toFixed(2)),
      paymentMethod: 'pix',
      customer: {
        name: customerName.trim(),
        email: customerEmail,
        document: {
          number: cleanCpf,
          type: 'cpf'
        }
      },
      items: items.map((item, index) => ({
        title: 'Markting vendas 10',
        unitPrice: Number(item.unitPrice.toFixed(2)),
        quantity: item.quantity,
        tangible: true
      })),
      pix: {
        expirationDate: expirationDate.toISOString()
      }
    };

    const response = await fetch(
      'https://dcnmsoaogkbgkbwpldrp.supabase.co/functions/v1/pix-receive',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-public-key': process.env.MASTERPAG_PUBLIC_KEY || '',
          'x-secret-key': process.env.MASTERPAG_SECRET_KEY || ''
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Erro ao gerar PIX' },
        { status: response.status }
      );
    }

    const pixInfo = data.pix || data.transaction?.pix || data;
    
    const qrCode = pixInfo.qrCode || pixInfo.qr_code || pixInfo.qrcode || 
                   pixInfo.qrCodeUrl || pixInfo.qr_code_url || pixInfo.qrcodeUrl ||
                   pixInfo.qrCodeBase64 || pixInfo.qr_code_base64 ||
                   data.qrCode || data.qr_code || data.qrcode;
    
    const copyPaste = pixInfo.copyPaste || pixInfo.copy_paste || pixInfo.copypaste || 
                      pixInfo.code || pixInfo.payload || pixInfo.emvqrcps ||
                      pixInfo.brcode || pixInfo.qrCodeText ||
                      data.copyPaste || data.copy_paste || data.code || data.payload;

    let finalQrCode = qrCode || '';
    if (!finalQrCode && copyPaste) {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(copyPaste)}`;
      finalQrCode = qrApiUrl;
    }

    return NextResponse.json({
      success: true,
      transactionId: data.transaction?.id || data.id || Date.now().toString(),
      pixQrCode: finalQrCode,
      pixCopyPaste: copyPaste || '',
      expiresAt: expirationDate.toISOString()
    });

  } catch (error) {
    console.error('Erro ao processar PIX:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao processar pagamento' },
      { status: 500 }
    );
  }
}
