import type { ReactNode } from "react";
import type { Maturity, Priority, Track } from "@/data/types";
import { MATURITY_LABEL } from "@/data/types";

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
      className={`scroll-mt-6 rounded-xl border border-line bg-panel ${className}`}
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
        <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-faint">
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
          <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
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

export function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
}) {
  return (
    <div className="px-5 py-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-faint">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
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
      className={`rounded border px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider ${PRIORITY_STYLE[priority]}`}
    >
      {priority}
    </span>
  );
}

export const TRACK_COLOR: Record<Track, string> = {
  ai: "text-track-ai",
  software: "text-track-software",
  production: "text-track-production",
  career: "text-track-career",
};

export const TRACK_DOT: Record<Track, string> = {
  ai: "bg-track-ai",
  software: "bg-track-software",
  production: "bg-track-production",
  career: "bg-track-career",
};

export function TrackBadge({ track }: { track: Track }) {
  const label = {
    ai: "AI",
    software: "Software",
    production: "Production",
    career: "Career",
  }[track];
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-medium uppercase tracking-wider text-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${TRACK_DOT[track]}`} />
      {label}
    </span>
  );
}

const MATURITY_STYLE: Record<Maturity, string> = {
  "not-started": "border-line text-faint",
  awareness: "border-line text-muted",
  understanding: "border-line text-muted",
  practicing: "border-accent/30 text-accent",
  implementing: "border-accent/40 text-accent",
  applied: "border-teal/40 text-teal",
  engineering: "border-teal/50 text-teal",
  strong: "border-ok/50 text-ok",
};

export function MaturityBadge({ maturity }: { maturity: Maturity }) {
  return (
    <span
      className={`rounded border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${MATURITY_STYLE[maturity]}`}
    >
      {MATURITY_LABEL[maturity]}
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
    <code className="rounded bg-raised px-1.5 py-0.5 font-mono text-[0.72rem] text-teal">
      {path}
    </code>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-muted">
        {description}
      </p>
    </div>
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
      "bg-accent text-[#0a0b0e] hover:brightness-110 disabled:opacity-40",
    ghost:
      "border border-line bg-raised text-ink hover:border-accent/50 disabled:opacity-40",
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
