// === VALIDAÇÃO DE CPF REAL (algoritmo oficial) ===
export function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return false;

  // Rejeitar CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(clean)) return false;

  // Validar primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(clean.charAt(9))) return false;

  // Validar segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(clean.charAt(10))) return false;

  return true;
}

// === VALIDAÇÃO DE TELEFONE BRASILEIRO ===
export function validatePhone(phone: string): boolean {
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 10 || clean.length > 11) return false;
  const ddd = parseInt(clean.substring(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  if (clean.length === 11 && clean.charAt(2) !== '9') return false;
  return true;
}

// === VALIDAÇÃO DE NOME REAL ===
export function validateName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  if (trimmed.length < 3) return { valid: false, error: 'Nome muito curto' };
  if (trimmed.length > 100) return { valid: false, error: 'Nome muito longo' };
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return { valid: false, error: 'Digite nome e sobrenome' };
  if (parts.some(p => p.length < 2)) return { valid: false, error: 'Nome inválido' };
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)) return { valid: false, error: 'Nome não pode conter números ou símbolos' };
  return { valid: true };
}

// === VALIDAÇÃO DE CEP ===
export function validateCEP(cep: string): boolean {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return false;
  const num = parseInt(clean);
  return num >= 1000000 && num <= 99999999;
}

// === SANITIZAÇÃO XSS ===
export function sanitize(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#96;')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

export function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitize(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[key] = value.map(v => typeof v === 'string' ? sanitize(v) : typeof v === 'object' && v !== null ? sanitizeObject(v as Record<string, unknown>) : v);
    } else {
      result[key] = value;
    }
  }
  return result;
}
