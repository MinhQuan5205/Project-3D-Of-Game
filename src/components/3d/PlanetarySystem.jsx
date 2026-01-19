// src/components/3d/PlanetarySystem.jsx
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

function Planet({ path, position, scale, rotationSpeed }) {
  const planetRef = useRef();
  const { scene } = useGLTF(path);
  const clone = React.useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  return (
    <primitive
      ref={planetRef}
      object={clone}
      position={position}
      scale={scale}
    />
  );
}

export function PlanetarySystem() {
  return (
    <group>
      {/* 1. Hành tinh Đỏ (Trung tâm): Đẩy ra cực xa (-100) và phóng to gấp 4 lần */}
      <Planet
        path="/models/planets/Planet.glb"
        position={[0, 10, -100]}
        scale={[10, 10, 10]}
        rotationSpeed={0.01}
      />

      {/* 2. Hành tinh Có Đai (Trái): Đẩy xa -80 */}
      <Planet
        path="/models/planets/Planet (1).glb"
        position={[-50, 20, -80]}
        scale={[8, 8, 8]}
        rotationSpeed={0.02}
      />

      {/* 3. Hành tinh Băng (Phải): Đẩy xa -90 */}
      <Planet
        path="/models/planets/Planet (2).glb"
        position={[50, 15, -90]}
        scale={[8, 8, 8]}
        rotationSpeed={0.015}
      />

      {/* 4. Hành tinh Dung Nham (Phải dưới): Đẩy xa -70 */}
      <Planet
        path="/models/planets/Planet (3).glb"
        position={[40, -30, -70]}
        scale={[9, 9, 9]}
        rotationSpeed={0.03}
      />

      {/* 5. Hành tinh Đá (Trái dưới): Đẩy xa -60 */}
      <Planet
        path="/models/planets/Planet (4).glb"
        position={[-40, -25, -60]}
        scale={[6, 6, 6]}
        rotationSpeed={0.02}
      />
    </group>
  );
}
