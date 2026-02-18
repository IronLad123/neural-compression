import React from "react";

export default function ResultView({ image }) {
  if (!image) return null;

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Ground Station Image</h3>
      <img src={image} alt="result" style={{ maxWidth: "70%" }} />
    </div>
  );
}
