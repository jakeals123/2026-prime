export enum ItemStatus {
  AVAILABLE = '대여가능',
  RENTED = '대여중'
}

export interface RenterInfo {
  name: string;
  contact: string; // Email or Phone
  rentDate: string; // ISO String
  expectedReturnDate: string; // ISO String
}

export interface RentalItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string; // Made optional
  status: ItemStatus;
  renter?: RenterInfo;
}

export enum ViewMode {
  LANDING = 'LANDING',
  ADMIN = 'ADMIN',
  USER = 'USER'
}