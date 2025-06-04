import { getCachedImageUri } from "@/utils/imageCache";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageErrorEventData,
  ImageLoadEventData,
  ImageProps,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";

interface CachedImageProps extends Omit<ImageProps, "source"> {
  source: { uri: string } | number;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
  fallbackText?: string;
  showLoader?: boolean;
  loaderColor?: string;
  loaderSize?: "small" | "large";
}

export const CachedImage: React.FC<CachedImageProps> = ({
  source,
  fallbackIcon = "image-outline",
  fallbackText = "Image failed to load",
  showLoader = true,
  loaderColor = "#7B1513",
  loaderSize = "large",
  style,
  onLoadStart,
  onLoad,
  onError,
  ...props
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (typeof source === "object" && source.uri) {
      getCachedImageUri(source.uri)
        .then((uri) => {
          setImageUri(uri);
          setIsLoading(false);
        })
        .catch((error) => {
          console.warn("Failed to get cached image URI:", error);
          setImageUri(source.uri);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [source]);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
    onLoadStart?.();
  };

  const handleLoad = (event: NativeSyntheticEvent<ImageLoadEventData>) => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.(event);
  };

  const handleError = (event: NativeSyntheticEvent<ImageErrorEventData>) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(event);
  };

  // Show error state
  if (hasError) {
    return (
      <View
        style={[
          style,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          },
        ]}
      >
        <Ionicons name={fallbackIcon} size={50} color="#999" />
        <Text
          style={{
            color: "#666",
            fontSize: 12,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          {fallbackText}
        </Text>
      </View>
    );
  }

  // Show loading state
  if (isLoading && showLoader) {
    return (
      <View
        style={[
          style,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          },
        ]}
      >
        <ActivityIndicator size={loaderSize} color={loaderColor} />
      </View>
    );
  }

  // Handle local images (require() statements)
  if (typeof source === "number") {
    return (
      <Image
        source={source}
        style={style}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    );
  }

  // Handle remote images with caching
  if (imageUri) {
    return (
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: imageUri, cache: "force-cache" }}
          style={style}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
        {isLoading && showLoader && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.1)",
            }}
          >
            <ActivityIndicator size={loaderSize} color={loaderColor} />
          </View>
        )}
      </View>
    );
  }

  return null;
};
