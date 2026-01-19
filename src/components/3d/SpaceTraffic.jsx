// src/components/3d/SpaceTraffic.jsx
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// Component con: Đại diện cho 1 chiếc tàu đang bay
function OrbitingShip({
  path,
  radius,
  speed,
  scale,
  yOffset,
  rotationOffset = 0,
}) {
  const pivotRef = useRef(); // Đây là cái trục xoay ở tâm (0,0,0)

  // Load model
  const { scene } = useGLTF(path);

  // Clone scene để dùng nhiều lần không lỗi
  const clone = React.useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    // Xoay trục pivot -> Tàu sẽ bay vòng quanh
    if (pivotRef.current) {
      pivotRef.current.rotation.y += speed * delta;
    }
  });

  return (
    <group ref={pivotRef} rotation={[0, rotationOffset, 0]}>
      {/* Con tàu nằm cách tâm một khoảng = radius */}
      <primitive
        object={clone}
        scale={scale}
        // position: [Khoảng cách xa, Độ cao, 0]
        position={[radius, yOffset, 0]}
        // Xoay nhẹ con tàu để nó hướng theo chiều bay (tùy chỉnh nếu bị ngược)
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
}

export function SpaceTraffic() {
  return (
    <>
      {/* 1. Trạm ISS: Bay rất chậm, bán kính xa, nằm trên cao */}
      <OrbitingShip
        path="/models/vehicles/International Space Station.glb"
        radius={15} // Cách tâm 15 mét
        speed={0.05} // Bay rất chậm
        scale={[0.2, 0.2, 0.2]}
        yOffset={5} // Bay cao hơn đầu nhân vật
        rotationOffset={0}
      />

      {/* 2. TIE Fighter: Bay nhanh, bán kính trung bình */}
      <OrbitingShip
        path="/models/vehicles/Flying saucer.glb"
        radius={10}
        speed={0.3} // Bay nhanh
        scale={[0.1, 0.1, 0.1]}
        yOffset={1} // Ngang người
        rotationOffset={Math.PI} // Xuất phát từ phía đối diện
      />

      {/* 3. X-Wing: Bay đuổi theo TIE, thấp hơn chút */}
      <OrbitingShip
        path="/models/vehicles/Spaceship.glb"
        radius={12}
        speed={0.25} // Tốc độ khác chút để tạo cảm giác đuổi bắt
        scale={[0.5, 0.5, 0.5]}
        yOffset={-3} // Bay thấp dưới chân
        rotationOffset={Math.PI / 2}
      />
    </>
  );
}
