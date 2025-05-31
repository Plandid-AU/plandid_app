import { Vendor, VendorCategory } from "@/types";
import * as SQLite from "expo-sqlite";

// Open database
const db = SQLite.openDatabaseSync("plandid.db");

// Database migration functions
const getCurrentSchemaVersion = (): number => {
  try {
    // Create schema_version table if it doesn't exist
    db.execSync(`
      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY
      )
    `);

    const result = db.getFirstSync(
      `SELECT version FROM schema_version ORDER BY version DESC LIMIT 1`
    ) as any;
    return result ? result.version : 0;
  } catch (error) {
    console.error("Error getting schema version:", error);
    return 0;
  }
};

const setSchemaVersion = (version: number) => {
  try {
    db.runSync(`INSERT OR REPLACE INTO schema_version (version) VALUES (?)`, [
      version,
    ]);
  } catch (error) {
    console.error("Error setting schema version:", error);
  }
};

const runMigrations = () => {
  const currentVersion = getCurrentSchemaVersion();
  console.log(`Current database schema version: ${currentVersion}`);

  try {
    // Migration 1: Add isSuperliked column to favorites table
    if (currentVersion < 1) {
      console.log("Running migration 1: Adding isSuperliked column...");

      // Check if favorites table exists and has isSuperliked column
      const tableInfo = db.getAllSync(`PRAGMA table_info(favorites)`);
      const hasIsSuperlikedColumn = tableInfo.some(
        (column: any) => column.name === "isSuperliked"
      );

      if (!hasIsSuperlikedColumn) {
        db.execSync(
          `ALTER TABLE favorites ADD COLUMN isSuperliked INTEGER DEFAULT 0`
        );
        console.log("Migration 1 completed: isSuperliked column added");
      } else {
        console.log("Migration 1 skipped: isSuperliked column already exists");
      }

      setSchemaVersion(1);
    }

    // Migration 2: Add partner fields to users table
    if (currentVersion < 2) {
      console.log("Running migration 2: Adding partner fields...");

      // Check if users table exists and has partner columns
      const tableInfo = db.getAllSync(`PRAGMA table_info(users)`);
      const hasPartnerNameColumn = tableInfo.some(
        (column: any) => column.name === "partnerName"
      );
      const hasPartnerEmailColumn = tableInfo.some(
        (column: any) => column.name === "partnerEmail"
      );
      const hasIsLinkedColumn = tableInfo.some(
        (column: any) => column.name === "isLinked"
      );

      if (!hasPartnerNameColumn) {
        db.execSync(`ALTER TABLE users ADD COLUMN partnerName TEXT`);
        console.log("Migration 2: partnerName column added");
      }

      if (!hasPartnerEmailColumn) {
        db.execSync(`ALTER TABLE users ADD COLUMN partnerEmail TEXT`);
        console.log("Migration 2: partnerEmail column added");
      }

      if (!hasIsLinkedColumn) {
        db.execSync(`ALTER TABLE users ADD COLUMN isLinked INTEGER DEFAULT 0`);
        console.log("Migration 2: isLinked column added");
      }

      console.log("Migration 2 completed: partner fields added");
      setSchemaVersion(2);
    }

    // Migration 3: Add privacy settings to user_preferences table
    if (currentVersion < 3) {
      console.log("Running migration 3: Adding privacy settings...");

      // Check if user_preferences table exists and has privacy columns
      const tableInfo = db.getAllSync(`PRAGMA table_info(user_preferences)`);
      const hasShareDataColumn = tableInfo.some(
        (column: any) => column.name === "shareDataForAnalytics"
      );

      if (!hasShareDataColumn) {
        db.execSync(
          `ALTER TABLE user_preferences ADD COLUMN shareDataForAnalytics INTEGER DEFAULT 0`
        );
        console.log("Migration 3: shareDataForAnalytics column added");
      }

      console.log("Migration 3 completed: privacy settings added");
      setSchemaVersion(3);
    }

    // Migration 4: Add notification settings to user_preferences table
    if (currentVersion < 4) {
      console.log("Running migration 4: Adding notification settings...");

      // Check if user_preferences table exists and has notification columns
      const tableInfo = db.getAllSync(`PRAGMA table_info(user_preferences)`);
      const hasMessagesColumn = tableInfo.some(
        (column: any) => column.name === "notificationsMessages"
      );
      const hasRecommendationsColumn = tableInfo.some(
        (column: any) => column.name === "notificationsRecommendations"
      );
      const hasRemindersColumn = tableInfo.some(
        (column: any) => column.name === "notificationsReminders"
      );
      const hasEmailColumn = tableInfo.some(
        (column: any) => column.name === "notificationsEmail"
      );

      if (!hasMessagesColumn) {
        db.execSync(
          `ALTER TABLE user_preferences ADD COLUMN notificationsMessages INTEGER DEFAULT 0`
        );
        console.log("Migration 4: notificationsMessages column added");
      }

      if (!hasRecommendationsColumn) {
        db.execSync(
          `ALTER TABLE user_preferences ADD COLUMN notificationsRecommendations INTEGER DEFAULT 0`
        );
        console.log("Migration 4: notificationsRecommendations column added");
      }

      if (!hasRemindersColumn) {
        db.execSync(
          `ALTER TABLE user_preferences ADD COLUMN notificationsReminders INTEGER DEFAULT 0`
        );
        console.log("Migration 4: notificationsReminders column added");
      }

      if (!hasEmailColumn) {
        db.execSync(
          `ALTER TABLE user_preferences ADD COLUMN notificationsEmail INTEGER DEFAULT 0`
        );
        console.log("Migration 4: notificationsEmail column added");
      }

      console.log("Migration 4 completed: notification settings added");
      setSchemaVersion(4);
    }

    // Migration 5: Add quotes table
    if (currentVersion < 5) {
      console.log("Running migration 5: Adding quotes table...");

      db.execSync(
        `CREATE TABLE IF NOT EXISTS quotes (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          vendorId TEXT NOT NULL,
          vendorName TEXT NOT NULL,
          vendorAvatar TEXT,
          selectedPackage TEXT NOT NULL,
          packageDetails TEXT NOT NULL,
          selectedAddons TEXT,
          packageCost REAL NOT NULL,
          addonsCost REAL DEFAULT 0,
          gst REAL NOT NULL,
          totalCost REAL NOT NULL,
          eventDate TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users (id),
          FOREIGN KEY (vendorId) REFERENCES vendors (id)
        );`
      );

      console.log("Migration 5 completed: quotes table added");
      setSchemaVersion(5);
    }

    // Future migrations can be added here
    // if (currentVersion < 6) {
    //   // Migration 6 code here
    //   setSchemaVersion(6);
    // }
  } catch (error) {
    console.error("Error running migrations:", error);
    // If the table doesn't exist, it will be created in initDatabase
  }
};

