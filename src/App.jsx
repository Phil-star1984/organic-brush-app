// src/App.jsx

import React, { useState } from "react";
import OrganicBranching from "./OrganicBranching.jsx";
import Controls from "./Controls";
import "./App.css"; // Optional für zusätzliche Styles

function App() {
  const [settings, setSettings] = useState({
    brushSize: 10,
    growthSpeed: 2,
    branchLength: 100,
    branchCount: 3,
    hueRange: 60,
    baseHue: 180,
  });

  return (
    <div>
      <Controls settings={settings} setSettings={setSettings} />
      <OrganicBranching settings={settings} />
    </div>
  );
}

export default App;
