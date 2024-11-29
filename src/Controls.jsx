import React from "react";

const Controls = ({ settings, setSettings }) => {
  const handleChange = (key) => (e) => {
    setSettings((prev) => ({
      ...prev,
      [key]: parseFloat(e.target.value),
    }));
  };

  return (
    <div className="controls-wrapper">
      <label>
        Brush Size:
        <input
          type="range"
          min="1"
          max="30"
          value={settings.brushSize}
          onChange={handleChange("brushSize")}
        />
      </label>
      <label>
        Growth Speed:
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          value={settings.growthSpeed}
          onChange={handleChange("growthSpeed")}
        />
      </label>
      <label>
        Branch Length:
        <input
          type="range"
          min="50"
          max="200"
          value={settings.branchLength}
          onChange={handleChange("branchLength")}
        />
      </label>
      <label>
        Branch Count:
        <input
          type="range"
          min="1"
          max="5"
          value={settings.branchCount}
          onChange={handleChange("branchCount")}
        />
      </label>
      <label>
        Color Variation:
        <input
          type="range"
          min="0"
          max="360"
          value={settings.hueRange}
          onChange={handleChange("hueRange")}
        />
      </label>
      <label>
        Base Color:
        <input
          type="range"
          min="0"
          max="360"
          value={settings.baseHue}
          onChange={handleChange("baseHue")}
        />
      </label>
    </div>
  );
};

export default Controls;
