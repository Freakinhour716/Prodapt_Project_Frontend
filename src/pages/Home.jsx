import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <h1 className="title">License Tracker</h1>
      <p className="subtitle">
        Keep your <span className="highlight">Assets</span> Secure. Manage{" "}
        <span className="highlight">Licenses</span> with Precision.
      </p>

      <div className="gif-grid single">
        <div
          className="gif-item"
          style={{
            backgroundImage:
              "url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExajl3dGc3NG5qdDkyMjI0M2pvdjdnNmU5NnViaTA4cTVzYjB1cXV4aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohhwJlKHGchQUtvBS/giphy.gif')",
          }}
        ></div>
      </div>
    </div>
  );
}
