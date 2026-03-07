"use client";

import { OptionButton } from "@/components/atoms/OptionButton/OptionButton";

export interface VariantSelectorProps {
  options: { name: string; values: string[] }[];
  selectedOptions: Record<string, string>;
  onOptionChange: (name: string, value: string) => void;
}

export function VariantSelector({
  options,
  selectedOptions,
  onOptionChange,
}: VariantSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => (
        <fieldset key={option.name}>
          <legend className="mb-2 text-sm font-medium text-[var(--color-gray-700,#374151)]">
            {option.name}
          </legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => (
              <OptionButton
                key={value}
                value={value}
                selected={selectedOptions[option.name] === value}
                available={true}
                onClick={() => onOptionChange(option.name, value)}
              />
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
