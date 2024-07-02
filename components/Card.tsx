import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface CardProps {
  id: number;
  image: string;
  onClick: (id: number) => void;
  isFlipped: boolean;
  isMatched: boolean;
  size: number;
}

const Card: React.FC<CardProps> = ({
  id,
  image,
  onClick,
  isFlipped,
  isMatched,
  size,
}) => {
  const handlePress = () => {
    if (!isFlipped && !isMatched) {
      onClick(id);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.card, { width: size, height: size }]}
    >
      <Text style={styles.text}>{isFlipped || isMatched ? image : "?"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    backgroundColor: "#a4bbf5",
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#5580e9",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f5f5f5",
  },
});

export default Card;
