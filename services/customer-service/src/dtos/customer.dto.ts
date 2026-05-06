export interface CustomerDTO {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: Date;
}

export interface AddressDTO {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  city: string;
  province: string;
  postalCode: string;
  isPrimary: boolean;
}

export interface PaymentMethodDTO {
  id: string;
  provider: string;
  label: string;
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
}
