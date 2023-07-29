import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "./../../../config/theme.config.json"

export default function Notification() { 
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View>
        <Text style={{color: 'white'}}>Notification</Text>
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