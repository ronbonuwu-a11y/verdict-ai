import type { Category } from "@/types/review";

export function categoryToSlug(category: Category | string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function slugToCategory(slug: string, categories: string[]): string | undefined {
  return categories.find((cat) => categoryToSlug(cat) === slug);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
