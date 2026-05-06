export interface OrderDTO {
  id: string;
  customerId: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  items: OrderItemDTO[];
}

export interface OrderItemDTO {
  productId: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    imageUrl?: string;
  };
}
