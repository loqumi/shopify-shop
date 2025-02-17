export default function formatPhoneNumber(phoneNumber: string) {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if the number starts with a country code
  const hasCountryCode = cleaned.length > 10;

  // Extract parts
  const countryCode = hasCountryCode ? cleaned.slice(0, 2) : '';
  const remaining = hasCountryCode ? cleaned.slice(2) : cleaned;
  const areaCode = remaining.slice(0, 3);
  const middle = remaining.slice(3, 6);
  const last1 = remaining.slice(6, 8);
  const last2 = remaining.slice(8, 10);

  // Format the number
  if (hasCountryCode) {
    return `+${countryCode} (${areaCode}) ${middle}-${last1}-${last2}`;
  }
  return `(${areaCode}) ${middle}-${last1}-${last2}`;
}
