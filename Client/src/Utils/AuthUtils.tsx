export const MaskEmail = (email) => {
  if (!email) return "";

  const [localPart, domain] = email.split("@");

  const visibleLength = Math.min(4, localPart.length); // safe
  const visible = localPart.slice(0, visibleLength);
  const maskedLength = Math.max(0, localPart.length - visibleLength);
  const masked = "*".repeat(maskedLength);

  return `${visible}${masked}@${domain}`;
};

export function ConvertIntoTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
