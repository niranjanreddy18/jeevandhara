export const casesData = [
  { id: "JD-2847", disease: "Cancer", hospital: "AIIMS Delhi", required: 850000, collected: 612000, urgency: "Critical", verified: true, patient: { name: 'R. Kumar', age: 45 }, description: 'Needs chemotherapy cycles and supportive care. Diagnosis confirmed by oncology team.', documents: [] },
  { id: "JD-2846", disease: "Cardiac", hospital: "Fortis Mumbai", required: 1200000, collected: 980000, urgency: "High", verified: true, patient: { name: 'S. Patel', age: 58 }, description: 'Scheduled for bypass surgery. Pre-op investigations attached.', documents: [] },
  { id: "JD-2845", disease: "Kidney", hospital: "CMC Vellore", required: 450000, collected: 125000, urgency: "Medium", verified: true, patient: { name: 'M. Singh', age: 39 }, description: 'Requires dialysis and transplant evaluation.', documents: [] },
  { id: "JD-2844", disease: "Neurological", hospital: "NIMHANS Bangalore", required: 2100000, collected: 1750000, urgency: "Critical", verified: true, patient: { name: 'L. Rao', age: 62 }, description: 'Complex neurosurgical intervention planned.', documents: [] },
  { id: "JD-2843", disease: "Liver", hospital: "Medanta Gurugram", required: 680000, collected: 340000, urgency: "High", verified: true, patient: { name: 'A. Verma', age: 47 }, description: 'Liver transplant evaluation ongoing.', documents: [] },
  { id: "JD-2842", disease: "Cancer", hospital: "Tata Memorial Mumbai", required: 950000, collected: 850000, urgency: "Medium", verified: true, patient: { name: 'R. Gupta', age: 52 }, description: 'Adjuvant therapy required.', documents: [] },
  { id: "JD-2841", disease: "Cardiac", hospital: "Narayana Health Bangalore", required: 750000, collected: 200000, urgency: "High", verified: true, patient: { name: 'P. Sharma', age: 61 }, description: 'Intervention for valve replacement.', documents: [] },
  { id: "JD-2840", disease: "Kidney", hospital: "PGI Chandigarh", required: 380000, collected: 380000, urgency: "Medium", verified: true, patient: { name: 'K. Desai', age: 29 }, description: 'Dialysis ongoing; transplant listed.', documents: [] },
];

export const formatCurrency = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

export const formatCurrencyWithPercent = (required: number, collected: number) => {
  const percent = required > 0 ? Math.round((collected / required) * 100) : 0;
  return `${formatCurrency(collected)} (${percent}%)`;
}

export function getCaseById(id: string) {
  return casesData.find((c) => c.id === id) || null;
}
