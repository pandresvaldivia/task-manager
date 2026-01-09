export function isValidString(input: unknown): boolean {
  return typeof input === 'string' && input.trim() !== '';
}
