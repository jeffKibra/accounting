export default function createSKU(string: string) {
  return String(string)
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(val => val !== ' ')
    .join('');
}
