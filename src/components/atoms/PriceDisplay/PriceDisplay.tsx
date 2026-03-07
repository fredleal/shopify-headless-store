export interface PriceDisplayProps {
  amount: string;
  currencyCode: string;
  compareAtAmount?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

export function PriceDisplay({
  amount,
  currencyCode,
  compareAtAmount,
  size = "md",
  className = "",
}: PriceDisplayProps) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));

  const hasDiscount =
    compareAtAmount && parseFloat(compareAtAmount) > parseFloat(amount);

  const formattedCompare = hasDiscount
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
      }).format(parseFloat(compareAtAmount))
    : null;

  return (
    <span
      className={`inline-flex items-center gap-2 ${sizeClasses[size]} ${className}`}
    >
      <span
        className={`font-semibold ${hasDiscount ? "text-accent-red-600" : "text-secondary-900"}`}
      >
        {formatted}
      </span>
      {hasDiscount && formattedCompare && (
        <span className="text-secondary-400 line-through">
          {formattedCompare}
        </span>
      )}
    </span>
  );
}
