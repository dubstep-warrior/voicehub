import { store } from "./src/store/store";
import { Provider } from "react-redux";
import VoiceHub from "./src/VoiceHub";
import 'react-native-gesture-handler'
import 'expo-dev-client';

 
export default function App() {
  return (
    <Provider store={store}> 
      <VoiceHub></VoiceHub> 
    </Provider>
  );
}
