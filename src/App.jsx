import React, { useState } from "react";
import OrganicBranching from "./OrganicBranching.jsx";
import Controls from "./Controls.jsx";
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

  const [saveCanvas, setSaveCanvas] = useState(false);

  const handleDownload = () => {
    setSaveCanvas(true);
    setTimeout(() => setSaveCanvas(false), 0); // Reset the flag
  };

  return (
    <div>
      <Controls
        settings={settings}
        setSettings={setSettings}
        onDownload={handleDownload}
      />
      <OrganicBranching settings={settings} saveCanvas={saveCanvas} />
    </div>
  );
}

export default App;
