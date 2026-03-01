export function nowIso() {
  return new Date().toISOString();
}

export function id(prefix: string) {
  return `${prefix}_${Math.floor(Math.random() * 1_000_000)}_${Date.now()}`;
}