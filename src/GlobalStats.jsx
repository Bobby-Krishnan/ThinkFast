import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function GlobalStats() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "stats", "global"), (doc) => {
      setCount(doc.data()?.problemsSolved ?? 0);
    });
    return unsub;
  }, []);

  return (
    <p style={{ fontSize: "1rem", color: "#666", marginTop: "1rem" }}>
       {count?.toLocaleString() ?? "..."} problems solved globally
    </p>
  );
}

export default GlobalStats;