// Initialize database tables
export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    try {
      // Users table
      db.execSync(
        `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phoneNumber TEXT,
          weddingDate TEXT,
          weddingLocation TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );

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
          isSuperliked INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(userId, vendorId),
          FOREIGN KEY (vendorId) REFERENCES vendors(id)
        );`
      );

      // User preferences table for tooltip tracking
      db.execSync(
        `CREATE TABLE IF NOT EXISTS user_preferences (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          hasSeenSuperlikeTooltip INTEGER DEFAULT 0,
          hasSeenUndoSuperlikeTooltip INTEGER DEFAULT 0,
          hasCompletedFirstSuperlike INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(userId)
        );`
      );

      // Run migrations after creating tables
      runMigrations();

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
        db.runSync(
          `INSERT INTO favorites (userId, vendorId, isSuperliked) VALUES (?, ?, ?)`,
          [userId, vendorId, 0]
        );
        resolve(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      reject(error);
    }
  });
};

// Toggle superlike
export const toggleSuperlike = async (
  userId: string,
  vendorId: string
): Promise<{ isSuperliked: boolean; isFavorited: boolean }> => {
  return new Promise((resolve, reject) => {
    try {
      // Check if already favorited
      const existing = db.getFirstSync(
        `SELECT * FROM favorites WHERE userId = ? AND vendorId = ?`,
        [userId, vendorId]
      ) as any;

      if (existing) {
        if (existing.isSuperliked) {
          // Remove superlike, keep as regular favorite
          db.runSync(
            `UPDATE favorites SET isSuperliked = 0 WHERE userId = ? AND vendorId = ?`,
            [userId, vendorId]
          );
          resolve({ isSuperliked: false, isFavorited: true });
        } else {
          // Add superlike
          db.runSync(
            `UPDATE favorites SET isSuperliked = 1 WHERE userId = ? AND vendorId = ?`,
            [userId, vendorId]
          );

          // Mark that user has completed their first superlike
          db.runSync(
            `INSERT OR REPLACE INTO user_preferences (userId, hasCompletedFirstSuperlike, updatedAt) 
             VALUES (?, 1, CURRENT_TIMESTAMP)`,
            [userId]
          );

          resolve({ isSuperliked: true, isFavorited: true });
        }
      } else {
        // Add as superliked favorite
        db.runSync(
          `INSERT INTO favorites (userId, vendorId, isSuperliked) VALUES (?, ?, ?)`,
          [userId, vendorId, 1]
        );

        // Mark that user has completed their first superlike
        db.runSync(
          `INSERT OR REPLACE INTO user_preferences (userId, hasCompletedFirstSuperlike, updatedAt) 
           VALUES (?, 1, CURRENT_TIMESTAMP)`,
          [userId]
        );

        resolve({ isSuperliked: true, isFavorited: true });
      }
    } catch (error) {
      console.error("Error toggling superlike:", error);
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

// Get user superlikes
export const getUserSuperlikes = async (userId: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.getAllSync(
        `SELECT vendorId FROM favorites WHERE userId = ? AND isSuperliked = 1`,
        [userId]
      );
      const superlikes = result.map((row: any) => row.vendorId);
      resolve(superlikes);
    } catch (error) {
      console.error("Error getting superlikes:", error);
      reject(error);
    }
  });
};

// Get vendor favorite status
export const getVendorFavoriteStatus = async (
  userId: string,
  vendorId: string
): Promise<{ isFavorited: boolean; isSuperliked: boolean }> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.getFirstSync(
        `SELECT isSuperliked FROM favorites WHERE userId = ? AND vendorId = ?`,
        [userId, vendorId]
      ) as any;

      if (result) {
        resolve({ isFavorited: true, isSuperliked: result.isSuperliked === 1 });
      } else {
        resolve({ isFavorited: false, isSuperliked: false });
      }
    } catch (error) {
      console.error("Error getting vendor favorite status:", error);
      reject(error);
    }
  });
};

