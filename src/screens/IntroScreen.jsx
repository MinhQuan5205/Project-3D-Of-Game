// src/screens/IntroScreen.jsx
import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, Sparkles, OrbitControls, Environment } from "@react-three/drei";
// 👇 Nhớ đường dẫn import có 2 dấu chấm
import { PlanetarySystem } from "../components/3d/PlanetarySystem";

export default function IntroScreen({ onEnter, onGuide }) {
  // Dùng useRef để giữ biến audio, giúp ta có thể can thiệp vào nó lúc component bị hủy
  const audioRef = useRef(null);

  useEffect(() => {
    // 1. Khởi tạo nhạc
    audioRef.current = new Audio("/sounds/bgm.mp3"); // Hoặc menu_bgm.mp3 nếu bạn có file riêng
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    // 2. Phát nhạc (Xử lý lỗi chặn autoplay)
    const playMusic = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .catch(() => console.log("Waiting for interaction..."));
      }
    };
    playMusic();

    // Sự kiện click để phát nếu bị chặn
    const handleInteract = () => {
      if (audioRef.current) audioRef.current.play().catch(() => {});
      window.removeEventListener("click", handleInteract);
    };
    window.addEventListener("click", handleInteract);

    // --- QUAN TRỌNG: PHẦN DỌN DẸP (CLEANUP) ---
    // Đoạn này sẽ chạy TỰ ĐỘNG ngay trước khi màn hình này biến mất
    return () => {
      if (audioRef.current) {
        audioRef.current.pause(); // Dừng nhạc
        audioRef.current.currentTime = 0; // Tua về đầu
      }
      window.removeEventListener("click", handleInteract);
    };
  }, []);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "black",
      }}
    >
      {/* 3D Background */}
      <Canvas camera={{ position: [0, 0, 15] }}>
        <ambientLight intensity={2} />
        <directionalLight position={[5, 5, 5]} intensity={3} />
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={2} />
        <Sparkles
          count={200}
          scale={15}
          size={4}
          speed={0.4}
          opacity={0.7}
          color="cyan"
        />
        <PlanetarySystem />
        <OrbitControls autoRotate enableZoom={false} autoRotateSpeed={1.0} />
      </Canvas>

      {/* UI Overlay */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "white",
          zIndex: 10,
          width: "100%",
          padding: "0 16px",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 11vw, 5rem)",
            margin: 0,
            color: "#00ffff",
            textShadow: "0 0 20px cyan",
            fontFamily: "sans-serif",
            lineHeight: 1.1,
          }}
        >
          GALAXY WARRIOR
        </h1>
        <p
          style={{
            fontSize: "clamp(0.8rem, 3.4vw, 1.2rem)",
            letterSpacing: "clamp(1px, 1vw, 5px)",
            color: "#aaa",
          }}
        >
          PROJECT OF 3D GAME
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            onClick={onEnter}
            style={{
              padding: "clamp(10px, 2.5vw, 15px) clamp(20px, 7vw, 50px)",
              fontSize: "clamp(1rem, 4.5vw, 1.5rem)",
              background: "transparent",
              border: "2px solid #00ffff",
              color: "#00ffff",
              cursor: "pointer",
              borderRadius: "30px",
              transition: "0.3s",
              fontWeight: "bold",
              minWidth: "min(80vw, 360px)",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#00ffff";
              e.target.style.color = "black";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#00ffff";
            }}
          >
            ENTER UNIVERSE
          </button>

          <button
            onClick={onGuide}
            style={{
              padding: "clamp(10px, 2.5vw, 13px) clamp(20px, 7vw, 50px)",
              fontSize: "clamp(0.9rem, 3.8vw, 1.1rem)",
              background: "rgba(0, 255, 255, 0.14)",
              border: "1px solid #00ffff",
              color: "#d8ffff",
              cursor: "pointer",
              borderRadius: "30px",
              transition: "0.3s",
              fontWeight: "bold",
              minWidth: "min(80vw, 360px)",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(0, 255, 255, 0.28)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(0, 255, 255, 0.14)";
            }}
          >
            INTRODUCTION OF GAMES
          </button>
        </div>
      </div>
    </div>
  );
}
