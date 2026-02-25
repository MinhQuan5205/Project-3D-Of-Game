import React, { useEffect } from "react";
import { useGraph, useFrame, createPortal } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { WeaponModel } from "./WeaponModel";

export function Astronaut({ weaponData, ...props }) {
  // Sửa đường dẫn cho đúng với thư mục public
  const { scene, animations } = useGLTF(
    "/models/character/Rigged Astronaut.glb",
  );
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  // (Optional) Xử lý Animation nếu có
  const { actions } = useAnimations(animations, clone);
  useEffect(() => {
    // Nếu model có animation tên là "Idle", chạy nó
    // console.log(actions) // Bật cái này lên để xem tên chính xác của animation
    if (actions?.Idle) actions.Idle.play();
  }, [actions]);

  return (
    <group {...props} dispose={null}>
      <group
        position={[0.008, 1.373, 0.014]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={16.345}
      >
        <skinnedMesh
          geometry={nodes.Body_1.geometry}
          material={materials.flag}
          skeleton={nodes.Body_1.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Body_2.geometry}
          material={materials.white}
          skeleton={nodes.Body_2.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Body_3.geometry}
          material={materials.gray}
          skeleton={nodes.Body_3.skeleton}
        />
      </group>
      <group
        position={[0.002, 2.058, 0.058]}
        rotation={[-1.612, 1.571, 0]}
        scale={[18.112, 17.825, 17.825]}
      >
        <skinnedMesh
          geometry={nodes.Helmet_1.geometry}
          material={materials.white}
          skeleton={nodes.Helmet_1.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Helmet_2.geometry}
          material={materials.transparent_mask}
          skeleton={nodes.Helmet_2.skeleton}
        />
      </group>

      <primitive object={nodes.mixamorigHips} />

      {/* LOGIC GẮN VŨ KHÍ (QUAN TRỌNG NHẤT) */}
      {/* Tìm node tên là mixamorigRightHand (tên chuẩn của Mixamo) và dùng Portal đưa vũ khí vào */}
      {nodes.mixamorigRightHand &&
        weaponData &&
        createPortal(
          <WeaponModel path={weaponData.path} config={weaponData} />,
          nodes.mixamorigRightHand, // Đích đến: Xương tay phải
        )}
    </group>
  );
}

useGLTF.preload("/models/character/Rigged Astronaut.glb");
