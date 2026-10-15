export type Line = { amount: number };

// Minor-unit exponents (number of decimal places) per ISO 4217.
// The standard defines every currency's exponent; most are 2, with these
// exceptions: 0-decimal, 3-decimal, and one 4-decimal currency (CLF).
const MINOR_UNITS_0 = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'ISK', 'JPY', 'KMF', 'KRW', 'PYG', 'RWF',
  'UGX', 'UYI', 'UYW', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
]);
const MINOR_UNITS_3 = new Set([
  'BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND',
]);
const MINOR_UNITS_4 = new Set(['CLF']);

// Every active ISO 4217 code not listed above has a 2-decimal minor unit.
const ACTIVE_CURRENCIES = new Set([
  'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN',
  'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BOV',
  'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHE', 'CHF',
  'CHW', 'CLF', 'CLP', 'CNY', 'COP', 'COU', 'CRC', 'CUP', 'CVE', 'CZK',
  'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP',
  'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL',
  'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD',
  'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT',
  'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD',
  'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MXV', 'MYR',
  'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN',
  'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF',
  'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SOS', 'SRD',
  'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY',
  'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYI', 'UYU', 'UYW', 'UZS',
  'VED', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF',
  'YER', 'ZAR', 'ZMW', 'ZWL',
]);

export function minorUnits(currency: string): number {
  if (MINOR_UNITS_0.has(currency)) return 0;
  if (MINOR_UNITS_3.has(currency)) return 3;
  if (MINOR_UNITS_4.has(currency)) return 4;
  if (ACTIVE_CURRENCIES.has(currency)) return 2;
  throw new Error(`Unknown currency code: ${currency}`);
}

export function formatTotal(lines: Line[], currency: string): string {
  const digits = minorUnits(currency);
  const sum = lines.reduce((total, line) => total + line.amount, 0);
  // Round the summed total to the currency's minor unit, then format with
  // exactly that many decimal places.
  const factor = 10 ** digits;
  const rounded = Math.round(sum * factor) / factor;
  return rounded.toFixed(digits);
}
