"use client";

const CATEGORIES = [
  { label: "Todos", bodyType: "" },
  { label: "Autos", bodyType: "Auto" },
  { label: "SUV", bodyType: "SUV" },
  { label: "Camionetas", bodyType: "Camioneta" },
  { label: "Motos", bodyType: "Moto" },
  { label: "Camiones", bodyType: "Camión" },
];

/** Horizontal row of category pills; the selected one is filled. "" means all. */
export default function CategoryScroller({
  value,
  onChange,
}: {
  value: string;
  onChange: (bodyType: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Categorías de vehículos"
      data-testid="category-scroller"
      className="flex snap-x gap-2 overflow-x-auto py-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {CATEGORIES.map(({ label, bodyType }) => {
        const selected = value === bodyType;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(bodyType)}
            className={`shrink-0 snap-start whitespace-nowrap px-3 py-1 text-xs font-medium underline-offset-[6px] transition-[color,transform] duration-150 active:scale-[0.97] ${
              selected
                ? "text-fg underline decoration-2"
                : "text-muted hover:text-fg"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
