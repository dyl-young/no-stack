declare module "react-native/Libraries/Utilities/PolyfillFunctions" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function polyfillGlobal(name: string, factory: () => any): void;
}
