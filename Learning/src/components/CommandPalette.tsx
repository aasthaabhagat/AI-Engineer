"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { blueprints, days, phases, projects, skills } from "@/data";
import { designBriefs } from "@/data/systemDesigns";
import { radarEntries } from "@/data/radar";
import { careerAreas } from "@/data/career";
import { useStore } from "@/lib/store";

interface Item {
  id: string;
  label: string;
  group: string;
  hint?: string;
  run: () => void;
}

/** Global search and navigation. Cmd/Ctrl+K anywhere. */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const { state } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    // The search button in the header has no reference to this component,
    // so it asks for the palette through an event instead.
    const onRequest = () => setOpen(true);

    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onRequest);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onRequest);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      router.push(href);
      setOpen(false);
    };

    const nav: Item[] = [
      { id: "n-today", label: "Today", group: "Go to", run: go("/") },
      { id: "n-road", label: "Plan · Roadmap", group: "Go to", run: go("/plan/roadmap") },
      { id: "n-cal", label: "Plan · Calendar", group: "Go to", run: go("/plan/calendar") },
      { id: "n-skills", label: "Plan · Skills", group: "Go to", run: go("/plan/skills") },
      { id: "n-proj", label: "Plan · Projects", group: "Go to", run: go("/plan/projects") },
      { id: "n-ready", label: "Plan · Readiness", group: "Go to", run: go("/plan/readiness") },
      { id: "n-rev", label: "Plan · Reviews", group: "Go to", run: go("/plan/reviews") },
      { id: "n-bp", label: "Library · Patterns", group: "Go to", run: go("/library/patterns") },
      { id: "n-sd", label: "Library · System Design", group: "Go to", run: go("/library/system-design") },
      { id: "n-radar", label: "Library · AI Radar", group: "Go to", run: go("/library/radar") },
      { id: "n-know", label: "Library · Journal", group: "Go to", run: go("/library/journal") },
      { id: "n-set", label: "Settings", group: "Go to", run: go("/settings") },
      { id: "n-focus", label: "Start focus mode", group: "Actions", run: go("/?focus=1") },
    ];

    const dayItems: Item[] = days.map((d) => ({
      id: `d-${d.id}`,
      label: `Day ${d.dayNumber}: ${d.title}`,
      group: "Days",
      hint: state.completedDays[d.id] ? "completed" : undefined,
      run: go(`/day/${d.dayNumber}`),
    }));

    const skillItems: Item[] = skills.map((s) => ({
      id: `s-${s.id}`,
      label: s.name,
      group: "Skills",
      hint: s.category,
      run: go(`/plan/skills#${s.id}`),
    }));

    const projectItems: Item[] = projects.map((p) => ({
      id: `p-${p.id}`,
      label: p.name,
      group: "Projects",
      hint: p.repoPath,
      run: go(`/plan/projects#${p.id}`),
    }));

    const phaseItems: Item[] = phases.map((p) => ({
      id: `ph-${p.id}`,
      label: `Phase ${p.order}: ${p.title}`,
      group: "Phases",
      run: go(`/plan/roadmap#${p.id}`),
    }));

    const blueprintItems: Item[] = blueprints.map((b) => ({
      id: `b-${b.id}`,
      label: b.name,
      group: "Blueprints",
      hint: b.category,
      run: go(`/library/patterns#${b.id}`),
    }));

    const designItems: Item[] = designBriefs.map((d) => ({
      id: `sd-${d.id}`,
      label: d.title,
      group: "System design",
      run: go(`/library/system-design#${d.id}`),
    }));

    const radarItems: Item[] = radarEntries.map((r) => ({
      id: `rd-${r.id}`,
      label: r.name,
      group: "Radar",
      hint: r.category,
      run: go(`/library/radar#${r.id}`),
    }));

    const careerItems: Item[] = careerAreas.map((c) => ({
      id: `ca-${c.id}`,
      label: c.name,
      group: "Career",
      run: go(`/plan/readiness#${c.id}`),
    }));

    const noteItems: Item[] = state.notes.map((n) => ({
      id: `nt-${n.id}`,
      label: n.title,
      group: "Notes",
      hint: n.kind,
      run: go("/library/journal"),
    }));

    return [
      ...nav,
      ...dayItems,
      ...phaseItems,
      ...skillItems,
      ...projectItems,
      ...blueprintItems,
      ...designItems,
      ...radarItems,
      ...careerItems,
      ...noteItems,
    ];
  }, [router, state.completedDays, state.notes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 12);
    return items
      .filter(
        (i) =>
          i.label.toLowerCase().includes(q) ||
          i.group.toLowerCase().includes(q) ||
          i.hint?.toLowerCase().includes(q),
      )
      .slice(0, 40);
  }, [items, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 border-b border-line-soft px-4">
          <Search size={15} className="text-faint" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                filtered[cursor]?.run();
              }
            }}
            placeholder="Search days, skills, projects, notes…"
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-faint"
            aria-label="Search"
          />
        </div>

        <ul className="max-h-[52vh] overflow-y-auto py-1.5">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-xs text-muted">
              Nothing matches that.
            </li>
          )}
          {filtered.map((item, i) => (
            <li key={item.id}>
              <button
                onClick={item.run}
                onMouseEnter={() => setCursor(i)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm ${
                  i === cursor ? "bg-accent-soft text-accent" : "text-ink"
                }`}
              >
                <span className="truncate">{item.label}</span>
                <span className="shrink-0 text-xs uppercase tracking-wider text-faint">
                  {item.hint ?? item.group}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
