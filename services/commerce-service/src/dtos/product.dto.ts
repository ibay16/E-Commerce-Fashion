export interface ProductDTO {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: {
    name: string;
  };
  variants: ProductVariantDTO[];
}

export interface ProductVariantDTO {
  id: string;
  size: string;
  stock: number;
}
