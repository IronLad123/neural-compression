import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./home.css";

export default function Home() {
  const nav = useNavigate();
  const [bootText, setBootText] = useState("");
  const [ready, setReady] = useState(false);

  const message =
    "LRN-07 READY • DEEP SPACE LINK STANDBY • AWAITING OPERATOR COMMAND";

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setBootText(message.slice(0, i));
      i++;
      if (i > message.length) {
        clearInterval(t);
        setReady(true);
      }
    }, 28);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space">

      <motion.div
        className="moon"
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
      />

      <motion.div
        className="rover"
        animate={{ x: [-250, 250] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="stars" />

      <div className="center">
        <h1>Lunar Imaging System</h1>

        <div className="bootlog">
          <span>{bootText}</span>
          <span className="caret" />
        </div>

        <motion.button
          onClick={()=>nav("/console")}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0.3 }}
          transition={{ duration: 0.6 }}
          className={ready ? "active" : "disabled"}
        >
          Enter Control Center
        </motion.button>
      </div>

    </div>
  );
}
