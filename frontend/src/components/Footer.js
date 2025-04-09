import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#2a2f3a",
        color: "white",
        padding: "20px 0", 
        textAlign: "center",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center", 
          gap: "30px", 
          marginBottom: "10px",
        }}
      >
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} Website Bán Giày</p>
        <p style={{ margin: 0 }}>
          Được tạo bởi <span role="img" aria-label="love">❤️</span> nhóm DouCode
        </p>
      </div>
      <div style={{ marginTop: "10px", fontSize: "14px" }}>
        <p style={{ margin: 0 }}>Mọi quyền được bảo lưu.</p>
      </div>
    </footer>
  );
};

export default Footer;
