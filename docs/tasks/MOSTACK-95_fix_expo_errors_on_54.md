# MOSTACK-95: Fix Expo Errors on SDK 54

## Problem

Worklets version mismatch error when running Expo app in simulator:

- JavaScript part: 0.6.1
- Native part: 0.5.1 (bundled in Expo Go)

## Root Cause

Expo Go has a bundled version of Worklets (0.5.1) that doesn't match the installed version (0.6.1) from react-native-reanimated ~4.1.3.

## Solution Implemented

### Tasks Completed

- ✅ Cleared Expo and Metro caches (.expo, .cache, node_modules/.cache)
- ✅ Ran `expo prebuild --clean` to generate native iOS/Android directories
- ✅ Updated .gitignore patterns for native directories
- ✅ Added prebuild scripts to package.json files
- ✅ Committed all changes with conventional commits

### Changes Made

1. **Cache Cleanup**: Removed .expo, .cache directories
2. **Prebuild**: Generated native iOS/Android code with correct Worklets version
3. **Scripts Added**:
   - `expo:prebuild` and `expo:prebuild:clean` in apps/expo/package.json
   - Root-level convenience scripts: `expo:dev`, `expo:ios`, `expo:android`
4. **Git Patterns**: Updated .gitignore to properly exclude ios/ and android/ from root

## Next Steps to Test

To run the app with the development build (not Expo Go):

```bash
# For iOS simulator
pnpm run expo ios

# For Android emulator
pnpm run expo android
```

This will build and run the development client with your exact dependencies, avoiding the Worklets version mismatch.

## Alternative: If you must use Expo Go

If you need to continue using Expo Go, you would need to downgrade react-native-reanimated to match the version bundled in Expo SDK 54 (not recommended).

## References

- [Worklets Troubleshooting Docs](https://docs.swmansion.com/react-native-worklets/docs/guides/troubleshooting/#mismatch-between-javascript-part-and-native-part-of-worklets)
- Expo SDK 54 Reanimated version compatibility
