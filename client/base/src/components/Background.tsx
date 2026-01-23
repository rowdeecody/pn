import React from "react";

export const Background: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-bg">
      {/* optional overlay for parallax/motion layers can be added here */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
};

export default Background;

