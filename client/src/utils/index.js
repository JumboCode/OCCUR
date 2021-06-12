export const slugify = (str, maxSegments = Infinity) => str
  .toLowerCase()
  .replace(/[^a-z0-9-'()]+/g, '-')
  .split('-')
  .slice(0, maxSegments)
  .join('-');


// https://stackoverflow.com/a/8358141/4414003
export function formatPhoneNumber(phoneNumberString) {
  const cleaned = phoneNumberString.replace(/\D/g, '');
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = (match[1] ? '+1 ' : '');
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return null;
}

// Escape HTML characters to prevent XSS
export function escapeHTML(htmlString) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;' };
  const reg = /[&<>"'/]/ig;
  return htmlString.replace(reg, (match) => (map[match]));
}
