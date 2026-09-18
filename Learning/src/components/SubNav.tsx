"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SubNavItem {
  href: string;
  label: string;
}

/**
 * The second level of navigation, inside Plan and Library.
 *
 * It scrolls horizontally rather than wrapping, so a narrow screen shows a
 * single tidy row instead of a ragged block of links.
 */
export function SubNav({ items }: { items: SubNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="-mx-5 mb-9 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <ul className="flex w-max min-w-full gap-6 border-b border-line-soft">
        {items.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`-mb-px block border-b-2 pb-2.5 text-sm transition ${
                  active
                    ? "border-accent font-medium text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
