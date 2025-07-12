export interface ImageI {
  thumbnail: string;
  mobile: string;
  tablet: string;
  desktop: string;
}

export interface Data {
  image: ImageI;
  name: string;
  category: string;
  price: number;
  active: boolean;
}

export interface CartItem {
  productName: string;
  quantity: number;
  price: string;
  active: boolean;
}

type Action = 'increment' | 'decrement';

export interface DataType {
  productName: string;
  actionType: Action;
}
