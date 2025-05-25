import { Vendor, VendorCategory } from "@/types";
import * as SQLite from "expo-sqlite";

// Open database
const db = SQLite.openDatabaseSync("plandid.db");

// Initialize database tables
export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    try {
      // Vendors table
      db.execSync(
        `CREATE TABLE IF NOT EXISTS vendors (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          location TEXT NOT NULL,
          tagline TEXT,
          description TEXT,
          rating REAL,
          reviewCount INTEGER,
          deliveryTime TEXT,
          hasInstantQuote INTEGER,
          hasAvailability INTEGER,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );

      // Services table
      db.execSync(
        `CREATE TABLE IF NOT EXISTS vendor_services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          vendorId TEXT NOT NULL,
          service TEXT NOT NULL,
          FOREIGN KEY (vendorId) REFERENCES vendors(id)
        );`
      );

      // Styles table
      db.execSync(
        `CREATE TABLE IF NOT EXISTS vendor_styles (
          id TEXT PRIMARY KEY,
          vendorId TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          imageUrl TEXT,
          FOREIGN KEY (vendorId) REFERENCES vendors(id)
        );`
      );

      // Images table
      db.execSync(
        `CREATE TABLE IF NOT EXISTS vendor_images (
          id TEXT PRIMARY KEY,
          vendorId TEXT NOT NULL,
          url TEXT NOT NULL,
          orderIndex INTEGER,
          FOREIGN KEY (vendorId) REFERENCES vendors(id)
        );`
      );

      // Reviews table
      db.execSync(
        `CREATE TABLE IF NOT EXISTS reviews (
          id TEXT PRIMARY KEY,
          vendorId TEXT NOT NULL,
          userId TEXT NOT NULL,
          userName TEXT NOT NULL,
          userImage TEXT,
          rating INTEGER NOT NULL,
          text TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (vendorId) REFERENCES vendors(id)
        );`
      );

      // Search history table
      db.execSync(
        `CREATE TABLE IF NOT EXISTS search_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          location TEXT,
          date TEXT,
          service TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );

      // Favorites table
      db.execSync(
        `CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          vendorId TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(userId, vendorId),
          FOREIGN KEY (vendorId) REFERENCES vendors(id)
        );`
      );

      resolve();
    } catch (error) {
      console.error("Error initializing database:", error);
      reject(error);
    }
  });
};

// Seed database with mock data
export const seedDatabase = async (vendors: Vendor[]) => {
  return new Promise<void>((resolve, reject) => {
    try {
      db.withTransactionSync(() => {
        vendors.forEach((vendor) => {
          // Insert vendor
          db.runSync(
            `INSERT OR REPLACE INTO vendors 
            (id, name, category, location, tagline, description, rating, reviewCount, deliveryTime, hasInstantQuote, hasAvailability)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              vendor.id,
              vendor.name,
              vendor.category,
              vendor.location,
              vendor.tagline || null,
              vendor.description || null,
              vendor.rating || null,
              vendor.reviewCount || null,
              vendor.deliveryTime || null,
              vendor.hasInstantQuote ? 1 : 0,
              vendor.hasAvailability ? 1 : 0,
            ]
          );

          // Insert services
          vendor.services.forEach((service) => {
            db.runSync(
              `INSERT OR REPLACE INTO vendor_services (vendorId, service) VALUES (?, ?)`,
              [vendor.id, service]
            );
          });

          // Insert styles
          vendor.styles.forEach((style) => {
            db.runSync(
              `INSERT OR REPLACE INTO vendor_styles (id, vendorId, name, description, imageUrl) VALUES (?, ?, ?, ?, ?)`,
              [
                style.id,
                vendor.id,
                style.name,
                style.description || null,
                style.imageUrl || null,
              ]
            );
          });

          // Insert images
          vendor.images.forEach((image) => {
            db.runSync(
              `INSERT OR REPLACE INTO vendor_images (id, vendorId, url, orderIndex) VALUES (?, ?, ?, ?)`,
              [image.id, vendor.id, image.url, image.order]
            );
          });

          // Insert reviews
          vendor.reviews.forEach((review) => {
            db.runSync(
              `INSERT OR REPLACE INTO reviews (id, vendorId, userId, userName, userImage, rating, text) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                review.id,
                vendor.id,
                review.userId,
                review.userName,
                review.userImage || null,
                review.rating,
                review.text,
              ]
            );
          });
        });
      });
      resolve();
    } catch (error) {
      console.error("Error seeding database:", error);
      reject(error);
    }
  });
};

// Search vendors
export const searchVendors = async (
  location?: string,
  service?: string
): Promise<Vendor[]> => {
  return new Promise((resolve, reject) => {
    try {
      let query = `SELECT * FROM vendors WHERE 1=1`;
      const params: any[] = [];

      if (location && location !== "Flexible") {
        query += ` AND location LIKE ?`;
        params.push(`%${location}%`);
      }

      if (service && service !== "All") {
        const categoryMap: { [key: string]: VendorCategory } = {
          Photographer: VendorCategory.PHOTO,
          Videographer: VendorCategory.VIDEO,
          "Content Creator": VendorCategory.CONTENT,
        };
        const category = categoryMap[service];
        if (category) {
          query += ` AND category = ?`;
          params.push(category);
        }
      }

      const result = db.getAllSync(query, params);
      const vendors: Vendor[] = result.map((row: any) => ({
        ...row,
        hasInstantQuote: row.hasInstantQuote === 1,
        hasAvailability: row.hasAvailability === 1,
        services: [],
        styles: [],
        images: [],
        reviews: [],
        availability: [],
      }));

      resolve(vendors);
    } catch (error) {
      console.error("Error searching vendors:", error);
      reject(error);
    }
  });
};

// Add search to history
export const addSearchToHistory = async (
  location: string,
  date: string,
  service: string
) => {
  return new Promise<void>((resolve, reject) => {
    try {
      db.runSync(
        `INSERT INTO search_history (location, date, service) VALUES (?, ?, ?)`,
        [location, date, service]
      );
      resolve();
    } catch (error) {
      console.error("Error adding search to history:", error);
      reject(error);
    }
  });
};

// Get search history
export const getSearchHistory = async (limit: number = 5): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.getAllSync(
        `SELECT * FROM search_history ORDER BY timestamp DESC LIMIT ?`,
        [limit]
      );
      resolve(result);
    } catch (error) {
      console.error("Error getting search history:", error);
      reject(error);
    }
  });
};

// Toggle favorite
export const toggleFavorite = async (
  userId: string,
  vendorId: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      // Check if already favorited
      const existing = db.getFirstSync(
        `SELECT * FROM favorites WHERE userId = ? AND vendorId = ?`,
        [userId, vendorId]
      );

      if (existing) {
        // Remove favorite
        db.runSync(`DELETE FROM favorites WHERE userId = ? AND vendorId = ?`, [
          userId,
          vendorId,
        ]);
        resolve(false);
      } else {
        // Add favorite
        db.runSync(`INSERT INTO favorites (userId, vendorId) VALUES (?, ?)`, [
          userId,
          vendorId,
        ]);
        resolve(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      reject(error);
    }
  });
};

// Get user favorites
export const getUserFavorites = async (userId: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.getAllSync(
        `SELECT vendorId FROM favorites WHERE userId = ?`,
        [userId]
      );
      const favorites = result.map((row: any) => row.vendorId);
      resolve(favorites);
    } catch (error) {
      console.error("Error getting favorites:", error);
      reject(error);
    }
  });
};