// User preferences functions
export const getUserPreferences = async (
  userId: string
): Promise<{
  hasSeenSuperlikeTooltip: boolean;
  hasSeenUndoSuperlikeTooltip: boolean;
  hasCompletedFirstSuperlike: boolean;
  shareDataForAnalytics: boolean;
  notificationsMessages: boolean;
  notificationsRecommendations: boolean;
  notificationsReminders: boolean;
  notificationsEmail: boolean;
}> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.getFirstSync(
        `SELECT * FROM user_preferences WHERE userId = ?`,
        [userId]
      ) as any;

      if (result) {
        resolve({
          hasSeenSuperlikeTooltip: result.hasSeenSuperlikeTooltip === 1,
          hasSeenUndoSuperlikeTooltip: result.hasSeenUndoSuperlikeTooltip === 1,
          hasCompletedFirstSuperlike: result.hasCompletedFirstSuperlike === 1,
          shareDataForAnalytics: result.shareDataForAnalytics === 1,
          notificationsMessages: result.notificationsMessages === 1,
          notificationsRecommendations:
            result.notificationsRecommendations === 1,
          notificationsReminders: result.notificationsReminders === 1,
          notificationsEmail: result.notificationsEmail === 1,
        });
      } else {
        // Initialize preferences for new user
        db.runSync(`INSERT INTO user_preferences (userId) VALUES (?)`, [
          userId,
        ]);
        resolve({
          hasSeenSuperlikeTooltip: false,
          hasSeenUndoSuperlikeTooltip: false,
          hasCompletedFirstSuperlike: false,
          shareDataForAnalytics: false,
          notificationsMessages: false,
          notificationsRecommendations: false,
          notificationsReminders: false,
          notificationsEmail: false,
        });
      }
    } catch (error) {
      console.error("Error getting user preferences:", error);
      reject(error);
    }
  });
};

