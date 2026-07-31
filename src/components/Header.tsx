import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

const navLinks = [
  { href: "/database", label: "Database" },
  { href: "/methodology", label: "Method" },
  { href: "/editorial-policy", label: "Policy" },
  { href: "/submit", label: "Nominate a Tool" },
];

export async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="border-b border-gray-300 bg-[#f4f3ed]/78 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-sm font-black text-white">
            RTA
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-gray-600">
              Rate That AI
            </p>
            <p className="text-xs text-gray-500">
              We test AI tools so you know what&apos;s worth it
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-sm font-medium text-gray-600 transition hover:text-gray-900 sm:inline"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="max-w-32 truncate text-xs text-gray-500" title={user.email}>{user.email}</span>
              <SignOutButton />
            </div>
          ) : (
            <Link href="/account" className="text-sm font-medium text-gray-600 transition hover:text-gray-900">Account</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
