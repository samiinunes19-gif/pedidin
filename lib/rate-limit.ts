// Rate limiter em memória - 3 requests por endpoint, bloqueio de 1 hora
const rateMap = new Map<string, { count: number; firstRequest: number; blockedUntil: number }>();

const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 1000; // 1 minuto janela de contagem
const BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hora de bloqueio

// Limpa entradas expiradas a cada 5 min
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateMap.entries()) {
    if (val.blockedUntil && now > val.blockedUntil && now - val.firstRequest > WINDOW_MS) {
      rateMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(ip: string, endpoint: string): { allowed: boolean; retryAfter?: number } {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const entry = rateMap.get(key);

  // Se está bloqueado
  if (entry?.blockedUntil && now < entry.blockedUntil) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Se a janela expirou, resetar
  if (!entry || now - entry.firstRequest > WINDOW_MS) {
    rateMap.set(key, { count: 1, firstRequest: now, blockedUntil: 0 });
    return { allowed: true };
  }

  // Incrementar
  entry.count++;

  // Excedeu o limite → bloquear por 1 hora
  if (entry.count > MAX_REQUESTS) {
    entry.blockedUntil = now + BLOCK_DURATION_MS;
    return { allowed: false, retryAfter: Math.ceil(BLOCK_DURATION_MS / 1000) };
  }

  return { allowed: true };
}

export function getRateLimitResponse(retryAfter: number) {
  return new Response(
    JSON.stringify({ error: 'Muitas requisições. Tente novamente mais tarde.', retryAfter }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
      },
    }
  );
}
