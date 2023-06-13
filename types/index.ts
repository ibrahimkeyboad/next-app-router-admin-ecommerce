export interface PropertyType {
  name: string;
  values: string[];
}

export interface CategoryType {
  _id?: string;
  name: string;
  parent?: {
    _id: string;
    name: string;
    properties?: PropertyType[];
  };
  properties?: PropertyType[];
}

export interface LineItem {
  price_data: {
    product_data: {
      name: string;
    };
  };
  quantity: number;
}

export interface OrderType {
  _id: string;
  line_items: LineItem[];
  name: string;
  email: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  country: string;
  paid: boolean;
  createdAt: Date;
}

export interface ProductType {
  _id: any;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: CategoryType;
  properties: PropertyType[];
}

export interface CategoryDataType {
  _id?: string;
  name: string;
  parent?: string;
  properties: PropertyType[];
}
