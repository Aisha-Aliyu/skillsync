import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  // --- 30 real challenges ---
  const allChallenges = [
    { id: 1, title: "Build a Hover Button", description: "Create a button with a hover effect using CSS/React Native styling." },
    { id: 2, title: "Create a Portfolio Card", description: "Design a card component to showcase your projects." },
    { id: 3, title: "Use Flexbox", description: "Build a responsive layout using Flexbox in React Native." },
    { id: 4, title: "Animate a Button", description: "Add a simple animation to a button on press." },
    { id: 5, title: "Responsive Layout", description: "Make a layout that adapts to screen size." },
    { id: 6, title: "Add Shadows", description: "Use shadow/elevation for UI depth." },
    { id: 7, title: "Create a Modal", description: "Build a popup modal component." },
    { id: 8, title: "Add Gradient Background", description: "Use linear gradient for backgrounds." },
    { id: 9, title: "Build a Card Carousel", description: "Create a horizontal scroll of cards." },
    { id: 10, title: "Use AsyncStorage", description: "Store and retrieve data persistently." },
    { id: 11, title: "Implement Dark Mode", description: "Allow users to toggle between dark/light themes." },
    { id: 12, title: "Build a Stopwatch", description: "Create a functional stopwatch with start/stop/reset." },
    { id: 13, title: "Create a Quiz App", description: "Develop a small quiz with multiple choice questions." },
    { id: 14, title: "Implement Search Filter", description: "Add a search filter to a list of items." },
    { id: 15, title: "Use React Navigation", description: "Create multiple screens with navigation between them." },
    { id: 16, title: "Add Pull-to-Refresh", description: "Enable pull-to-refresh functionality on a list." },
    { id: 17, title: "Build a To-Do App", description: "Allow users to add, mark, and delete tasks." },
    { id: 18, title: "Use FlatList Optimization", description: "Render a large list efficiently using FlatList." },
    { id: 19, title: "Implement Swipe Gesture", description: "Add swipe gestures for deleting or marking items." },
    { id: 20, title: "Use Context API", description: "Manage state globally with React Context." },
    { id: 21, title: "Build a Calculator", description: "Create a functional calculator app." },
    { id: 22, title: "Integrate Google Maps", description: "Show a map with markers using Expo Maps." },
    { id: 23, title: "Add Push Notifications", description: "Send a local notification to the user." },
    { id: 24, title: "Use Async Storage", description: "Store user preferences locally on the device." },
    { id: 25, title: "Implement Loading Skeletons", description: "Show skeleton placeholders while content loads." },
    { id: 26, title: "Create Animated Tabs", description: "Switch between screens with animated tab navigation." },
    { id: 27, title: "Build a Countdown Timer", description: "Create a timer counting down to an event." },
    { id: 28, title: "Add Image Picker", description: "Allow users to select images from their gallery." },
    { id: 29, title: "Implement Theme Persistence", description: "Save user-selected theme across sessions." },
    { id: 30, title: "Add Microinteractions", description: "Enhance UX with small, animated feedbacks." },
  ];

  // --- AI Tips ---
  const aiTips = [
    "Show process screenshots in your portfolio.",
    "Use clear, modern fonts and layouts.",
    "Highlight interactive projects you built.",
    "Write short, concise descriptions for each project.",
    "Include a GitHub or code link for every project.",
    "Add animations for better UX.",
    "Keep consistency in design colors and spacing.","Write case studies for big projects.",
    "Use mockups to display projects professionally.",
    "Add testimonials or feedback if possible.",
    "Show real metrics like user growth or downloads.",
    "Keep your portfolio mobile-friendly.",
    "Focus on projects relevant to your target job.",
    "Add a short About Me with your career goal.",
    "Demonstrate problem-solving, not just code.",
  ];

  // --- state ---
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [currentTip, setCurrentTip] = useState(aiTips[0]);
  const [lastCompletionDate, setLastCompletionDate] = useState(null);
  const [shootConfetti, setShootConfetti] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [weeklyStreak, setWeeklyStreak] = useState([0,0,0,0,0,0,0]);

  const [scaleAnim] = useState(new Animated.Value(1));
  const iconScale = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const streakAnim = useRef(new Animated.Value(0)).current;

  const slideAnim = useRef([]).current;
  const fadeAnim = useRef([]).current;
  const pressAnim = useRef([]).current;

  // --- deterministic daily selection ---
  const getDailyChallenges = () => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const shuffled = [...allChallenges];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.abs(Math.sin(seed + i) * 10000) % (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  };

  // --- Load challenges ---
  useEffect(() => {
    const todayChallenges = getDailyChallenges();
    setDailyChallenges(todayChallenges);

    todayChallenges.forEach((_, i) => {
      slideAnim[i] = new Animated.Value(50);
      fadeAnim[i] = new Animated.Value(0);
      pressAnim[i] = new Animated.Value(0);
    });

    const loadData = async () => {
      try {
        const savedCompleted = await AsyncStorage.getItem("completedChallenges");
        const savedDate = await AsyncStorage.getItem("lastCompletionDate");
        const savedWeekly = await AsyncStorage.getItem("weeklyStreak");
        const todayStr = new Date().toDateString(); 
        let restored = [];

        if (savedDate === todayStr && savedCompleted) {
          restored = JSON.parse(savedCompleted);
        } else {
          await AsyncStorage.removeItem("completedChallenges");
          await AsyncStorage.removeItem("lastCompletionDate");
        }

        const filtered = restored.filter((id) => todayChallenges.some((c) => c.id === id));
        setCompletedChallenges(filtered);

        if (savedWeekly) setWeeklyStreak(JSON.parse(savedWeekly));
        setLastCompletionDate(savedDate ?? null);

        if (!savedDate || savedDate !== todayStr) setShowReminder(true);
      } catch (err) {
        console.log("loadData error:", err);
      }
    };
    loadData();
  }, []);

  // --- animate cards in ---
  useEffect(() => {
    dailyChallenges.forEach((_, index) => {
      Animated.parallel([
        Animated.timing(slideAnim[index], { toValue: 0, duration: 500, delay: index * 150, useNativeDriver: true }),
        Animated.timing(fadeAnim[index], { toValue: 1, duration: 500, delay: index * 150, useNativeDriver: true }),
      ]).start();
    });
  }, [dailyChallenges]);

  // --- progress bar ---
  useEffect(() => {
    const total = dailyChallenges.length || 3;
    const completedCount = dailyChallenges.filter((c) => completedChallenges.includes(c.id)).length;
    const progress = total > 0 ? completedCount / total : 0;
    Animated.timing(progressAnim, { toValue: progress, duration: 600, useNativeDriver: false }).start();
    Animated.timing(streakAnim, { toValue: completedCount, duration: 600, useNativeDriver: false }).start();
  }, [completedChallenges, dailyChallenges]);

  // --- reset daily ---
  useEffect(() => {const checkDailyReset = async () => {
      const today = new Date().toDateString();
      if (lastCompletionDate && lastCompletionDate !== today) {
        setCompletedChallenges([]);
        await AsyncStorage.setItem("completedChallenges", JSON.stringify([]));
        const newWeekly = [...weeklyStreak.slice(1), 0];
        setWeeklyStreak(newWeekly);
        await AsyncStorage.setItem("weeklyStreak", JSON.stringify(newWeekly));
      }
    };
    checkDailyReset();
  }, [lastCompletionDate]);

  // --- toggle completion ---
  const toggleChallenge = async (id) => {
    const today = new Date().toDateString();
    let updated = [];

    if (completedChallenges.includes(id)) {
      updated = completedChallenges.filter((cId) => cId !== id);
    } else {
      updated = [...completedChallenges, id];
    }

    const allowedIds = dailyChallenges.map((c) => c.id);
    updated = updated.filter((cId) => allowedIds.includes(cId));

    if (!completedChallenges.includes(id)) {
      setShootConfetti(true);
      setShowReminder(false);
      setTimeout(() => setShootConfetti(false), 1000);

      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();

      Animated.sequence([
        Animated.timing(iconScale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
        Animated.spring(iconScale, { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();
    }

    setCompletedChallenges(updated);
    await AsyncStorage.setItem("completedChallenges", JSON.stringify(updated));
    await AsyncStorage.setItem("lastCompletionDate", today);
    setLastCompletionDate(today);

    const completedForToday = updated.filter((id) => allowedIds.includes(id)).length;
    const newWeekly = [...weeklyStreak];
    newWeekly[6] = completedForToday;
    setWeeklyStreak(newWeekly);
    await AsyncStorage.setItem("weeklyStreak", JSON.stringify(newWeekly));
  };

  // helpers
  const completedTodayCount = dailyChallenges.filter((c) => completedChallenges.includes(c.id)).length;
  const totalToday = dailyChallenges.length || 3;
  const getRandomTip = () => setCurrentTip(aiTips[Math.floor(Math.random() * aiTips.length)]);
  const openPortfolio = () => Linking.openURL("https://yourportfolio.com");

  return (
    <LinearGradient colors={["#0d0d0d", "#1a1a1a"]} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>SkillSync 🚀</Text>
        <Animated.Text style={styles.streak}>
          🔥 Current Streak: {completedTodayCount} day(s)
        </Animated.Text>

        {showReminder && (
          <View style={styles.reminder}>
            <Text style={styles.reminderText}>Don't forget to complete your daily challenges! ⚡️</Text>
          </View>
        )}

        <TouchableOpacity style={styles.tipButton} onPress={getRandomTip} activeOpacity={0.7}>
          <LinearGradient colors={["#6c5ce7", "#a29bfe"]} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Get AI Tip 💡</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.tip}>{currentTip}</Text>

        <View style={styles.progressContainer}>
          <Animated.View style={[
            styles.progressBar,
            { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }
          ]}/>
        </View>
        <Text style={styles.progressText}>{completedTodayCount}/{totalToday} Challenges Completed</Text>

        {dailyChallenges.map((challenge, index) => {
          const isDone = completedChallenges.includes(challenge.id);
          const cardColors = pressAnim[index]?._value === 1 ? ["#6c5ce7", "#a29bfe"] : ["#0f0f0f", "#1a1a1a"];
          return (
            <Animated.View
              key={challenge.id}
              style={[styles.card,{ transform:[{translateY:slideAnim[index]},{scale:scaleAnim}], opacity:fadeAnim[index]}]}
            ><Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDesc}>{challenge.description}</Text>
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={()=>pressAnim[index].setValue(1)}
                onPressOut={()=>pressAnim[index].setValue(0)}
                onPress={()=>toggleChallenge(challenge.id)}
              >
                <LinearGradient colors={cardColors} style={styles.gradientButton}>
                  <Animated.View style={{ transform:[{scale:iconScale}] }}>
                    <Ionicons name={isDone?"checkmark-circle":"ellipse-outline"} size={20} color="#fff" style={{marginRight:8}}/>
                  </Animated.View>
                  <Text style={styles.buttonText}>{isDone?"Completed":"Mark as Done"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {shootConfetti && (
          <View style={{ position:"absolute",top:0,left:0,right:0,bottom:0,justifyContent:"center",alignItems:"center" }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <Text key={i} style={{ fontSize:20, position:"absolute", top:Math.random()*500, left:Math.random()*300 }}>
                🎉
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.weeklyTitle}>Weekly Streak 📊</Text>
        <View style={styles.weeklyChart}>
          {weeklyStreak.map((count, index) => (
            <View key={index} style={styles.weekBarContainer}>
              <Animated.View style={[styles.weekBar, { height: 20 + count * 10, backgroundColor: count === totalToday ? "#6c5ce7" : "#00cec9" }]} />
              <Text style={styles.weekDay}>D{index + 1}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={openPortfolio} activeOpacity={0.8}>
          <LinearGradient colors={["#fd79a8", "#e84393"]} style={styles.gradientButton}>
            <Text style={styles.buttonText}>View My Portfolio 🌟</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fab} onPress={getRandomTip}>
          <Ionicons name="bulb-outline" size={28} color="#fff"/>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1,padding:20 },
  header:{ fontSize:32,fontWeight:"bold",color:"#fff",textAlign:"center",marginVertical:20 },
  streak:{ fontSize:18,color:"#ffd700",textAlign:"center",marginBottom:20,fontWeight:"bold" },
  reminder:{ backgroundColor:"#ffeaa7",padding:10,borderRadius:12,marginBottom:15 },
  reminderText:{ color:"#2d3436",textAlign:"center",fontWeight:"bold" },
  tipButton:{ marginBottom:10 },
  gradientButton:{ padding:12,borderRadius:12,flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:10 },
  tip:{ color:"#eee",fontSize:16,textAlign:"center",marginBottom:20 },
  progressContainer:{ height:20,backgroundColor:"#333",borderRadius:10,overflow:"hidden",marginBottom:5 },
  progressBar:{ height:"100%",backgroundColor:"#00b894" },
  progressText:{ color:"#eee",fontSize:14,textAlign:"center",marginBottom:20 },
  card:{ borderRadius:16,padding:20,marginBottom:20,backgroundColor:"rgba(255,255,255,0.05)",shadowColor:"#000",shadowOffset:{ width:0,height:2 },shadowOpacity:0.4,shadowRadius:5,elevation:5 },
  challengeTitle:{ fontSize:22,fontWeight:"bold",color:"#fff" },
  challengeDesc:{ fontSize:16,color:"#eee",marginVertical:10 },
  buttonText:{ color:"#fff",fontWeight:"bold",fontSize:16 },
  weeklyTitle:{ color:"#fff",fontSize:18,fontWeight:"bold",marginBottom:10,textAlign:"center" },
  weeklyChart:{ flexDirection:"row",justifyContent:"space-between",marginBottom:30 },
  weekBarContainer:{ alignItems:"center" },
  weekBar:{ width:20,borderRadius:5 },
  weekDay:{ color:"#ccc",marginTop:5 },fab:{ position:"absolute",bottom:20,right:20,width:60,height:60,borderRadius:30,backgroundColor:"#6c5ce7",justifyContent:"center",alignItems:"center",elevation:5 }
});