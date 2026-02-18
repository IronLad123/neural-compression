import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./analysis.css";

export default function Analysis(){
  const nav = useNavigate();
  const [lines, setLines] = useState([]);

  const logs = [
    "Initializing reconstruction inspector...",
    "Loading latent tensor structure...",
    "Estimating spatial fidelity...",
    "Running perceptual similarity scan...",
    "Evaluating compression artefacts...",
    "Mapping reconstruction confidence...",
    "Analysis complete."
  ];

  useEffect(()=>{
    let i = 0;
    const t = setInterval(()=>{
      setLines(prev => [...prev, logs[i]]);
      i++;
      if(i >= logs.length) clearInterval(t);
    }, 700);
    return ()=>clearInterval(t);
  },[]);

  return (
    <div className="analysis-root">

      <h1>Scientific Analysis Panel</h1>

      <div className="analysis-terminal">
        {lines.map((l,i)=>(
          <div key={i} className="analysis-line">{"> "}{l}</div>
        ))}
      </div>

      <div className="analysis-actions">
        <button onClick={()=>nav("/console")}>Back to Console</button>
      </div>

    </div>
  );
}
