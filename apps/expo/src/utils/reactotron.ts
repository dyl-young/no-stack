import Constants from "expo-constants";
import Reactotron from "reactotron-react-native";

const tron = Reactotron.configure({
  name: Constants.expoConfig?.name,
})
  .useReactNative()
  .connect();

export default tron;
