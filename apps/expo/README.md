# Expo App: Build & Deployment Guide

This document describes the **EAS (Expo Application Services)** configuration and the workflow for managing environment variables across different stages of the mobile application.

---

## Prerequisites

Before starting, ensure you have the following installed and configured:

- **Node.js**: `22.17.1` (Default version for EAS builds)
- **EAS CLI**: Version `^4.1.2` or higher
- **Setup Commands**:

  ```bash
  # Install EAS CLI globally
  npm install -g eas-cli

  # Log in to your Expo account
  eas login
  ```

---

## Environment Variables Setup

We maintain a strict separation between local development and cloud-based testing/production environments.

### 1. Local Development

For development on your local machine using the **Expo Dev Client**.

- **File**: Create a `.env.local` in the project root.
- **Behavior**: Variables are loaded locally by the Expo CLI and inlined into your JavaScript code during the bundling process.

### 2. Testing & Production Environments (QA, UAT, PROD)

For cloud builds, we manage variables via the [Expo Dashboard](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/environment-variables). This ensures consistency across the team and secure handling of sensitive keys.

![Environment Variables](./assets/documents/environment-variables.png)

---

## Syncing Environments in `eas.json`

To automatically link your cloud-stored variables to your builds, we use the `environment` property in `eas.json`. This directs the EAS build worker to pull the correct secrets during the build process.

```bash
{
  "build": {
    "qa": {
      "environment": "development",
      ...
    },
    "uat": {
      "environment": "preview",
      ...
    },
    "production": {
      "environment": "production",
      ...
    }
  }
}
```

## [Creating and using environment variables](https://docs.expo.dev/eas/environment-variables/#creating-and-using-environment-variables)

The sections below use the following common environment variables as examples:

| Variable               | Type        | Description                                                                         |
| ---------------------- | ----------- | ----------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL`  | Plain text  | `EXPO_PUBLIC_*` variable that holds the URL of the API server                       |
| `APP_VARIANT`          | Plain text  | Variable to select an app variant                                                   |
| `GOOGLE_SERVICES_JSON` | Secret file | Supplies your git-ignored `google-services.json` file to the build job              |
| `SENTRY_AUTH_TOKEN`    | Sensitive   | Authentication token for Sentry used to upload source maps after builds and updates |

> ⚠️ **Warning**: Do not store sensitive information in EXPO*PUBLIC* variables, such as private keys. These variables will be visible in plain-text in your compiled app.

### Use environment variables

Expo provides built-in support for environment variables.

```bash
 const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

---

## Building the App

Use the `eas build` command to create builds for different environments.

Local Build Instructions While the project uses [GitHub Actions](/.github/workflows/eas-build.yml) for automated CI/CD, you can perform manual local builds using the following commands

### Build Commands

```bash
# Example: Build for QA (internal distribution)
eas build --profile qa --platform all

# Example: Build specific platform only
eas build --profile qa --platform ios
eas build --profile qa --platform android

# Example: Build specific platform only
eas build --profile <profile-name> --platform <platform: ios, android, or all>

```

### APK Building (Android)

By default, EAS builds an **AAB (Android App Bundle)** for Android. However, for internal testing on devices without Google Play Services, you may need an **APK** file instead.

To enable APK building, uncomment the `android.buildType` in `eas.json`:

```json
{
  "build": {
    "qa": {
      "extends": "base",
      "distribution": "internal",
      "autoIncrement": true,
      "environment": "development",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

> ⚠️ **Warning**: APK builds are intended for internal testing only. You must switch to the AAB (Android App Bundle) format when submitting to the Google Play Store, as it is the mandatory requirement.

Note: Even after submitting an AAB, you can still download the generated APK files directly from the Google Play Console.

---

## Submitting the App

EAS Submit allows you to upload your builds directly to the App Store (iOS) and Google Play Console (Android).

### Submit Commands

```bash
# Submit the latest build for a specific profile
eas submit --profile qa --platform all

# Submit specific platform only
eas submit --profile qa --platform ios
eas submit --profile qa --platform android

# Submit a specific build (by build ID)
eas submit --profile qa --platform android --id <build-id>
```

### Auto-Submit (Build + Submit in One Command)

Use the `--auto-submit` flag to automatically submit your build after it completes successfully.

```bash
# Example: Build and auto-submit for QA
eas build --profile <profile-name> --platform <platform> --auto-submit
```

> 💡 **Tip**: `--auto-submit` saves time by eliminating the need to manually trigger submission after the build finishes.

---

## Android Submit Configuration

Google Play Console uses **tracks** to manage different release stages. Configure the `track` property in the `submit` section of `eas.json`.

### Available Tracks

| Track        | Description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| `internal`   | For internal testers only (up to 100 testers). Fastest review process. |
| `alpha`      | Closed testing track for a limited group of testers.                   |
| `beta`       | Open testing track for a larger group of public testers.               |
| `production` | Full public release on Google Play Store.                              |

### Submit Configuration in `eas.json`

```bash
{
  "submit": {
    "qa": {
      "android": {
        "releaseStatus": "draft",
        "track": "internal"
      }
    },
    "uat": {
      "android": {
        "releaseStatus": "draft",
        "track": "internal"
      }
    },
    "production": {
      "android": {
        "releaseStatus": "draft",
        "track": "internal"
      }
    }
  }
}
```

📝 Note: You'll need to set up your [Google Service Account Key](https://github.com/expo/fyi/blob/main/creating-google-service-account.md) in the Expo dashboard or provide credentials during submission.

#### Release draft Status

Upload as draft. Requires manual promotion in Google Play Console.

---

## iOS Submit Configuration

For iOS submissions, configure App Store Connect credentials in `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-apple-team-id"
      }
    }
  }
}
```

> 📝 **Note**: You'll need to set up your App Store Connect API Key in the Expo dashboard or provide credentials during submission.

---
