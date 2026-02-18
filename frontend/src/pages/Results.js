import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./results.css";

export default function Results() {
  const [data, setData] = useState({});
  const [removing, setRemoving] = useState(null);
  const nav = useNavigate();

  const loadHistory = async () => {
    const res = await axios.get("http://127.0.0.1:8000/history");
    setData(res.data);
  };

  const deleteItem = async (id) => {
    setRemoving(id);
    setTimeout(async ()=>{
      await axios.delete(`http://127.0.0.1:8000/result/${id}`);
      loadHistory();
      setRemoving(null);
    }, 450);
  };

  const qualityLabel = (ratio)=>{
    if(ratio > 10) return "HIGH BANDWIDTH";
    if(ratio > 5) return "STABLE LINK";
    if(ratio > 2) return "LIMITED LINK";
    return "WEAK SIGNAL";
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="results">
      <h1>Mission Log</h1>

      <button className="back" onClick={()=>nav("/console")}>Back to Console</button>

      <div className="grid">
        {Object.entries(data).map(([id, item]) => (
          <div className={`card ${removing===id ? "purge" : ""}`} key={id}>

            <div className="thumb">
              <img
                src={`http://127.0.0.1:8000/result/${id}`}
                alt="result"
              />
              <span className="badge">{qualityLabel(item.ratio)}</span>
            </div>

            <div className="meta">
              <p>ID: {id}</p>
              <p>Size: {item.compressed_size} bytes</p>
              <p>Ratio: {item.ratio}</p>
            </div>

            <div className="actions">
              <button onClick={()=>window.open(`http://127.0.0.1:8000/result/${id}`)}>
                Open
              </button>
              <button onClick={()=>deleteItem(id)}>
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
