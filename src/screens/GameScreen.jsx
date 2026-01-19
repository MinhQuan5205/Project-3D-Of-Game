// src/screens/GameScreen.jsx
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Environment, Float, useGLTF } from "@react-three/drei";
import { Astronaut } from "../components/3d/Astronaut";
import * as THREE from "three";

// --- CONFIGURATION ---
const LEVELS = {
  1: { target: 3000, meteorRate: 60 },
  2: { target: 6000, meteorRate: 40 },
  3: { target: 5000, meteorRate: 5000 },
};
const BOSS_MAX_HP = 100;
const PLAYER_SPEED = 0.15;

// --- 3D COMPONENTS ---
function Bullet({ position }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.position.z -= 1.5;
  });
  return (
    <mesh ref={ref} position={position}>
      <capsuleGeometry args={[0.15, 0.8, 4]} />
      <meshStandardMaterial
        color="#38bdf8"
        emissive="#38bdf8"
        emissiveIntensity={3}
      />
    </mesh>
  );
}

function BonusItem({ position }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.position.z += 0.15;
      ref.current.rotation.y += 0.05;
      ref.current.rotation.z += 0.02;
    }
  });
  return (
    <Float speed={5} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={1}
          metalness={1}
          roughness={0}
        />
      </mesh>
    </Float>
  );
}

function Meteor({ position }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.position.z += 0.3;
      ref.current.rotation.x += 0.02;
      ref.current.rotation.y += 0.03;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <dodecahedronGeometry args={[0.9, 0]} />
      <meshStandardMaterial color="#c51717ff" roughness={0.9} />
    </mesh>
  );
}

function BossProjectile({ position }) {
  const ref = useRef();
  const { scene } = useGLTF("/models/enemies/Planet.glb");
  const clone = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.z += 0.4;
      ref.current.rotation.x += 0.05;
      ref.current.rotation.y += 0.05;
    }
  });
  return (
    <primitive
      object={clone}
      ref={ref}
      position={position}
      scale={[0.3, 0.3, 0.3]}
    />
  );
}

