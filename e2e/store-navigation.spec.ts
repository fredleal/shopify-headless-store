import { test, expect } from "@playwright/test";

test.describe("Store Navigation", () => {
  test("home page loads with products and collections", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Shopify Headless Store");
    await expect(page.getByText("Featured Products")).toBeVisible();
    await expect(page.getByText("Collections")).toBeVisible();
  });

  test("navigate to products page", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("h1")).toContainText("All Products");
  });

  test("navigate to product detail page from products", async ({ page }) => {
    await page.goto("/products");
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await firstProduct.click();
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /add.*cart|sold out/i }),
    ).toBeVisible();
  });

  test("navigate to collections page", async ({ page }) => {
    await page.goto("/collections");
    await expect(page.locator("h1")).toContainText("Collections");
  });

  test("navigate to collection detail from collections", async ({ page }) => {
    await page.goto("/collections");
    const firstCollection = page.locator('a[href^="/collections/"]').first();
    await firstCollection.click();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("cart page shows empty state", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByText("Your cart is empty")).toBeVisible();
    await expect(page.getByText("Continue Shopping")).toBeVisible();
  });
});

test.describe("SEO", () => {
  test("product page has JSON-LD structured data", async ({ page }) => {
    await page.goto("/products");
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await firstProduct.click();

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd.first()).toBeAttached();

    const content = await jsonLd.first().textContent();
    const data = JSON.parse(content!);
    expect(data["@type"]).toBe("Product");
    expect(data.name).toBeTruthy();
  });

  test("collection page has JSON-LD structured data", async ({ page }) => {
    await page.goto("/collections");
    const firstCollection = page.locator('a[href^="/collections/"]').first();
    await firstCollection.click();

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd.first()).toBeAttached();

    const content = await jsonLd.first().textContent();
    const data = JSON.parse(content!);
    expect(data["@type"]).toBe("CollectionPage");
  });

  test("product page has meta description", async ({ page }) => {
    await page.goto("/products");
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await firstProduct.click();

    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute("content", /.+/);
  });
});

test.describe("Add to Cart Flow", () => {
  test("add product to cart and view in cart page", async ({ page }) => {
    await page.goto("/products");
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await firstProduct.click();

    const addButton = page.getByRole("button", { name: /add.*cart/i });
    if (await addButton.isEnabled()) {
      await addButton.click();
      // Wait for the button to finish loading
      await expect(addButton).not.toContainText("Adding...", {
        timeout: 10000,
      });

      // Navigate to cart
      await page.goto("/cart");
      // Cart should have items now (not empty)
      await expect(page.getByText("Your cart is empty")).not.toBeVisible({
        timeout: 5000,
      });
      await expect(page.getByTestId("cart-view")).toBeVisible();
      await expect(page.getByTestId("checkout-link")).toBeVisible();
    }
  });
});
