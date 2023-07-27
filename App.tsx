import { store } from "./src/store/store";
import { Provider } from "react-redux";
import VoiceHub from "./src/VoiceHub"; 

export default function App() { 
  
  return (
    <Provider store={store}>
      <VoiceHub></VoiceHub>
    </Provider>
  );
}