function Boss({ position, isHit }) {
  const ref = useRef();
  const { scene } = useGLTF("/models/enemies/Alien.glb");
  const clone = useMemo(() => scene.clone(), [scene]);
  const time = useRef(0);

  useFrame((state, delta) => {
    if (ref.current) {
      time.current += delta;
      const speed = time.current;

      ref.current.position.x = Math.sin(speed) * 5;
      ref.current.position.y = Math.cos(speed) * 1;

      //   // Visual Hit Effect (Scaling)
      //   if (isHit) {
      //     ref.current.scale.setScalar(1.2); // Scale up when hit
      //   } else {
      //     ref.current.scale.setScalar(0.4); // Return to normal scale (0.4)
      //   }
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Set base scale here, logic inside useFrame handles dynamic scaling */}
      <primitive object={clone} scale={[0.5, 0.5, 0.5]} rotation={[0, 0, 0]} />
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <torusGeometry args={[1.5, 0.1, 16, 100]} />
        <meshStandardMaterial
          color={isHit ? "white" : "red"}
          emissive={isHit ? "white" : "red"}
        />
      </mesh>
    </group>
  );
}

// --- MAIN GAME LOGIC ---
function GameContent({
  weaponEquipped,
  score,
  setScore,
  level,
  setGameState,
  bossHP,
  setBossHP,
  isRespawning,
  onPlayerHit,
}) {
  const playerRef = useRef();
  const bossRef = useRef({ position: new THREE.Vector3(0, 3, -15) });

  const [bullets, setBullets] = useState([]);
  const [meteors, setMeteors] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [bossProjectiles, setBossProjectiles] = useState([]);

  // FIX 2: Use State instead of Ref for rendering visual hit effect
  const [isBossHitVisual, setIsBossHitVisual] = useState(false);

  const { viewport, pointer } = useThree();
  const frameCount = useRef(0);
  const lastShot = useRef(0);

  // FIX 1: Wrap shoot in useCallback
  const shoot = useCallback(() => {
    if (isRespawning) return;
    const now = Date.now();
    if (now - lastShot.current < 150) return;
    lastShot.current = now;

    const newBullet = {
      id: now,
      x: playerRef.current.position.x,
      y: playerRef.current.position.y,
      z: playerRef.current.position.z - 1,
    };
    setBullets((prev) => [...prev, newBullet]);
  }, [isRespawning]);

  // Effect dependency is now safe because 'shoot' is memorized
  useEffect(() => {
    const handleDown = () => shoot();
    window.addEventListener("mousedown", handleDown);
    return () => window.removeEventListener("mousedown", handleDown);
  }, [shoot]);

  useFrame(() => {
    frameCount.current++;

    // --- A. SPAWN LOGIC ---
    if (level < 3) {
      if (frameCount.current % LEVELS[level].meteorRate === 0) {
        setMeteors((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: (Math.random() - 0.5) * 18,
            y: (Math.random() - 0.5) * 8,
            z: -30,
          },
        ]);
      }
      if (frameCount.current % 300 === 0) {
        setBonuses((prev) => [
          ...prev,
          {
            id: Date.now() + "b",
            x: (Math.random() - 0.5) * 15,
            y: (Math.random() - 0.5) * 6,
            z: -35,
          },
        ]);
      }
      if (score >= LEVELS[level].target) {
        setGameState("level-complete");
      }
    } else {
      if (frameCount.current % 100 === 0) {
        const time = frameCount.current / 60;
        const bossX = Math.sin(time) * 5;
        const bossY = Math.cos(time * 2) * 2 + 2;
        setBossProjectiles((prev) => [
          ...prev,
          { id: Date.now(), x: bossX, y: bossY, z: -10 },
        ]);
      }
    }

    // --- B. PLAYER MOVEMENT ---
    if (playerRef.current) {
      const targetX = pointer.x * (viewport.width / 2);
      const targetY = pointer.y * (viewport.height / 2);
      playerRef.current.position.x +=
        (targetX - playerRef.current.position.x) * PLAYER_SPEED;
      playerRef.current.position.y +=
        (targetY - playerRef.current.position.y) * PLAYER_SPEED;
      playerRef.current.rotation.z = -pointer.x * 0.5;

      if (isRespawning) {
        playerRef.current.visible = Math.floor(Date.now() / 100) % 2 === 0;
      } else {
        playerRef.current.visible = true;
      }

      if (level === 3) {
        const time = performance.now() / 1000;
        bossRef.current.position.set(
          Math.sin(time) * 5,
          Math.cos(time * 2) * 2 + 2,
          -15,
        );
      }
    }

    // --- C. UPDATE POSITIONS ---
    setBullets((prev) =>
      prev.map((b) => ({ ...b, z: b.z - 1.5 })).filter((b) => b.z > -50),
    );
    setMeteors((prev) =>
      prev.map((m) => ({ ...m, z: m.z + 0.3 })).filter((m) => m.z < 10),
    );
    setBonuses((prev) =>
      prev.map((b) => ({ ...b, z: b.z + 0.15 })).filter((b) => b.z < 10),
    );
    setBossProjectiles((prev) =>
      prev.map((p) => ({ ...p, z: p.z + 0.4 })).filter((p) => p.z < 10),
    );

    // --- D. COLLISION DETECTION ---

    // 1. Bullet vs Boss (Level 3)
    if (level === 3) {
      setBullets((prev) =>
        prev.filter((bullet) => {
          const bPos = new THREE.Vector3(bullet.x, bullet.y, bullet.z);
          if (bPos.distanceTo(bossRef.current.position) < 6) {
            setBossHP((prev) => {
              const newHP = prev - 2;
              if (newHP <= 0) setGameState("victory");
              return newHP;
            });
            setScore((s) => s + 50);

            // Trigger Visual Hit Effect
            setIsBossHitVisual(true);
            setTimeout(() => setIsBossHitVisual(false), 100);

            return false;
          }
          return true;
        }),
      );
    }

    // 2. Bullet vs Meteor
    setMeteors((prev) => {
      let nextMeteors = [...prev];
      bullets.forEach((b) => {
        nextMeteors = nextMeteors.filter((m) => {
          const dist = Math.sqrt(
            Math.pow(m.x - b.x, 2) + Math.pow(m.z - b.z, 2),
          );
          if (dist < 2) {
            setScore((s) => s + 100);
            return false;
          }
          return true;
        });
      });
      return nextMeteors;
    });

    // 3. Player vs Hazards
    if (!isRespawning && playerRef.current) {
      const checkHit = (objects) => {
        objects.forEach((obj) => {
          const dist = Math.sqrt(
            Math.pow(obj.x - playerRef.current.position.x, 2) +
              Math.pow(obj.z - playerRef.current.position.z, 2),
          );
          if (dist < 1.5) {
            onPlayerHit();
            obj.z = 100;
          }
        });
      };

      checkHit(meteors);
      checkHit(bossProjectiles);

      setBonuses((prev) =>
        prev.filter((b) => {
          const dist = Math.sqrt(
            Math.pow(b.x - playerRef.current.position.x, 2) +
              Math.pow(b.z - playerRef.current.position.z, 2),
          );
          if (dist < 2) {
            setScore((s) => s + 500);
            return false;
          }
          return true;
        }),
      );
    }
  });

  return (
    <>
      <group ref={playerRef} position={[0, -2, 0]}>
        <group scale={[0.5, 0.5, 0.5]} rotation={[0, Math.PI, 0]}>
          <Astronaut weaponData={weaponEquipped} />
        </group>
        {isRespawning && (
          <group position={[0, 0.85, 0]}>
            <mesh>
              <sphereGeometry args={[1.1, 32, 32]} />
              <meshStandardMaterial
                color="#0066ffc2"
                emissive="#00c8ffae"
                emissiveIntensity={3.0}
                transparent
                opacity={0.4}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[1.15, 32, 32]} />
              <meshBasicMaterial
                color="#00ffff"
                wireframe
                transparent
                opacity={0.3}
              />
            </mesh>
          </group>
        )}
      </group>

      {bullets.map((b) => (
        <Bullet key={b.id} position={[b.x, b.y, b.z]} />
      ))}
      {level < 3 &&
        meteors.map((m) => <Meteor key={m.id} position={[m.x, m.y, m.z]} />)}
      {bonuses.map((b) => (
        <BonusItem key={b.id} position={[b.x, b.y, b.z]} />
      ))}

      {/* FIX 2: Pass state isBossHitVisual instead of ref */}
      {level === 3 && (
        <>
          <Boss position={[0, 3, -15]} isHit={isBossHitVisual} />
          {bossProjectiles.map((p) => (
            <BossProjectile key={p.id} position={[p.x, p.y, p.z]} />
          ))}
        </>
      )}
    </>
  );
}

