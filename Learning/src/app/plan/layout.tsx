import { SubNav } from "@/components/SubNav";

const ITEMS = [
  { href: "/plan/roadmap", label: "Roadmap" },
  { href: "/plan/calendar", label: "Calendar" },
  { href: "/plan/skills", label: "Skills" },
  { href: "/plan/projects", label: "Projects" },
  { href: "/plan/readiness", label: "Readiness" },
  { href: "/plan/reviews", label: "Reviews" },
];

export default function PlanLayout({
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
