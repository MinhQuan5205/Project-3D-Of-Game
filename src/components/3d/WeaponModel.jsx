// src/components/3d/WeaponModel.jsx
import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

// Đã xóa import { useControls } from 'leva'

export function WeaponModel({ path, config }) {
  // Tải model 3D
  const { scene } = useGLTF(path);

  // Clone scene để tránh lỗi khi dùng chung model nhiều lần
  const clone = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clone}
      // Lấy trực tiếp thông số đã set cứng từ gameData.js
      position={config.position || [0, 0, 0]}
      rotation={config.rotation || [0, 0, 0]}
      scale={config.scale || [1, 1, 1]}
    />
  );
}
