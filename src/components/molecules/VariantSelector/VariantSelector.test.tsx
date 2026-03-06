import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VariantSelector } from "./VariantSelector";

const mockOptions = [
  { name: "Size", values: ["Small", "Medium", "Large"] },
  { name: "Color", values: ["Black", "Brown"] },
];

describe("VariantSelector", () => {
  it("renders all option group names", () => {
    render(
      <VariantSelector
        options={mockOptions}
        selectedOptions={{ Size: "Small", Color: "Black" }}
        onOptionChange={() => {}}
      />,
    );

    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("Color")).toBeInTheDocument();
  });

  it("renders all option values as buttons", () => {
    render(
      <VariantSelector
        options={mockOptions}
        selectedOptions={{ Size: "Small", Color: "Black" }}
        onOptionChange={() => {}}
      />,
    );

    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Large")).toBeInTheDocument();
    expect(screen.getByText("Black")).toBeInTheDocument();
    expect(screen.getByText("Brown")).toBeInTheDocument();
  });

  it("calls onOptionChange with name and value when option is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <VariantSelector
        options={mockOptions}
        selectedOptions={{ Size: "Small", Color: "Black" }}
        onOptionChange={handleChange}
      />,
    );

    await user.click(screen.getByText("Medium"));
    expect(handleChange).toHaveBeenCalledWith("Size", "Medium");
  });

  it("marks the selected option as pressed", () => {
    render(
      <VariantSelector
        options={mockOptions}
        selectedOptions={{ Size: "Small", Color: "Black" }}
        onOptionChange={() => {}}
      />,
    );

    const smallButton = screen.getByRole("button", { name: /^Small$/ });
    expect(smallButton).toHaveAttribute("aria-pressed", "true");

    const mediumButton = screen.getByRole("button", { name: /^Medium$/ });
    expect(mediumButton).toHaveAttribute("aria-pressed", "false");
  });

  it("renders fieldset with legend for each option group", () => {
    render(
      <VariantSelector
        options={mockOptions}
        selectedOptions={{ Size: "Small", Color: "Black" }}
        onOptionChange={() => {}}
      />,
    );

    const fieldsets = document.querySelectorAll("fieldset");
    expect(fieldsets).toHaveLength(2);
  });
});
