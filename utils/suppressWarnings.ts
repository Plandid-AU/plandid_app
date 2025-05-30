// Warning suppression utility for development-only React warnings
// This must be imported as early as possible in the app lifecycle

if (typeof __DEV__ !== "undefined" && __DEV__) {
  // Store the original console functions
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  // Override console.warn to filter out specific warnings
  console.warn = (...args) => {
    const message = args[0];

    // Check if the warning is one we want to suppress
    if (typeof message === "string") {
      // Suppress useInsertionEffect warnings during navigation transitions
      if (message.includes("useInsertionEffect must not schedule updates")) {
        return; // Silently ignore this warning
      }

      // Suppress other navigation-related warnings that can occur during rapid transitions
      if (message.includes("Cannot update a component")) {
        return;
      }
    }

    // Allow all other warnings through
    originalConsoleWarn.apply(console, args);
  };

  // Override console.error to filter out specific errors that are actually warnings
  console.error = (...args) => {
    const message = args[0];

    // Check if the error is one we want to suppress
    if (typeof message === "string") {
      // Suppress useInsertionEffect warnings during navigation transitions
      if (message.includes("useInsertionEffect must not schedule updates")) {
        return; // Silently ignore this error
      }

      // Suppress other navigation-related warnings that can occur during rapid transitions
      if (message.includes("Cannot update a component")) {
        return;
      }
    }

    // Allow all other errors through
    originalConsoleError.apply(console, args);
  };
}

// Export empty object to make this a proper module
export {};
