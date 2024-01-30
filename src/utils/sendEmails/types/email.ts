export interface ClientEmail {
  name: string;
  email: string;
}

export interface ContextProductEmail {
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface ContextClientEmail extends ClientEmail {
  district: string;
  street: string;
  number: string;
  city: string;
  state: string;
  cep: string;
}

export interface ContextHtmlEmail extends ContextClientEmail {
  orderId: number;
  products: Array<ContextProductEmail>;
  totalValue: number;
}
