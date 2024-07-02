import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Button,
  Modal,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Card from "./Card";

const images = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

const GameBoard: React.FC = () => {
  const [cards, setCards] = useState<
    { id: number; image: string; isFlipped: boolean; isMatched: boolean }[]
  >([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [turns, setTurns] = useState(0);
  const [timer, setTimer] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (matches === images.length) {
      stopTimer();
      setModalVisible(true);
    }
  }, [matches]);

  const startGame = () => {
    const shuffledCards = shuffle(
      [...images, ...images].map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }))
    );
    setCards(shuffledCards);
    setMatches(0);
    setTurns(0);
    setTimer(0);
    setModalVisible(false);
    startTimer();
  };

  const shuffle = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    const newCards = cards.map((card) => ({
      ...card,
      isFlipped: newFlippedCards.includes(card.id) || card.isMatched,
    }));
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      const [firstCard, secondCard] = newFlippedCards.map(
        (cardId) => cards.find((card) => card.id === cardId)!
      );
      if (firstCard.image === secondCard.image) {
        const updatedCards = newCards.map((card) =>
          card.id === firstCard.id || card.id === secondCard.id
            ? { ...card, isMatched: true }
            : card
        );
        setCards(updatedCards);
        setMatches(matches + 1);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          const updatedCards = newCards.map((card) =>
            !card.isMatched ? { ...card, isFlipped: false } : card
          );
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
      setTurns(turns + 1);
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };

  const numColumns = 4;
  const cardSize = (Dimensions.get("window").width - 70) / numColumns;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://img.freepik.com/free-vector/gradient-abstract-background_23-2149131346.jpg",
        }}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 60 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 40,
            }}
          >
            <Text style={styles.score}>Score: {matches}</Text>
            <Text style={styles.timer}>{formatTime(timer)}</Text>
            <Text style={styles.turns}>Turns: {turns}</Text>
          </View>

          <View style={styles.board}>
            {cards.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                image={card.image}
                onClick={handleCardClick}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                size={cardSize}
              />
            ))}
          </View>
          <View style={{ marginTop: 50 }}>
            <TouchableOpacity
              onPress={startGame}
              style={{
                backgroundColor: "#5580e9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 14,
                paddingBottom: 14,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#f5f5f5", fontSize: 17 }}>
                Restart Game
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>You won!</Text>
                <Button
                  title="Play Again"
                  onPress={() => {
                    setModalVisible(false);
                    startGame();
                  }}
                />
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  score: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 10,
    marginRight: 20,
    backgroundColor: "#f5f5f5",
    color: "#333",
    padding: 5,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 10,
  },
  turns: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    color: "#333",
    padding: 5,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 10,
  },
  timer: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 18,
    marginRight: 20,
    backgroundColor: "#a4bbf5",
    color: "#f5f5f5",
    padding: 5,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 10,
  },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
    rowGap: 20,
    columnGap: 0,
    backgroundColor: "#f9f9f9",
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default GameBoard;
