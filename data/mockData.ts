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
    userImage: "https://picsum.photos/100/100?random=1",
    rating: 5,
    text: "Artful Lens exceeded all our expectations. We had two photographers on the day and they captured every single moment perfectly. The photos are absolutely stunning and we couldn't be happier!",
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "2",
    vendorId: "1",
    userId: "user2",
    userName: "Sarah",
    userImage: "https://picsum.photos/100/100?random=2",
    rating: 5,
    text: "Professional, creative, and so easy to work with. They made us feel comfortable throughout the entire day.",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    vendorId: "1",
    userId: "user3",
    userName: "Michael",
    userImage: "https://picsum.photos/100/100?random=3",
    rating: 4,
    text: "Beautiful photos! The team was great and very professional.",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "4",
    vendorId: "1",
    userId: "user4",
    userName: "Emma",
    userImage: "https://picsum.photos/100/100?random=4",
    rating: 5,
    text: "Amazing experience from start to finish. Highly recommend!",
    createdAt: new Date("2023-12-05"),
  },
  {
    id: "5",
    vendorId: "1",
    userId: "user5",
    userName: "David",
    userImage: "https://picsum.photos/100/100?random=5",
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
        imageUrl: "https://picsum.photos/200/200?random=10",
        vendorId: "1",
      },
      {
        id: "style2",
        name: "Light and Airy",
        description:
          "Soft tones and bright highlights for a fresh, romantic feel",
        imageUrl: "https://picsum.photos/200/200?random=11",
        vendorId: "1",
      },
      {
        id: "style3",
        name: "Film-look",
        description:
          "Rich tones and subtle grain for a nostalgic, cinematic feel",
        imageUrl: "https://picsum.photos/200/200?random=12",
        vendorId: "1",
      },
    ],
    images: [
      {
        id: "img1",
        url: "https://picsum.photos/400/400?random=20",
        vendorId: "1",
        order: 1,
      },
      {
        id: "img2",
        url: "https://picsum.photos/400/400?random=21",
        vendorId: "1",
        order: 2,
      },
      {
        id: "img3",
        url: "https://picsum.photos/400/400?random=22",
        vendorId: "1",
        order: 3,
      },
      {
        id: "img4",
        url: "https://picsum.photos/400/400?random=23",
        vendorId: "1",
        order: 4,
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
        imageUrl: "https://picsum.photos/200/200?random=30",
        vendorId: "2",
      },
      {
        id: "style5",
        name: "Classic Elegance",
        description: "Timeless, sophisticated wedding photography",
        imageUrl: "https://picsum.photos/200/200?random=31",
        vendorId: "2",
      },
    ],
    images: [
      {
        id: "img5",
        url: "https://picsum.photos/400/400?random=40",
        vendorId: "2",
        order: 1,
      },
      {
        id: "img6",
        url: "https://picsum.photos/400/400?random=41",
        vendorId: "2",
        order: 2,
      },
      {
        id: "img7",
        url: "https://picsum.photos/400/400?random=42",
        vendorId: "2",
        order: 3,
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
        imageUrl: "https://picsum.photos/200/200?random=50",
        vendorId: "3",
      },
    ],
    images: [
      {
        id: "img8",
        url: "https://picsum.photos/400/400?random=60",
        vendorId: "3",
        order: 1,
      },
      {
        id: "img9",
        url: "https://picsum.photos/400/400?random=61",
        vendorId: "3",
        order: 2,
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
        imageUrl: "https://picsum.photos/200/200?random=70",
        vendorId: "4",
      },
      {
        id: "style8",
        name: "Modern & Minimal",
        description: "Clean, contemporary wedding films",
        imageUrl: "https://picsum.photos/200/200?random=71",
        vendorId: "4",
      },
    ],
    images: [
      {
        id: "img10",
        url: "https://picsum.photos/400/400?random=80",
        vendorId: "4",
        order: 1,
      },
      {
        id: "img11",
        url: "https://picsum.photos/400/400?random=81",
        vendorId: "4",
        order: 2,
      },
      {
        id: "img12",
        url: "https://picsum.photos/400/400?random=82",
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
        imageUrl: "https://picsum.photos/200/200?random=90",
        vendorId: "5",
      },
    ],
    images: [
      {
        id: "img13",
        url: "https://picsum.photos/400/400?random=100",
        vendorId: "5",
        order: 1,
      },
      {
        id: "img14",
        url: "https://picsum.photos/400/400?random=101",
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
        imageUrl: "https://picsum.photos/200/200?random=110",
        vendorId: "6",
      },
      {
        id: "style11",
        name: "Instagram Reels",
        description: "Perfect for your Instagram feed",
        imageUrl: "https://picsum.photos/200/200?random=111",
        vendorId: "6",
      },
    ],
    images: [
      {
        id: "img15",
        url: "https://picsum.photos/400/400?random=120",
        vendorId: "6",
        order: 1,
      },
      {
        id: "img16",
        url: "https://picsum.photos/400/400?random=121",
        vendorId: "6",
        order: 2,
      },
      {
        id: "img17",
        url: "https://picsum.photos/400/400?random=122",
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
        imageUrl: "https://picsum.photos/200/200?random=130",
        vendorId: "7",
      },
    ],
    images: [
      {
        id: "img18",
        url: "https://picsum.photos/400/400?random=140",
        vendorId: "7",
        order: 1,
      },
      {
        id: "img19",
        url: "https://picsum.photos/400/400?random=141",
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
