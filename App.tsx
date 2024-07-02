import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import GameBoard from "./components/GameBoard";

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={"#372F7C"}
        // barStyle="dark-content"
      />
      <GameBoard />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
