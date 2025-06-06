// Database Models for Plandid

export enum VendorCategory {
  PHOTO = "photo",
  VIDEO = "video",
  CONTENT = "content",
}

export enum ServiceType {
  ENGAGEMENT_SHOOT = "Engagement Shoot",
  WEDDING_ALBUM = "Wedding Album",
  PRINTS = "Prints",
  SNEAK_PEAKS = "Sneak Peaks within 72hrs",
  BOUDOIR_SESSION = "Boudoir Session",
  REHEARSAL_DINNER = "Rehearsal Dinner Coverage",
  DRONE_PHOTOGRAPHY = "Drone Photography",
  FILM_PHOTO_ADDON = "Film Photo Add-On",
}

export interface User {
  id: string;
  name: string;
  email: string;
  weddingDate?: Date;
  favoriteVendors: string[]; // vendor IDs
}

export interface VendorImage {
  id: string;
  url: string;
  vendorId: string;
  order: number;
}

export interface VendorStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  vendorId: string;
}

export interface Review {
  id: string;
  vendorId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  text: string;
  createdAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  location: string;
  tagline: string;
  description: string;
  rating: number;
  reviewCount: number;
  services: ServiceType[];
  styles: VendorStyle[];
  images: VendorImage[];
  reviews: Review[];
  hasInstantQuote: boolean;
  hasAvailability: boolean;
  availability?: Date[]; // Available dates
}