// --- MAIN SCREEN COMPONENT ---
export default function GameScreen({ onBack, weaponEquipped }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [bossHP, setBossHP] = useState(BOSS_MAX_HP);
  const [isRespawning, setIsRespawning] = useState(false);
  const [gameState, setGameState] = useState("playing");

  const handleNextLevel = () => {
    setLevel((prev) => prev + 1);
    setGameState("playing");
    setLives(3);
    setIsRespawning(false);
  };

  // FIX 3: Centralized damage handling, removed the conflicting useEffect
  const handlePlayerHit = () => {
    if (lives > 1) {
      setLives((prev) => prev - 1);
      setIsRespawning(true);
      // Auto turn off respawn after 3s
      setTimeout(() => setIsRespawning(false), 3000);
    } else {
      setLives(0);
      setGameState("game-over");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "black",
        cursor: "none",
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[0, 10, 5]} intensity={2} />
        <Environment preset="city" />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={level * 2}
        />

        {gameState === "playing" && (
          <GameContent
            weaponEquipped={weaponEquipped}
            score={score}
            setScore={setScore}
            level={level}
            setGameState={setGameState}
            bossHP={bossHP}
            setBossHP={setBossHP}
            isRespawning={isRespawning}
            onPlayerHit={handlePlayerHit} // Pass handlePlayerHit down
          />
        )}
      </Canvas>

      {/* --- HUD --- */}
      {gameState === "playing" && (
        <div className="game-hud">
          <div className="lives-box">
            {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
              <span key={i} className="life-heart">
                ❤️
              </span>
            ))}
          </div>
          <div
            style={{
              color: "cyan",
              fontFamily: "Press Start 2P",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            STAGE {level} <br />
            <span style={{ fontSize: "0.7rem", color: "white" }}>
              {level < 3
                ? `TARGET: ${LEVELS[level].target}`
                : "DEFEAT THE BOSS"}
            </span>
          </div>
          <div className="score-box">{score.toLocaleString()}</div>
        </div>
      )}

      {level === 3 && gameState === "playing" && (
        <div className="boss-hud">
          <div className="boss-name">ALIEN OVERLORD</div>
          <div className="hp-bar-container">
            <div
              className="hp-bar-fill"
              style={{ width: `${(bossHP / BOSS_MAX_HP) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* --- LEVEL COMPLETE --- */}
      {gameState === "level-complete" && (
        <div className="game-over-screen">
          <div className="scanlines"></div>
          <div className="vignette"></div>
          <div className="glitch-wrapper">
            <h1
              className="game-over-title"
              style={{ color: "#00ff00", textShadow: "2px 0 0 white" }}
            >
              STAGE CLEARED
            </h1>
            <p className="game-over-subtitle">HYPERDRIVE READY</p>
          </div>
          <div className="final-score">SCORE: {score.toLocaleString()}</div>
          <div className="cyber-button-container">
            <button className="cyber-button" onClick={handleNextLevel}>
              <span>NEXT MISSION</span>
              <span className="material-icons">arrow_forward</span>
            </button>
            <button className="cyber-button secondary" onClick={onBack}>
              <span>RETURN TO BASE</span>
              <span className="material-icons">home</span>
            </button>
          </div>
        </div>
      )}

      {/* --- VICTORY --- */}
      {gameState === "victory" && (
        <div className="game-over-screen">
          <div className="scanlines"></div>
          <div className="vignette"></div>
          <div className="glitch-wrapper">
            <h1
              className="game-over-title"
              style={{ color: "#ffd700", textShadow: "2px 0 0 orange" }}
            >
              MISSION
              <br />
              COMPLETE
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <span
                style={{
                  height: "4px",
                  width: "48px",
                  background: "#ffd700",
                  boxShadow: "0 0 5px gold",
                }}
              ></span>
              <span
                style={{
                  height: "4px",
                  width: "16px",
                  background: "white",
                  boxShadow: "0 0 5px white",
                }}
              ></span>
            </div>
            <p className="game-over-subtitle" style={{ color: "gold" }}>
              GALAXY SECURED
            </p>
          </div>
          <div className="final-score">
            FINAL SCORE:{" "}
            <span style={{ color: "gold" }}>{score.toLocaleString()}</span>
          </div>
          <div className="cyber-button-container">
            <button className="cyber-button" onClick={onBack}>
              <span>RETURN TO BASE</span>
              <span className="material-icons">verified</span>
            </button>
          </div>
        </div>
      )}

      {/* --- GAME OVER --- */}
      {gameState === "game-over" && (
        <div className="game-over-screen">
          <div className="scanlines"></div>
          <div className="vignette"></div>
          <div className="glitch-wrapper">
            <h1 className="game-over-title">
              MISSION
              <br />
              FAILED
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  height: "4px",
                  width: "48px",
                  background: "#00f2ff",
                  boxShadow: "0 0 5px #00f2ff",
                }}
              ></span>
              <span
                style={{
                  height: "4px",
                  width: "16px",
                  background: "#ff00ff",
                  boxShadow: "0 0 5px #ff00ff",
                }}
              ></span>
              <span
                style={{
                  height: "4px",
                  width: "32px",
                  background: "white",
                  boxShadow: "0 0 5px white",
                }}
              ></span>
            </div>
            <p className="game-over-subtitle">
              SYSTEM FAILURE // PILOT DISCONNECTED
            </p>
          </div>
          <div className="final-score">
            FINAL SCORE:{" "}
            <span style={{ color: "#00f2ff" }}>{score.toLocaleString()}</span>
          </div>
          <div className="cyber-button-container">
            <button className="cyber-button" onClick={onBack}>
              <span>RETURN TO BASE</span>
              <span className="material-icons" style={{ fontSize: "1.2rem" }}>
                replay
              </span>
            </button>
            {/* <button className="cyber-button secondary">
              <span>GLOBAL RANKING</span>
              <span className="material-icons" style={{ fontSize: "1.2rem" }}>
                leaderboard
              </span>
            </button> */}
          </div>
          <footer className="cyber-footer">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                opacity: 0.7,
              }}
            >
              <div className="footer-arrows">
                <span className="material-icons" style={{ fontSize: "10px" }}>
                  chevron_right
                </span>
                <span className="material-icons" style={{ fontSize: "10px" }}>
                  chevron_right
                </span>
                <span className="material-icons" style={{ fontSize: "10px" }}>
                  chevron_right
                </span>
              </div>
              <div style={{ letterSpacing: "2px" }}>SECURE CONNECTION LOST</div>
              <div
                className="footer-arrows"
                style={{ transform: "rotate(180deg)" }}
              >
                <span className="material-icons" style={{ fontSize: "10px" }}>
                  chevron_right
                </span>
                <span className="material-icons" style={{ fontSize: "10px" }}>
                  chevron_right
                </span>
                <span className="material-icons" style={{ fontSize: "10px" }}>
                  chevron_right
                </span>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
