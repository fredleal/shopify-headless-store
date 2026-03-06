"use client";

export interface OptionButtonProps {
  value: string;
  selected: boolean;
  available: boolean;
  onClick: () => void;
}

const stateClasses: Record<string, string> = {
  selected:
    "border-[var(--color-primary-500,#3b82f6)] bg-[var(--color-primary-50,#eff6ff)] text-[var(--color-primary-700,#1d4ed8)] ring-1 ring-[var(--color-primary-500,#3b82f6)]",
  available:
    "border-[var(--color-gray-300,#d1d5db)] bg-white text-[var(--color-gray-700,#374151)] hover:border-[var(--color-gray-400,#9ca3af)]",
  unavailable:
    "border-[var(--color-gray-200,#e5e7eb)] bg-[var(--color-gray-50,#f9fafb)] text-[var(--color-gray-400,#9ca3af)] line-through cursor-not-allowed opacity-60",
};

function getStateKey(selected: boolean, available: boolean): string {
  if (selected) return "selected";
  if (!available) return "unavailable";
  return "available";
}

export function OptionButton({
  value,
  selected,
  available,
  onClick,
}: OptionButtonProps) {
  const stateKey = getStateKey(selected, available);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!available}
      aria-pressed={selected}
      aria-label={`${value}${!available ? " (unavailable)" : ""}`}
      className={`rounded-md border px-3 py-2 text-sm font-medium transition-all duration-150 ${stateClasses[stateKey]}`}
    >
      {value}
    </button>
  );
}
