import type Reactotron from "@/util/reactotron";

declare global {
  interface Console {
    tron?: typeof Reactotron;
  }
}
