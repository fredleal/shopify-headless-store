import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { JsonLd } from "./JsonLd";

describe("JsonLd", () => {
  const sampleData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Test Product",
    description: "A test product for unit testing.",
  };

  it("renders a script tag with type application/ld+json", () => {
    const { container } = render(<JsonLd data={sampleData} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );

    expect(script).not.toBeNull();
  });

  it("contains the JSON-stringified data as content", () => {
    const { container } = render(<JsonLd data={sampleData} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );

    expect(script?.innerHTML).toBe(JSON.stringify(sampleData));
  });

  it("serializes nested objects correctly", () => {
    const nestedData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Nested Product",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "10.00",
        highPrice: "20.00",
      },
    };

    const { container } = render(<JsonLd data={nestedData} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const parsed = JSON.parse(script?.innerHTML || "{}");

    expect(parsed.offers["@type"]).toBe("AggregateOffer");
    expect(parsed.offers.lowPrice).toBe("10.00");
  });

  it("handles empty data object", () => {
    const { container } = render(<JsonLd data={{}} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );

    expect(script?.innerHTML).toBe("{}");
  });
});
