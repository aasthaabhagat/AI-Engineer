import type { ReactNode } from "react";
import type { Priority } from "@/data/types";

export function Card({
  children,
  className = "",
  as: Tag = "section",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "li";
  /** Anchor target, so deep links like /projects#expense-tracker land here. */
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={`scroll-mt-6 rounded-xl border border-line bg-panel shadow-card ${className}`}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  action,
  hint,
}: {
  title: string;
  action?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line-soft px-5 py-3.5">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
          {title}
        </h2>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function ProgressBar({
  value,
  className = "",
  tone = "accent",
}: {
  value: number;
  className?: string;
  tone?: "accent" | "teal" | "amber";
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  const bg =
    tone === "teal" ? "bg-teal" : tone === "amber" ? "bg-amber" : "bg-accent";
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-line-soft ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${bg} transition-[width] duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const PRIORITY_STYLE: Record<Priority, string> = {
  essential: "border-accent/40 bg-accent-soft text-accent",
  important: "border-line bg-raised text-muted",
  optional: "border-line bg-transparent text-faint",
};

export function PriorityTag({ priority }: { priority: Priority }) {
  return (
    <span
      className={`rounded border px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${PRIORITY_STYLE[priority]}`}
    >
      {priority}
    </span>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "warn" | "ok";
}) {
  const style = {
    default: "border-line bg-raised text-muted",
    accent: "border-accent/40 bg-accent-soft text-accent",
    warn: "border-amber/40 bg-amber/10 text-amber",
    ok: "border-ok/40 bg-ok/10 text-ok",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${style}`}
    >
      {children}
    </span>
  );
}

export function RepoPath({ path }: { path: string }) {
  return (
    <code className="rounded bg-raised px-1.5 py-0.5 font-mono text-xs text-teal">
      {path}
    </code>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const style = {
    primary:
      "bg-accent text-on-accent shadow-card hover:brightness-110 active:translate-y-px disabled:opacity-40 disabled:shadow-none",
    ghost:
      "border border-line bg-panel text-ink hover:border-accent/50 hover:bg-raised active:translate-y-px disabled:opacity-40",
    danger:
      "border border-danger/40 bg-transparent text-danger hover:bg-danger/10",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${style} ${className}`}
    >
      {children}
    </button>
  );
}
