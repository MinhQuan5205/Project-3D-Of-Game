import React from "react";

export default function GuideScreen({ onBack, onStart }) {
  return (
    <div className="guide-screen">
      <div className="guide-card">
        <h1 className="guide-title">Hướng dẫn người chơi</h1>

        <section className="guide-section">
          <h2>Mục tiêu</h2>
          <ul>
            <li>Tiêu diệt thiên thạch để ghi điểm và qua màn.</li>
            <li>Nhặt vật phẩm vàng để nhận điểm thưởng lớn.</li>
            <li>Màn 3: hạ gục Alien Overlord để chiến thắng.</li>
          </ul>
        </section>

        <section className="guide-section">
          <h2>Điều khiển</h2>
          <ul>
            <li>Desktop: rê chuột để di chuyển phi hành gia.</li>
            <li>Mobile: chạm và rê trên màn hình để di chuyển.</li>
            <li>Bắn: nhấn/chạm vào màn hình để bắn đạn.</li>
          </ul>
        </section>

        <section className="guide-section">
          <h2>Lưu ý</h2>
          <ul>
            <li>Tránh va chạm thiên thạch và đạn của boss.</li>
            <li>Mất hết tim sẽ thua màn chơi.</li>
            <li>Vào Armory trước khi chơi để chọn vũ khí.</li>
          </ul>
        </section>

        <section className="guide-section">
          <h2>
            Rảnh Rỗi Thì Hãy Chơi Game - Trong lúc Bị Delay Máy Bay Tới 1 giờ
            Sáng
          </h2>
          <ul>
            <li>Chúc Hương Có Trò Chơi Giết Thời Gian Vui Vẻ</li>
            <li>Trò Chơi Có Nhiều Lỗi Mong Hương Chấp Nhận Được :))))</li>
            <li>Xin FeedBack Nháaaaa !!!!</li>
          </ul>
        </section>

        <div className="guide-actions">
          <button className="guide-btn secondary" onClick={onBack}>
            QUAY LẠI
          </button>
          <button className="guide-btn" onClick={onStart}>
            VÀO ARMORY
          </button>
        </div>
      </div>
    </div>
  );
}