export const updateUserPreference = async (
  userId: string,
  preference:
    | "hasSeenSuperlikeTooltip"
    | "hasSeenUndoSuperlikeTooltip"
    | "hasCompletedFirstSuperlike"
    | "shareDataForAnalytics"
    | "notificationsMessages"
    | "notificationsRecommendations"
    | "notificationsReminders"
    | "notificationsEmail",
  value: boolean
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      db.runSync(
        `INSERT OR REPLACE INTO user_preferences (userId, ${preference}, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [userId, value ? 1 : 0]
      );
      resolve();
    } catch (error) {
      console.error("Error updating user preference:", error);
      reject(error);
    }
  });
};

// User management functions
export const createOrUpdateUser = async (
  id: string,
  name: string,
  email: string,
  weddingDate?: Date,
  weddingLocation?: string,
  phoneNumber?: string,
  partnerName?: string,
  partnerEmail?: string,
  isLinked?: boolean
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Creating/updating user:", {
        id,
        name,
        email,
        weddingDate,
        weddingLocation,
        phoneNumber,
        partnerName,
        partnerEmail,
        isLinked,
      });
      db.runSync(
        `INSERT OR REPLACE INTO users (id, name, email, phoneNumber, weddingDate, weddingLocation, partnerName, partnerEmail, isLinked, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          id,
          name,
          email,
          phoneNumber || null,
          weddingDate ? weddingDate.toISOString() : null,
          weddingLocation || null,
          partnerName || null,
          partnerEmail || null,
          isLinked ? 1 : 0,
        ]
      );
      console.log("User created/updated successfully");
      resolve();
    } catch (error) {
      console.error("Error creating/updating user:", error);
      reject(error);
    }
  });
};

export const getUser = async (
  userId: string
): Promise<{
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  weddingDate?: Date;
  weddingLocation?: string;
  partnerName?: string;
  partnerEmail?: string;
  isLinked?: boolean;
} | null> => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Getting user:", userId);
      const result = db.getFirstSync(`SELECT * FROM users WHERE id = ?`, [
        userId,
      ]) as any;

      if (result) {
        console.log("User found:", result);
        resolve({
          id: result.id,
          name: result.name,
          email: result.email,
          phoneNumber: result.phoneNumber || undefined,
          weddingDate: result.weddingDate
            ? new Date(result.weddingDate)
            : undefined,
          weddingLocation: result.weddingLocation || undefined,
          partnerName: result.partnerName || undefined,
          partnerEmail: result.partnerEmail || undefined,
          isLinked: result.isLinked === 1,
        });
      } else {
        console.log("User not found");
        resolve(null);
      }
    } catch (error) {
      console.error("Error getting user:", error);
      reject(error);
    }
  });
};

export const updateUserWeddingDate = async (
  userId: string,
  weddingDate: Date
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      console.log(
        "Updating wedding date for user:",
        userId,
        "to:",
        weddingDate
      );
      db.runSync(
        `UPDATE users SET weddingDate = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [weddingDate.toISOString(), userId]
      );
      console.log("Wedding date updated successfully");
      resolve();
    } catch (error) {
      console.error("Error updating wedding date:", error);
      reject(error);
    }
  });
};

export const updateUserWeddingLocation = async (
  userId: string,
  weddingLocation: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      console.log(
        "Updating wedding location for user:",
        userId,
        "to:",
        weddingLocation
      );
      db.runSync(
        `UPDATE users SET weddingLocation = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [weddingLocation, userId]
      );
      console.log("Wedding location updated successfully");
      resolve();
    } catch (error) {
      console.error("Error updating wedding location:", error);
      reject(error);
    }
  });
};

