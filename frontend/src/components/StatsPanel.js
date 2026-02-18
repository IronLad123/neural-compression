import React from "react";

export default function StatsPanel({ stats }) {
  if (!stats) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Transmission Stats</h3>
      <p>Original Size: {stats.original_size} bytes</p>
      <p>Received Size: {stats.compressed_size} bytes</p>
      <p>Efficiency Ratio: {stats.ratio}</p>
    </div>
  );
}
