import Link from "next/link";
import { categoryToSlug } from "@/lib/categories";

interface CategoryPillsProps {
  categories: { slug: string; name: string; count: number }[];
}

export function CategoryPills({ categories }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/categories/${cat.slug}`}
          className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white"
        >
          {cat.name}
          <span className="ml-2 text-zinc-600">{cat.count}</span>
        </Link>
      ))}
    </div>
  );
}

export function CategoryLink({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  return (
    <Link
      href={`/categories/${categoryToSlug(category)}`}
      className={`transition hover:text-red-400 ${className}`}
    >
      {category}
    </Link>
  );
}
