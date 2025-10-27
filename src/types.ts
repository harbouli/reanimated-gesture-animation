export interface OrderItem {
  id: string;
  name: string;
  hasPromo: boolean;
  quantity?: number;
  price?: string;
  promoText?: string;
}
