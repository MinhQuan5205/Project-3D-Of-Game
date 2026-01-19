// src/constants/gameData.js

export const CHARACTERS = [
  {
    id: "char_astro",
    name: "Phi Hành Gia",
    path: "/models/character/Rigged Astronaut.glb",
    scale: 1,
    position: [0, -2, 0],
    rotation: [0, 0, 0],
  },
];

export const WEAPONS = [
  {
    id: "w_aether",
    name: "Aether Shard",
    // Lưu ý: Tên file dùng dấu gạch ngang dài (–) copy từ tên ảnh
    path: "/models/weapons/Aether Shard – Energy Sword.glb",
    icon: "/images/icons/Aether Shard – Energy Sword.png",
    // --- CẬP NHẬT CÁC DÒNG NÀY THEO ẢNH BẠN GỬI ---
    scale: [0.5, 0.5, 0.5], // Lấy từ thanh 'scale'
    rotation: [0.5, 1.7, 0.8], // Thứ tự: [rotX, rotY, rotZ]
    position: [0.02, 0.2, 0.1], // Thứ tự: [posX, posY, posZ]
  },
  {
    id: "w_axe",
    name: "Plasma Axe",
    path: "/models/weapons/SCI-FI Axe.glb",
    icon: "/images/icons/SCI-FI Axe.png",
    // --- CẬP NHẬT 3 DÒNG NÀY ---
    scale: [0.3, 0.3, 0.3], // Lấy từ thanh 'scale'
    rotation: [-1.8, 0.5, 0.3], // Thứ tự: [rotX, rotY, rotZ]
    position: [0.1, 0.3, 0], // Thứ tự: [posX, posY, posZ]
  },
  {
    id: "w_spear",
    name: "Blue Spear",
    path: "/models/weapons/SCI-FI Blue Spear.glb",
    icon: "/images/icons/SCI-FI Blue Spear.png",
    scale: [0.3, 0.3, 0.3], // Scale tăng lên 0.5
    rotation: [0, -3.4, -0.3], // Góc xoay mới
    position: [1.1, -3.5, 0.6], // Vị trí mới
  },
  {
    id: "w_knuckles",
    name: "Brass Knuckles",
    path: "/models/weapons/SCI-FI Brass-Knuckles.glb",
    icon: "/images/icons/SCI-FI Brass-Knuckles.png",
    scale: [0.5, 0.5, 0.5], // Giữ nguyên scale 0.5
    rotation: [0.2, 1.5, 0.2], // Góc xoay [X, Y, Z]
    position: [-0.8, -1.3, -0.7], // Vị trí [X, Y, Z]
  },
  {
    id: "w_energy_sword",
    name: "Energy Sword",
    path: "/models/weapons/SCI-FI Energy Sword.glb",
    icon: "/images/icons/SCI-FI Energy Sword.png",
    scale: [0.3, 0.3, 0.3], // Scale giảm xuống 0.3
    rotation: [0.1, 1.5, 0.2], // Góc xoay [X, Y, Z]
    position: [-0.95, 0.07, -0.07],
  },
  {
    id: "w_hammer",
    name: "Gravity Hammer",
    path: "/models/weapons/SCI-FI Hammer.glb",
    icon: "/images/icons/SCI-FI Hammer.png",
    scale: [0.3, 0.3, 0.3], // Giữ scale 0.3
    rotation: [0.5, 3, 0.2], // Góc xoay [X, Y, Z]
    position: [-0.25, -1.6, -1.7],
  },
  {
    id: "w_knife",
    name: "Tactical Knife",
    path: "/models/weapons/SCI-FI Knife.glb",
    icon: "/images/icons/SCI-FI Knife.png",
    scale: [0.5, 0.5, 0.5], // Scale tăng lên 0.5
    rotation: [-1.9, 1.6, 0.5], // Góc xoay [X, Y, Z]
    position: [0.7, -1.9, -0.35],
  },
  {
    id: "w_wand",
    name: "Magic Wand",
    path: "/models/weapons/SCI-FI Magic Wand.glb",
    icon: "/images/icons/SCI-FI Magic Wand.png",
    // --- CẬP NHẬT THEO ẢNH MỚI NHẤT ---
    scale: [0.5, 0.5, 0.5], // Scale giữ nguyên 0.5
    rotation: [0.5, 1.7, 0.2], // Góc xoay [X, Y, Z]
    position: [2.18, -1.84, -0.21], // Vị trí [X, Y, Z]
  },
  {
    id: "w_scythe",
    name: "Cyber Scythe",
    path: "/models/weapons/SCI-FI Scythe.glb",
    icon: "/images/icons/SCI-FI Scythe.png",
    // --- CẬP NHẬT THEO ẢNH MỚI NHẤT ---
    scale: [0.5, 0.5, 0.5], // Scale giữ nguyên 0.5
    rotation: [-2, 3, -0.15], // Góc xoay [X, Y, Z]
    position: [0.2, -0.7, 2.2], // Vị trí [X, Y, Z]
    // ----------------------------------
  },
  {
    id: "w_staff",
    name: "Tech Staff",
    path: "/models/weapons/SCI-FI Staff.glb",
    icon: "/images/icons/SCI-FI Staff.png",
    // --- CẬP NHẬT THEO ẢNH MỚI NHẤT ---
    scale: [0.5, 0.5, 0.5], // Scale 0.5
    rotation: [-0.05, 3, 0.3], // Góc xoay [X, Y, Z]
    position: [0, 0.5, 0.6], // Vị trí [X, Y, Z]
    // ----------------------------------
  },
  {
    id: "w_sword",
    name: "Carbon Sword",
    path: "/models/weapons/SCI-FI Sword.glb",
    icon: "/images/icons/SCI-FI Sword.png",
    // --- CẬP NHẬT THEO ẢNH MỚI NHẤT ---
    scale: [0.5, 0.5, 0.5], // Scale 0.5
    rotation: [0.4, 3, 0.2], // Góc xoay [X, Y, Z]
    position: [-0.1, -0.5, -1.2], // Vị trí [X, Y, Z]
    // ----------------------------------
  },
];
