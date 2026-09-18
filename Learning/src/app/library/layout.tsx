import { SubNav } from "@/components/SubNav";

const ITEMS = [
  { href: "/library/patterns", label: "Patterns" },
  { href: "/library/system-design", label: "System Design" },
  { href: "/library/radar", label: "AI Radar" },
  { href: "/library/journal", label: "Journal" },
];

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SubNav items={ITEMS} />
      {children}
    </>
  );
}
