import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'site-config.json');

function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadConfig() {
  ensureDataDir();
  if (!fs.existsSync(CONFIG_FILE)) return { whitePageActive: false };
  try { return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')); } catch { return { whitePageActive: false }; }
}

function saveConfig(config: any) {
  ensureDataDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export async function GET() {
  return NextResponse.json(loadConfig());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { password, whitePageActive } = body;
  if (password !== (process.env.ADMIN_PASSWORD || 'admin123')) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const config = { ...loadConfig(), whitePageActive };
  saveConfig(config);
  return NextResponse.json({ success: true, config });
}
