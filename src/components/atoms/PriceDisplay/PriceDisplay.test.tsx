import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceDisplay } from "./PriceDisplay";

describe("PriceDisplay", () => {
  it("renders formatted USD price", () => {
    render(<PriceDisplay amount="29.99" currencyCode="USD" />);

    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("renders formatted EUR price", () => {
    render(<PriceDisplay amount="49.00" currencyCode="EUR" />);

    expect(screen.getByText("€49.00")).toBeInTheDocument();
  });

  it("applies size classes via object-map", () => {
    const { container } = render(
      <PriceDisplay amount="10.00" currencyCode="USD" size="lg" />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("text-xl");
  });

  it("applies default md size when no size prop given", () => {
    const { container } = render(
      <PriceDisplay amount="10.00" currencyCode="USD" />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("text-base");
  });

  it("shows compare-at price with strikethrough when discount exists", () => {
    render(
      <PriceDisplay
        amount="80.00"
        currencyCode="USD"
        compareAtAmount="100.00"
      />,
    );

    expect(screen.getByText("$80.00")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();

    const strikethrough = screen.getByText("$100.00");
    expect(strikethrough.className).toContain("line-through");
  });

  it("does not show compare-at price when there is no discount", () => {
    render(
      <PriceDisplay
        amount="100.00"
        currencyCode="USD"
        compareAtAmount="100.00"
      />,
    );

    const allPrices = screen.getAllByText("$100.00");
    expect(allPrices).toHaveLength(1);
  });

  it("applies custom className", () => {
    const { container } = render(
      <PriceDisplay
        amount="10.00"
        currencyCode="USD"
        className="my-custom-class"
      />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("my-custom-class");
  });
});
