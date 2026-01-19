// src/App.jsx
import React, { useState } from "react";
import "./App.css"; // Giữ file CSS gốc để style hoạt động

// Import 3 màn hình từ thư mục screens
import IntroScreen from "./screens/IntroScreen";
import ArmoryScreen from "./screens/ArmoryScreen";
import GameScreen from "./screens/GameScreen";

export default function App() {
  // Quản lý trạng thái: đang ở màn hình nào?
  // 'intro' -> 'armory' -> 'game'
  const [screen, setScreen] = useState("intro");

  // Lưu vũ khí người chơi chọn để mang sang màn game
  const [selectedWeapon, setSelectedWeapon] = useState(null);

  // Hàm xử lý khi bấm Start ở Armory
  const handleStartGame = (weapon) => {
    setSelectedWeapon(weapon); // Lưu vũ khí
    setScreen("game"); // Chuyển màn
  };

  return (
    <>
      {/* 1. Màn hình Intro */}
      {screen === "intro" && (
        <IntroScreen onEnter={() => setScreen("armory")} />
      )}

      {/* 2. Màn hình Chọn đồ (Armory) */}
      {screen === "armory" && (
        <ArmoryScreen
          onStartGame={handleStartGame}
          onBack={() => setScreen("intro")}
        />
      )}

      {/* 3. Màn hình Game */}
      {screen === "game" && (
        <GameScreen
          weaponEquipped={selectedWeapon}
          onBack={() => setScreen("armory")}
        />
      )}
    </>
  );
}
