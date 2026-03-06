export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandiseId: string;
  variantTitle: string;
  productHandle: string;
  productTitle: string;
  productImage: ShopifyImage | null;
  price: ShopifyMoneyV2;
  selectedOptions: { name: string; value: string }[];
  totalAmount: ShopifyMoneyV2;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyMoneyV2;
    subtotalAmount: ShopifyMoneyV2;
    totalTaxAmount: ShopifyMoneyV2 | null;
  };
  lines: CartLine[];
}