export const updateUserPersonalDetails = async (
  userId: string,
  name: string,
  email: string,
  phoneNumber?: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      console.log(
        "Updating personal details for user:",
        userId,
        "name:",
        name,
        "email:",
        email,
        "phoneNumber:",
        phoneNumber
      );
      db.runSync(
        `UPDATE users SET name = ?, email = ?, phoneNumber = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [name, email, phoneNumber || null, userId]
      );
      console.log("Personal details updated successfully");
      resolve();
    } catch (error) {
      console.error("Error updating personal details:", error);
      reject(error);
    }
  });
};

export const updateUserPartnerDetails = async (
  userId: string,
  partnerName?: string,
  partnerEmail?: string,
  isLinked?: boolean
): Promise<void> => {
  try {
    db.runSync(
      `UPDATE users 
       SET partnerName = ?, partnerEmail = ?, isLinked = ?, updatedAt = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [partnerName || null, partnerEmail || null, isLinked ? 1 : 0, userId]
    );
  } catch (error) {
    console.error("Error updating user partner details:", error);
    throw error;
  }
};

// Quote management functions
export interface Quote {
  id: string;
  userId: string;
  vendorId: string;
  vendorName: string;
  vendorAvatar?: string;
  selectedPackage: string;
  packageDetails: any;
  selectedAddons?: any;
  packageCost: number;
  addonsCost: number;
  gst: number;
  totalCost: number;
  eventDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const saveQuote = async (
  userId: string,
  vendorId: string,
  vendorName: string,
  vendorAvatar: string | undefined,
  selectedPackage: string,
  packageDetails: any,
  selectedAddons: any,
  packageCost: number,
  addonsCost: number,
  gst: number,
  totalCost: number,
  eventDate?: string
): Promise<string> => {
  try {
    const quoteId = `quote_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    db.runSync(
      `INSERT INTO quotes (
        id, userId, vendorId, vendorName, vendorAvatar, selectedPackage, 
        packageDetails, selectedAddons, packageCost, addonsCost, gst, 
        totalCost, eventDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quoteId,
        userId,
        vendorId,
        vendorName,
        vendorAvatar || null,
        selectedPackage,
        JSON.stringify(packageDetails),
        JSON.stringify(selectedAddons),
        packageCost,
        addonsCost,
        gst,
        totalCost,
        eventDate || null,
      ]
    );

    return quoteId;
  } catch (error) {
    console.error("Error saving quote:", error);
    throw error;
  }
};

export const getUserQuotes = async (userId: string): Promise<Quote[]> => {
  try {
    const quotes = db.getAllSync(
      `SELECT * FROM quotes WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    ) as any[];

    return quotes.map((quote) => ({
      ...quote,
      packageDetails: JSON.parse(quote.packageDetails),
      selectedAddons: quote.selectedAddons
        ? JSON.parse(quote.selectedAddons)
        : null,
    }));
  } catch (error) {
    console.error("Error getting user quotes:", error);
    throw error;
  }
};

export const getQuoteById = async (quoteId: string): Promise<Quote | null> => {
  try {
    const quote = db.getFirstSync(`SELECT * FROM quotes WHERE id = ?`, [
      quoteId,
    ]) as any;

    if (!quote) return null;

    return {
      ...quote,
      packageDetails: JSON.parse(quote.packageDetails),
      selectedAddons: quote.selectedAddons
        ? JSON.parse(quote.selectedAddons)
        : null,
    };
  } catch (error) {
    console.error("Error getting quote by ID:", error);
    throw error;
  }
};

export const deleteQuote = async (
  quoteId: string,
  userId: string
): Promise<void> => {
  try {
    db.runSync(`DELETE FROM quotes WHERE id = ? AND userId = ?`, [
      quoteId,
      userId,
    ]);
  } catch (error) {
    console.error("Error deleting quote:", error);
    throw error;
  }
};
