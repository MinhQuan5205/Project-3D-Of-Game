// src/screens/ArmoryScreen.jsx
import React, { useState, Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Sparkles,
  ContactShadows,
  Environment,
} from "@react-three/drei";

// 👇 CHÚ Ý: Thêm dấu ".." vào trước các đường dẫn import
import { WEAPONS, CHARACTERS } from "../constants/gameData";
import { Astronaut } from "../components/3d/Astronaut";
import { SpaceTraffic } from "../components/3d/SpaceTraffic";
import { PlanetarySystem } from "../components/3d/PlanetarySystem";
// import "../App.css"; // Không cần import CSS ở đây nếu App.jsx đã import

// 👇 Nhận prop onStartGame từ cha
export default function ArmoryScreen({ onStartGame, onBack }) {
  const [currentWeapon, setCurrentWeapon] = useState(null);
  const [isHudOpen, setIsHudOpen] = useState(true);
  const astro = CHARACTERS && CHARACTERS.length > 0 ? CHARACTERS[0] : null;

  const audioRef = useRef(null);

  useEffect(() => {
    // 1. Khởi tạo
    audioRef.current = new Audio("/sounds/bgm.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    // 2. Phát nhạc
    audioRef.current.play().catch((e) => console.log(e));

    // --- QUAN TRỌNG: DỌN DẸP KHI RỜI MÀN HÌNH ---
    return () => {
      if (audioRef.current) {
        audioRef.current.pause(); // Tắt nhạc ngay lập tức
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="main-container" style={{ width: "100%", height: "100%" }}>
      {/* ... (Giữ nguyên toàn bộ phần Canvas cũ của bạn) ... */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
          <ambientLight intensity={2} />
          <directionalLight position={[5, 5, 5]} intensity={3} />
          <Environment preset="city" />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <color attach="background" args={["#050505"]} />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          <Sparkles
            count={100}
            scale={10}
            size={2}
            speed={0.4}
            opacity={0.5}
            color="cyan"
          />

          <Suspense fallback={null}>
            {astro && (
              <group position={astro.position}>
                <Astronaut weaponData={currentWeapon} />
              </group>
            )}
          </Suspense>

          <ContactShadows
            resolution={1024}
            scale={10}
            blur={1}
            opacity={0.5}
            far={10}
            color="#000000"
          />
          <SpaceTraffic />
          <PlanetarySystem />
          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* ... (Phần HUD cũ giữ nguyên) ... */}
      <div className={`weapon-hud ${isHudOpen ? "" : "closed"}`}>
        {/* ... (Code nút toggle và danh sách vũ khí giữ nguyên) ... */}
        {/* Tôi lược bớt để code ngắn gọn, bạn giữ nguyên code cũ nhé */}
        <button className="toggle-btn" onClick={() => setIsHudOpen(!isHudOpen)}>
          {isHudOpen ? "▶" : "◀"}
        </button>
        <h2 className="hud-title">ARMORY SYSTEM</h2>
        <div className="weapon-list">
          {/* Map danh sách vũ khí cũ... */}
          <div
            className={`weapon-item ${currentWeapon === null ? "active" : ""}`}
            onClick={() => setCurrentWeapon(null)}
          >
            <div className="weapon-icon">🚫</div>
            <div className="weapon-name">Tay không</div>
          </div>
          {WEAPONS.map((w) => (
            <div
              key={w.id}
              className={`weapon-item ${currentWeapon?.id === w.id ? "active" : ""}`}
              onClick={() => setCurrentWeapon(w)}
            >
              <div className="weapon-icon">
                <img src={w.icon} alt={w.name} />
              </div>
              <div className="weapon-name">{w.name}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onStartGame(currentWeapon)}
          style={{
            marginTop: "3px",
            padding: "1px",
            background: "#00ffff",
            color: "black",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "2px",
          }}
        >
          START GAME
        </button>
        <button
          onClick={onBack}
          style={{
            marginTop: "3px",
            padding: "1px",
            background: "#00ffff",
            color: "black",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "2px",
          }}
        >
          RETURN INTRO OF THE GAME
        </button>
      </div>
    </div>
  );
}
