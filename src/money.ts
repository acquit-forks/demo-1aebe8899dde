export type Line = { amount: number };

// Minor-unit size (number of decimal places) defined by ISO 4217 for every
// active currency code whose exponent is not the standard 2. The standard
// assigns an explicit minor unit to each code; all active codes not listed
// here are defined with 2 minor units, so 2 is the standard's default and not
// a guess. Source: ISO 4217 Table A.1 "Current currency & funds code list".
const MINOR_UNITS: Record<string, number> = {
  // Zero minor units.
  BIF: 0, CLP: 0, DJF: 0, GNF: 0, ISK: 0, JPY: 0, KMF: 0, KRW: 0,
  PYG: 0, RWF: 0, UGX: 0, UYI: 0, VND: 0, VUV: 0, XAF: 0, XOF: 0, XPF: 0,
  // Three minor units.
  BHD: 3, IQD: 3, JOD: 3, KWD: 3, LYD: 3, OMR: 3, TND: 3,
  // Four minor units (funds codes).
  CLF: 4, UYW: 4,
};

// ISO 4217 codes published without a minor unit: precious metals traded by
// troy ounce and codes for non-currency/testing purposes. The standard does
// not define a decimal form for them, so they cannot be formatted.
const NO_MINOR_UNIT = new Set(['XAU', 'XAG', 'XPD', 'XPT', 'XDR', 'XTS', 'XXX']);

export function minorUnitDigits(currency: string): number {
  const code = currency.trim().toUpperCase();
  if (NO_MINOR_UNIT.has(code)) {
    throw new Error(
      `ISO 4217 code "${code}" has no minor unit and cannot be formatted as a decimal amount`,
    );
  }
  return MINOR_UNITS[code] ?? 2;
}

// Round to `digits` decimal places, half away from zero. The epsilon
// compensation absorbs binary floating-point representation error, so a value
// computed as 267.49999999999997 (intended 267.5) rounds to 268, not 267.
function roundToMinorUnits(value: number, digits: number): number {
  const factor = 10 ** digits;
  const scaled = value * factor * (1 + Number.EPSILON);
  const rounded = scaled >= 0 ? Math.floor(scaled + 0.5) : Math.ceil(scaled - 0.5);
  return rounded / factor;
}

export function formatTotal(lines: Line[], currency: string): string {
  const digits = minorUnitDigits(currency);
  const sum = lines.reduce((total, line) => total + line.amount, 0);
  return roundToMinorUnits(sum, digits).toFixed(digits);
}
