import { Platform } from "react-native";
import structuredClone from "@ungap/structured-clone";

if (Platform.OS !== "web") {
  const setupPolyfills = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { polyfillGlobal } = await import(
      "react-native/Libraries/Utilities/PolyfillFunctions"
    );

    const { TextEncoderStream, TextDecoderStream } =
      await import("@stardazed/streams-text-encoding");

    if (!("structuredClone" in global)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  void setupPolyfills();
}

export {};
