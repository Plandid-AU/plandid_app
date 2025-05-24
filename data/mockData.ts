import { Review, ServiceType, Vendor, VendorCategory } from "../types";

// Helper function to generate available dates for next year
const generateAvailableDates = (excludeDates: Date[] = []): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date();
  const nextYear = currentDate.getFullYear() + 1;

  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 28; day += 7) {
      // Every Saturday
      const date = new Date(nextYear, month, day);
      if (date.getDay() === 6) {
        // Ensure it's Saturday
        dates.push(date);
      }
    }
  }

  return dates.filter(
    (date) =>
      !excludeDates.some((excluded) => excluded.getTime() === date.getTime())
  );
};

// Mock Reviews
const mockReviews: Review[] = [
  {
    id: "1",
    vendorId: "1",
    userId: "user1",
    userName: "Kevin",
    userImage: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&fm=jpg&q=80&t=${Date.now()}`,
    rating: 5,
    text: "Artful Lens exceeded all our expectations. We had two photographers on the day and they captured every single moment perfectly. The photos are absolutely stunning and we couldn't be happier!",
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "2",
    vendorId: "1",
    userId: "user2",
    userName: "Sarah",
    userImage: `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&fm=jpg&q=80&t=${Date.now()}`,
    rating: 5,
    text: "Professional, creative, and so easy to work with. They made us feel comfortable throughout the entire day.",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    vendorId: "1",
    userId: "user3",
    userName: "Michael",
    userImage: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&fm=jpg&q=80&t=${Date.now()}`,
    rating: 4,
    text: "Beautiful photos! The team was great and very professional.",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "4",
    vendorId: "1",
    userId: "user4",
    userName: "Emma",
    userImage: `https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&fm=jpg&q=80&t=${Date.now()}`,
    rating: 5,
    text: "Amazing experience from start to finish. Highly recommend!",
    createdAt: new Date("2023-12-05"),
  },
  {
    id: "5",
    vendorId: "1",
    userId: "user5",
    userName: "David",
    userImage: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face&fm=jpg&q=80&t=${Date.now()}`,
    rating: 5,
    text: "The quality of work is exceptional. Worth every penny!",
    createdAt: new Date("2023-11-15"),
  },
];

// Mock Vendors
export const mockVendors: Vendor[] = [
  // Photographers
  {
    id: "1",
    name: "Artful Lens",
    category: VendorCategory.PHOTO,
    location: "Melbourne, VIC",
    tagline: "Moments in Motion. Memories in Focus.",
    description:
      "Artful Lens is a wedding photography studio that captures the raw, emotional, and unforgettable moments of your special day with timeless elegance and artistic precision. Blending documentary-style storytelling with a fine art aesthetic, Artful Lens delivers deeply personal imagery that reflects the unique soul of every couple's love story. We believe wedding photography isn't just about taking pictures—it's about preserving the emotions, the laughter, the tears, and the unscripted moments that make your wedding uniquely yours.",
    rating: 4.76,
    reviewCount: 5,
    deliveryTime: "All photos will be delivered within 6 weeks from shooting",
    services: [
      ServiceType.ENGAGEMENT_SHOOT,
      ServiceType.WEDDING_ALBUM,
      ServiceType.PRINTS,
      ServiceType.SNEAK_PEAKS,
      ServiceType.BOUDOIR_SESSION,
      ServiceType.REHEARSAL_DINNER,
      ServiceType.DRONE_PHOTOGRAPHY,
      ServiceType.FILM_PHOTO_ADDON,
    ],
    styles: [
      {
        id: "style1",
        name: "Candid and Natural",
        description:
          "Capturing real moments with genuine emotion and timeless beauty",
        imageUrl: `https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&h=200&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "1",
      },
      {
        id: "style2",
        name: "Light and Airy",
        description:
          "Soft tones and bright highlights for a fresh, romantic feel",
        imageUrl: `https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=200&h=200&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "1",
      },
      {
        id: "style3",
        name: "Film-look",
        description:
          "Rich tones and subtle grain for a nostalgic, cinematic feel",
        imageUrl: `https://images.unsplash.com/photo-1519741497674-611481863552?w=200&h=200&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "1",
      },
    ],
    images: [
      {
        id: "img1",
        url: `https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "1",
        order: 1,
      },
      {
        id: "img2",
        url: `https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "1",
        order: 2,
      },
      {
        id: "img3",
        url: `https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "1",
        order: 3,
      },
      {
        id: "img4",
        url: `https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "1",
        order: 4,
      },
      {
        id: "img1a",
        url: `https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "1",
        order: 5,
      },
      {
        id: "img1b",
        url: `https://images.unsplash.com/photo-1525258807787-8757f08c0f2c?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "1",
        order: 6,
      },
    ],
    reviews: mockReviews.filter((r) => r.vendorId === "1"),
    hasInstantQuote: true,
    hasAvailability: true,
    availability: generateAvailableDates([new Date(2026, 11, 18)]), // Excluding Dec 18, 2026
  },
  {
    id: "2",
    name: "Golden Hour Photography",
    category: VendorCategory.PHOTO,
    location: "Sydney, NSW",
    tagline: "Capturing Love in Perfect Light",
    description:
      "Specializing in romantic, sun-kissed wedding photography that tells your unique love story.",
    rating: 4.9,
    reviewCount: 12,
    deliveryTime: "Photos delivered within 4 weeks",
    services: [
      ServiceType.ENGAGEMENT_SHOOT,
      ServiceType.WEDDING_ALBUM,
      ServiceType.PRINTS,
      ServiceType.SNEAK_PEAKS,
    ],
    styles: [
      {
        id: "style4",
        name: "Golden Hour Magic",
        description: "Warm, glowing light for romantic portraits",
        imageUrl: `https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=200&h=200&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "2",
      },
      {
        id: "style5",
        name: "Classic Elegance",
        description: "Timeless, sophisticated wedding photography",
        imageUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "2",
      },
    ],
    images: [
      {
        id: "img5",
        url: `https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "2",
        order: 1,
      },
      {
        id: "img6",
        url: `https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "2",
        order: 2,
      },
      {
        id: "img7",
        url: `https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "2",
        order: 3,
      },
      {
        id: "img2a",
        url: `https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "2",
        order: 4,
      },
      {
        id: "img2b",
        url: `https://images.unsplash.com/photo-1556800440-57ad3da1251c?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "2",
        order: 5,
      },
    ],
    reviews: [],
    hasInstantQuote: true,
    hasAvailability: false,
    availability: generateAvailableDates(),
  },
  {
    id: "3",
    name: "Dreamy Moments Studio",
    category: VendorCategory.PHOTO,
    location: "Brisbane, QLD",
    tagline: "Where Dreams Meet Reality",
    description:
      "Creating magical wedding memories through artistic photography.",
    rating: 4.8,
    reviewCount: 8,
    deliveryTime: "5 weeks delivery time",
    services: [
      ServiceType.WEDDING_ALBUM,
      ServiceType.PRINTS,
      ServiceType.DRONE_PHOTOGRAPHY,
    ],
    styles: [
      {
        id: "style6",
        name: "Fairytale Romance",
        description: "Whimsical and enchanting photography style",
        imageUrl: `https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&h=200&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "3",
      },
    ],
    images: [
      {
        id: "img8",
        url: `https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "3",
        order: 1,
      },
      {
        id: "img9",
        url: `https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "3",
        order: 2,
      },
      {
        id: "img3a",
        url: `https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "3",
        order: 3,
      },
      {
        id: "img3b",
        url: `https://images.unsplash.com/photo-1486591978090-58e04e6bb97a?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "3",
        order: 4,
      },
    ],
    reviews: [],
    hasInstantQuote: false,
    hasAvailability: true,
    availability: generateAvailableDates(),
  },

  // Videographers
  {
    id: "4",
    name: "Cinematic Weddings",
    category: VendorCategory.VIDEO,
    location: "Melbourne, VIC",
    tagline: "Your Love Story in Motion",
    description:
      "Award-winning wedding videography that captures every emotion.",
    rating: 4.95,
    reviewCount: 20,
    deliveryTime: "Video delivered within 8 weeks",
    services: [
      ServiceType.ENGAGEMENT_SHOOT,
      ServiceType.SNEAK_PEAKS,
      ServiceType.REHEARSAL_DINNER,
      ServiceType.DRONE_PHOTOGRAPHY,
    ],
    styles: [
      {
        id: "style7",
        name: "Cinematic Documentary",
        description: "Film-style storytelling of your wedding day",
        imageUrl: `https://images.unsplash.com/photo-1478720568477-b956dc596103?w=200&h=200&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "4",
      },
      {
        id: "style8",
        name: "Modern & Minimal",
        description: "Clean, contemporary wedding films",
        imageUrl: `https://images.unsplash.com/photo-1519741497674-611481863552?w=200&h=200&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "4",
      },
    ],
    images: [
      {
        id: "img10",
        url: `https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "4",
        order: 1,
      },
      {
        id: "img11",
        url: `https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "4",
        order: 2,
      },
      {
        id: "img12",
        url: `https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "4",
        order: 3,
      },
    ],
    reviews: [],
    hasInstantQuote: true,
    hasAvailability: true,
    availability: generateAvailableDates(),
  },
  {
    id: "5",
    name: "Epic Films Co",
    category: VendorCategory.VIDEO,
    location: "Sydney, NSW",
    tagline: "Epic Stories, Beautifully Told",
    description: "Creating cinematic masterpieces of your special day.",
    rating: 4.7,
    reviewCount: 15,
    deliveryTime: "10 weeks for full edit",
    services: [ServiceType.SNEAK_PEAKS, ServiceType.DRONE_PHOTOGRAPHY],
    styles: [
      {
        id: "style9",
        name: "Hollywood Glamour",
        description: "Dramatic, movie-quality wedding films",
        imageUrl: `https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "5",
      },
    ],
    images: [
      {
        id: "img13",
        url: `https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "5",
        order: 1,
      },
      {
        id: "img14",
        url: `https://images.unsplash.com/photo-1525258807787-8757f08c0f2c?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "5",
        order: 2,
      },
    ],
    reviews: [],
    hasInstantQuote: false,
    hasAvailability: true,
    availability: generateAvailableDates(),
  },

  // Content Creators
  {
    id: "6",
    name: "Social Butterfly Studios",
    category: VendorCategory.CONTENT,
    location: "Melbourne, VIC",
    tagline: "Content That Goes Viral",
    description: "Professional content creation for your wedding social media.",
    rating: 4.85,
    reviewCount: 10,
    deliveryTime: "Same-day social media content",
    services: [ServiceType.SNEAK_PEAKS, ServiceType.ENGAGEMENT_SHOOT],
    styles: [
      {
        id: "style10",
        name: "TikTok Trends",
        description: "Trendy, shareable wedding content",
        imageUrl: `https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=200&h=200&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "6",
      },
      {
        id: "style11",
        name: "Instagram Reels",
        description: "Perfect for your Instagram feed",
        imageUrl: `https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=200&h=200&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "6",
      },
    ],
    images: [
      {
        id: "img15",
        url: `https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "6",
        order: 1,
      },
      {
        id: "img16",
        url: `https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "6",
        order: 2,
      },
      {
        id: "img17",
        url: `https://images.unsplash.com/photo-1556800440-57ad3da1251c?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "6",
        order: 3,
      },
    ],
    reviews: [],
    hasInstantQuote: true,
    hasAvailability: true,
    availability: generateAvailableDates(),
  },
  {
    id: "7",
    name: "Viral Vows",
    category: VendorCategory.CONTENT,
    location: "Sydney, NSW",
    tagline: "Making Your Wedding Famous",
    description: "Expert social media content creation for modern couples.",
    rating: 4.6,
    reviewCount: 6,
    deliveryTime: "24-hour turnaround",
    services: [ServiceType.SNEAK_PEAKS],
    styles: [
      {
        id: "style12",
        name: "Behind The Scenes",
        description: "Authentic, raw wedding moments",
        imageUrl: `https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&h=200&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "7",
      },
    ],
    images: [
      {
        id: "img18",
        url: `https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "7",
        order: 1,
      },
      {
        id: "img19",
        url: `https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&crop=faces&fm=jpg&q=80&t=${Date.now()}`,
        vendorId: "7",
        order: 2,
      },
    ],
    reviews: [],
    hasInstantQuote: false,
    hasAvailability: false,
    availability: generateAvailableDates(),
  },
];

// Mock current user
export const mockUser = {
  id: "current-user",
  name: "Jane Doe",
  email: "jane@example.com",
  weddingDate: new Date(2026, 11, 18), // Dec 18, 2026
  favoriteVendors: [],
};
