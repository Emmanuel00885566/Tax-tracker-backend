

export const DEFAULT_PIT_BRACKETS = [
  
  { upTo: 300000, rate: 0.07 },
  { upTo: 600000, rate: 0.11 },
  { upTo: 1100000, rate: 0.15 },
  { upTo: 1600000, rate: 0.19 },
  { upTo: 3200000, rate: 0.21 },
  { upTo: Infinity, rate: 0.24 }
];

export const DEFAULT_CIT_RULES = {
  smallCompanyThreshold: 100000000, 
  smallCompanyRate: 0.20, 
  largeCompanyRate: 0.30  
};

export function applyProgressiveBrackets(taxableIncome, brackets = DEFAULT_PIT_BRACKETS) {
  if (!taxableIncome || taxableIncome <= 0) return 0;

  let remaining = Number(taxableIncome);
  let prevLimit = 0;
  let tax = 0;

  for (const bracket of brackets) {
    const { upTo, rate } = bracket;
    const bracketLimit = upTo === Infinity ? Infinity : Number(upTo) - prevLimit;

    if (remaining <= 0) break;

    if (bracketLimit === Infinity) {
      tax += remaining * rate;
      remaining = 0;
    } else {
      const taxableInBracket = Math.min(remaining, bracketLimit);
      tax += taxableInBracket * rate;
      remaining -= taxableInBracket;
    }

    prevLimit = upTo === Infinity ? prevLimit : upTo;
  }

  return Number(tax.toFixed(2));
}

export function computePIT(taxableIncome, options = {}) {
  const brackets = options.brackets || DEFAULT_PIT_BRACKETS;
  const taxAmount = applyProgressiveBrackets(taxableIncome, brackets);
  return {
    taxableIncome: Number(taxableIncome),
    taxAmount,
    computedAt: new Date().toISOString()
  };
}

export function computeCIT(taxableIncome, turnover = 0, options = {}) {
  const rules = { ...DEFAULT_CIT_RULES, ...(options.rules || {}) };
  const threshold = Number(rules.smallCompanyThreshold);
  const rate = Number(turnover) < threshold ? Number(rules.smallCompanyRate) : Number(rules.largeCompanyRate);

  const taxAmount = Number((Number(taxableIncome) * rate).toFixed(2));
  return {
    taxableIncome: Number(taxableIncome),
    turnover: Number(turnover),
    rate,
    taxAmount,
    computedAt: new Date().toISOString()
  };
}
