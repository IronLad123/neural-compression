import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./console.css";

export default function Console() {

  const [file, setFile] = useState(null);
  const [level, setLevel] = useState(8);
  const [stats, setStats] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("IDLE");
  const nav = useNavigate();

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const runStages = async () => {
    setStage("IMAGE ACQUIRED");
    await sleep(800);
    setStage("ENCODING");
    await sleep(900);
    setStage("COMPRESSING");
    await sleep(900);
    setStage("TRANSMITTING");
  };

  const sendImage = async () => {
    if (!file) return alert("Select image");

    setLoading(true);
    setStats(null);
    setImage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("level", level);

    try {

      runStages();

      const res = await axios.post("http://127.0.0.1:8000/compress", formData);

      setStage("RECONSTRUCTING");
      await sleep(1200);

      setStats(res.data);
      setImage(`http://127.0.0.1:8000/result/${res.data.result_image}`);

      setStage("COMPLETE");

    } catch {
      alert("Model not ready yet");
      setStage("LINK FAILURE");
    }

    setLoading(false);
  };

  return (
    <div className="console">

      <div className="left">

        <h2>Transmission Console</h2>

        <input type="file" onChange={(e)=>setFile(e.target.files[0])} />

        <select value={level} onChange={(e)=>setLevel(e.target.value)}>
          <option value={2}>Emergency</option>
          <option value={4}>Low</option>
          <option value={8}>Standard</option>
          <option value={16}>Scientific</option>
          <option value={32}>Archive</option>
        </select>

        <button onClick={sendImage}>Transmit</button>

        <div className="stage">
          <span>STATUS:</span> {stage}
        </div>

        {stats && (
          <div className="card">
            <p>Original: {stats.original_size} bytes</p>
            <p>Received: {stats.compressed_size} bytes</p>
            <p>Efficiency: {stats.ratio}</p>
            <button onClick={()=>nav("/analysis")}>Analyze</button>
            <button onClick={()=>nav("/results")}>View Mission Log</button>
          </div>
        )}
      </div>

      <div className="right">

        {loading && (
          <div className="signalBox">
            <div className="signalLine" />
            <h2>{stage}</h2>
          </div>
        )}

        {image && !loading && (
          <motion.img
            src={image}
            initial={{opacity:0, scale:0.9}}
            animate={{opacity:1, scale:1}}
            transition={{duration:0.7}}
            alt="result"
          />
        )}
      </div>

    </div>
  );
}
