export interface PropertyValue {
  value: string;
  is_default: boolean;
  id?: number;
}

export interface Property {
  name: string;
  desc?: string;
  values: PropertyValue[];
}

export interface Good {
  id: number;
  name: string;
  content: string;
  price: number;
  images: string;
  number?: number;
  use_property: boolean;
  property?: Property[];
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  goods_list: Good[];
}

export interface CartItem {
  id: number;
  category_id: number;
  name: string;
  price: number;
  number: number;
  props_text: string;
  property: Property[];
}

export interface Store {
  name: string;
  distance_text: string;
  packing_fee: number;
  min_price: number;
}

export interface Address {
  street: string;
}

export interface State {
  cart: {
    list: CartItem[];
  };
  config: {
    minDeliveryAmount: number;
  };
  user: {
    address: Address | null;
  };
} 