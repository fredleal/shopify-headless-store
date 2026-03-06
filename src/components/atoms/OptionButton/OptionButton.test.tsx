import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OptionButton } from "./OptionButton";

describe("OptionButton", () => {
  it("renders the value text", () => {
    render(
      <OptionButton
        value="Small"
        selected={false}
        available={true}
        onClick={() => {}}
      />,
    );

    expect(screen.getByText("Small")).toBeInTheDocument();
  });

  it("calls onClick when clicked and available", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <OptionButton
        value="Medium"
        selected={false}
        available={true}
        onClick={handleClick}
      />,
    );

    await user.click(screen.getByText("Medium"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when not available", () => {
    render(
      <OptionButton
        value="Large"
        selected={false}
        available={false}
        onClick={() => {}}
      />,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("does not call onClick when unavailable", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <OptionButton
        value="Large"
        selected={false}
        available={false}
        onClick={handleClick}
      />,
    );

    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("has aria-pressed when selected", () => {
    render(
      <OptionButton
        value="Small"
        selected={true}
        available={true}
        onClick={() => {}}
      />,
    );

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("has aria-pressed false when not selected", () => {
    render(
      <OptionButton
        value="Small"
        selected={false}
        available={true}
        onClick={() => {}}
      />,
    );

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("includes unavailable in aria-label when not available", () => {
    render(
      <OptionButton
        value="XL"
        selected={false}
        available={false}
        onClick={() => {}}
      />,
    );

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "XL (unavailable)",
    );
  });

  it("applies selected visual state classes", () => {
    render(
      <OptionButton
        value="Small"
        selected={true}
        available={true}
        onClick={() => {}}
      />,
    );

    const button = screen.getByRole("button");
    expect(button.className).toContain("ring-1");
  });
});
