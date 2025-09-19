import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const challenges = [
    { id: 1, title: "Build a Hover Button", description: "Create a button with a hover effect using CSS/React Native styling." },
    { id: 2, title: "Create a Portfolio Card", description: "Design a card component to showcase your projects." },
    { id: 3, title: "Use Flexbox", description: "Build a responsive layout using Flexbox in React Native." },
  ];

  const aiTips = [
    "Show process screenshots in your portfolio.",
    "Use clear, modern fonts and layouts.",
    "Highlight interactive projects you built.",
    "Write short, concise descriptions for each project.",
    "Include a GitHub or code link for every project.",
  ];

  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [currentTip, setCurrentTip] = useState(aiTips[0]);
  const [lastCompletionDate, setLastCompletionDate] = useState(null);

  // Load data on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedChallenges = await AsyncStorage.getItem("completedChallenges");
        const savedDate = await AsyncStorage.getItem("lastCompletionDate");
        if (savedChallenges) setCompletedChallenges(JSON.parse(savedChallenges));
        if (savedDate) setLastCompletionDate(savedDate);
      } catch (error) {
        console.log("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  // Daily reset check
  useEffect(() => {
    const checkDailyReset = async () => {
      const today = new Date().toDateString();
      if (lastCompletionDate && lastCompletionDate !== today) {
        setCompletedChallenges([]);
        await AsyncStorage.setItem("completedChallenges", JSON.stringify([]));
      }
    };
    checkDailyReset();
  }, [lastCompletionDate]);

  // Toggle challenge completion
  const toggleChallenge = async (id) => {
    const today = new Date().toDateString();
    let updatedChallenges;
    if (completedChallenges.includes(id)) {
      updatedChallenges = completedChallenges.filter((cId) => cId !== id);
    } else {
      updatedChallenges = [...completedChallenges, id];
    }
    setCompletedChallenges(updatedChallenges);
    await AsyncStorage.setItem("completedChallenges", JSON.stringify(updatedChallenges));
    await AsyncStorage.setItem("lastCompletionDate", today);
    setLastCompletionDate(today);
  };

  // Get random AI tip
  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * aiTips.length);
    setCurrentTip(aiTips[randomIndex]);
  };

  // Open portfolio link
  const openPortfolio = () => {
    Linking.openURL("https://yourportfolio.com"); // Replace with your portfolio URL
  };

  const streak = completedChallenges.length;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>SkillSync 🚀</Text>

      {/* Streak */}
      <Text style={styles.streak}>🔥 Current Streak: {streak} day(s)</Text>

      {/* Get AI Tip */}
      <TouchableOpacity style={styles.tipButton} onPress={getRandomTip} activeOpacity={0.7}>
        <Text style={styles.buttonText}>Get AI Tip 💡</Text>
      </TouchableOpacity>
      <Text style={styles.tip}>{currentTip}</Text>

      {/* Challenges List */}
      {challenges.map((challenge) => {
        const isDone = completedChallenges.includes(challenge.id);
        return (
          <View key={challenge.id} style={[styles.card, { backgroundColor: isDone ? "#0984e3" : "#1a1a1a" }]}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDesc}>{challenge.description}</Text>
            <TouchableOpacity
              style={[styles.button, isDone && styles.buttonDone]}
              onPress={() => toggleChallenge(challenge.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isDone ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>{isDone ? "Completed" : "Mark as Done"}</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Portfolio Button */}
      <TouchableOpacity style={styles.portfolioButton} onPress={openPortfolio} activeOpacity={0.8}>
        <Text style={styles.buttonText}>View My Portfolio 🌟</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0d0d0d",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
  },
  streak: {
    fontSize: 18,
    color: "#ffd700",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  tipButton: {
    backgroundColor: "#6c5ce7",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  tip: {
    color: "#eee",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  challengeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  challengeDesc: {
    fontSize: 16,
    color: "#eee",
    marginVertical: 10,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#00b894",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonDone: {
    backgroundColor: "#0984e3",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  portfolioButton: {
    backgroundColor: "#fd79a8",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
});