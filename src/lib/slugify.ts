export function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD') // Decompose combined characters (like accents)
    .replace(/[\u0300-\u036f]/g, '') // Remove the diacritic marks
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
}
