import { useState } from "react";
import "./live.css";

function Live(){
  const [q,setQ]=useState(8);
  const cells = Array.from({length:64});

  return (
    <div className="live">
      <h1>Latent Space Activity</h1>

      <input
        type="range"
        min="2" max="32" step="2"
        value={q}
        onChange={e=>setQ(e.target.value)}
      />

      <div className="grid">
        {cells.map((_,i)=>(
          <div
            key={i}
            className="cell"
            style={{opacity:(Math.sin(i*q*0.3)+1)/2}}
          />
        ))}
      </div>

      <p>Quality level affects latent precision.</p>
    </div>
  );
}

export default Live;
