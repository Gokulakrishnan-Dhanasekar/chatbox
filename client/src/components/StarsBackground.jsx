import React from "react";

export default function StarsBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-950"
      />
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <span
            key={i}
            className="absolute bg-white rounded-full opacity-20 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
