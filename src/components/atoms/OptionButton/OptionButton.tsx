"use client";

export interface OptionButtonProps {
  value: string;
  selected: boolean;
  available: boolean;
  onClick: () => void;
}

const stateClasses: Record<string, string> = {
  selected: "border-primary bg-primary-50 text-primary-700 ring-1 ring-primary",
  available:
    "border-secondary-300 bg-white text-secondary-700 hover:border-secondary-400",
  unavailable:
    "border-secondary-200 bg-secondary-50 text-secondary-400 line-through cursor-not-allowed opacity-60",
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
