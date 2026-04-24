/**
 * Prefix values that start with a character a spreadsheet would interpret as a formula
 * (`=`, `+`, `-`, `@`, tab, carriage return) with a single quote to neutralise injection.
 */
export function sanitizeForCsv(value: string | null | undefined): string {
    if (!value) return "";
    return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}
