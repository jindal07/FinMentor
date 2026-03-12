export function calculateCompoundGrowth(monthlyInvestment, years, annualReturn = 12) {
  const monthlyRate = annualReturn / 100 / 12;
  const months = years * 12;
  const futureValue =
    monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  return Math.round(futureValue);
}

export function generateGrowthData(monthlyInvestment, years, annualReturn = 12) {
  const monthlyRate = annualReturn / 100 / 12;
  const data = [];

  for (let year = 1; year <= years; year++) {
    const months = year * 12;
    const total =
      monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const invested = monthlyInvestment * months;

    data.push({
      year,
      value: Math.round(total),
      invested: Math.round(invested),
    });
  }

  return data;
}

export function formatCurrency(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}
