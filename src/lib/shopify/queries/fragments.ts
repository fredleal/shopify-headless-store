export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

export const VARIANT_FRAGMENT = /* GraphQL */ `
  fragment VariantFields on ProductVariant {
    id
    title
    availableForSale
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
    image {
      ...ImageFields
    }
  }
`;

export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    featuredImage {
      ...ImageFields
    }
    images(first: 10) {
      edges {
        node {
          ...ImageFields
        }
      }
    }
    variants(first: 50) {
      edges {
        node {
          ...VariantFields
        }
      }
    }
    options {
      id
      name
      values
    }
    seo {
      title
      description
    }
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

export const COLLECTION_FRAGMENT = /* GraphQL */ `
  fragment CollectionFields on Collection {
    id
    handle
    title
    description
    image {
      ...ImageFields
    }
  }
`;

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                handle
                title
                featuredImage {
                  ...ImageFields
                }
              }
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
