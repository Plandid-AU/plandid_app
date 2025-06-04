import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const CACHE_DIRECTORY = FileSystem.cacheDirectory + "images/";
const CACHE_INDEX_KEY = "image_cache_index";

// Ensure cache directory exists
async function ensureCacheDirectoryExists() {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIRECTORY, {
      intermediates: true,
    });
  }
}

// Generate a safe filename from URL
function generateCacheKey(url: string): string {
  // Remove query parameters and create a hash-like key
  const cleanUrl = url.split("?")[0];
  return cleanUrl.replace(/[^a-zA-Z0-9]/g, "_") + ".jpg";
}

// Get cached image path if it exists
export async function getCachedImagePath(url: string): Promise<string | null> {
  try {
    await ensureCacheDirectoryExists();
    const cacheKey = generateCacheKey(url);
    const cachePath = CACHE_DIRECTORY + cacheKey;

    const fileInfo = await FileSystem.getInfoAsync(cachePath);
    if (fileInfo.exists) {
      return cachePath;
    }
    return null;
  } catch (error) {
    console.warn("Error checking cached image:", error);
    return null;
  }
}

// Download and cache an image
export async function cacheImage(url: string): Promise<string | null> {
  try {
    await ensureCacheDirectoryExists();
    const cacheKey = generateCacheKey(url);
    const cachePath = CACHE_DIRECTORY + cacheKey;

    // Check if already cached
    const existingPath = await getCachedImagePath(url);
    if (existingPath) {
      return existingPath;
    }

    // Download the image
    const downloadResult = await FileSystem.downloadAsync(url, cachePath);

    if (downloadResult.status === 200) {
      // Update cache index
      await updateCacheIndex(url, cacheKey);
      return cachePath;
    }

    return null;
  } catch (error) {
    console.warn("Error caching image:", error);
    return null;
  }
}

// Update cache index for tracking
async function updateCacheIndex(url: string, cacheKey: string) {
  try {
    const indexData = await AsyncStorage.getItem(CACHE_INDEX_KEY);
    const index = indexData ? JSON.parse(indexData) : {};

    index[url] = {
      cacheKey,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
  } catch (error) {
    console.warn("Error updating cache index:", error);
  }
}

// Get cached image URI (either local cache or original URL)
export async function getCachedImageUri(url: string): Promise<string> {
  const cachedPath = await getCachedImagePath(url);
  if (cachedPath) {
    return cachedPath;
  }

  // Start caching in background
  cacheImage(url).catch((error) => {
    console.warn("Background caching failed:", error);
  });

  // Return original URL while caching
  return url;
}

// Clear cache (optional utility)
export async function clearImageCache(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIRECTORY);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(CACHE_DIRECTORY);
    }
    await AsyncStorage.removeItem(CACHE_INDEX_KEY);
  } catch (error) {
    console.warn("Error clearing cache:", error);
  }
}

// Get cache size (optional utility)
export async function getCacheSize(): Promise<number> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIRECTORY);
    if (!dirInfo.exists) return 0;

    const files = await FileSystem.readDirectoryAsync(CACHE_DIRECTORY);
    let totalSize = 0;

    for (const file of files) {
      const fileInfo = await FileSystem.getInfoAsync(CACHE_DIRECTORY + file);
      if (fileInfo.exists && !fileInfo.isDirectory && "size" in fileInfo) {
        totalSize += fileInfo.size || 0;
      }
    }

    return totalSize;
  } catch (error) {
    console.warn("Error getting cache size:", error);
    return 0;
  }
}
