# PlanDid App

A React Native app built with Expo for planning and vendor management.

## Features

### Chat System

- **Multi-line Text Input**: Instagram-like text input with automatic height adjustment and scrolling
  - Supports up to 1000 characters
  - Automatic height expansion up to 120px
  - Smooth scrolling when content exceeds maximum height
- **File Upload Support**:

  - 📷 **Camera**: Take photos directly from the app
  - 🖼️ **Photo Library**: Select images from device gallery
  - 📎 **Documents**: Upload any file type
  - Preview attachments before sending
  - Remove attachments with one tap

- **Enhanced UI**:
  - Larger, more visible plus icon (36px)
  - Smooth animations and transitions
  - Attachment previews with file size display
  - Modern modal interface for upload options

### Technical Implementation

- TypeScript support with proper type definitions
- Expo Image Picker and Document Picker integration
- Proper permission handling for camera and media library
- Responsive design with consistent spacing
- Theme-aware styling

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Permissions

The app requires the following permissions:

- Camera access (for taking photos)
- Photo library access (for selecting images)
- File system access (for document uploads)

## Dependencies

- expo-image-picker
- expo-document-picker
- @expo/vector-icons
- react-native-reanimated
