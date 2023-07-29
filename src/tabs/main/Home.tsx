import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import theme from "./../../../config/theme.config.json"
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() { 
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View>
        <Text style={{color: 'white'}}>Home</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: theme.background,
    flex: 1,
  },
});