import React, { useEffect, useRef } from "react";
import p5 from "p5";

const OrganicBranching = ({ settings = {}, saveCanvas, clearCanvas }) => {
  const sketchRef = useRef(null); // Referenz für das Canvas
  const branchesRef = useRef([]); // Zeichnungen bleiben erhalten
  const settingsRef = useRef(settings); // Dynamische Referenz für Settings
  const p5InstanceRef = useRef(null); // Referenz zur p5-Instanz

  // Aktualisiere die Referenz der Einstellungen, wenn sie sich ändern
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const sketch = (p) => {
      let canvasInitialized = false; // Initialisierungsflag
      let canvasBounds; // Bounds der Canvas

      class Branch {
        constructor(x, y, angle, length, size, hue) {
          this.pos = p.createVector(x, y);
          this.vel = p5.Vector.fromAngle(angle);
          this.length = length;
          this.size = size;
          this.hue = hue;
          this.growing = true;
          this.children = [];
          this.currentLength = 0;
        }

        grow() {
          if (!this.growing) return;
          const currentSettings = settingsRef.current;
          this.currentLength += currentSettings.growthSpeed || 1;
          if (this.currentLength >= this.length) {
            this.growing = false;
            this.createChildren();
          }
        }

        createChildren() {
          const currentSettings = settingsRef.current;
          if (this.size < 2) return;
          const childCount = Math.floor(
            p.random(1, (currentSettings.branchCount || 3) + 1)
          );
          const angleSpread = p.PI / 2;
          for (let i = 0; i < childCount; i++) {
            const angle =
              this.vel.heading() + p.random(-angleSpread / 2, angleSpread / 2);
            const newLength = this.length * p.random(0.6, 0.8);
            const newSize = this.size * 0.7;
            const newHue =
              (this.hue +
                p.random(
                  -currentSettings.hueRange / 2,
                  currentSettings.hueRange / 2
                ) +
                360) %
              360;
            const endX = this.pos.x + this.vel.x * this.currentLength;
            const endY = this.pos.y + this.vel.y * this.currentLength;
            this.children.push(
              new Branch(endX, endY, angle, newLength, newSize, newHue)
            );
          }
        }

        draw() {
          if (this.currentLength <= 0) return;
          const endX = this.pos.x + this.vel.x * this.currentLength;
          const endY = this.pos.y + this.vel.y * this.currentLength;
          p.colorMode(p.HSB);
          p.stroke(this.hue, 80, 100);
          p.strokeWeight(this.size);
          p.line(this.pos.x, this.pos.y, endX, endY);
          for (const child of this.children) {
            child.grow();
            child.draw();
          }
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(sketchRef.current);
        p.background(0);
        p.colorMode(p.HSB);
        canvasInitialized = true;
        p5InstanceRef.current = p; // Speichere p5-Instanz
        canvasBounds = canvas.elt.getBoundingClientRect(); // Speichere Canvas-Bounds
      };

      p.mouseDragged = () => {
        if (!canvasInitialized) return;

        // Prüfe, ob die Maus innerhalb der Canvas liegt
        if (
          p.mouseX < 0 ||
          p.mouseX > canvasBounds.width ||
          p.mouseY < 0 ||
          p.mouseY > canvasBounds.height
        ) {
          return; // Abbrechen, wenn die Maus nicht über der Canvas ist
        }

        const currentSettings = settingsRef.current;
        const angle = p.random(p.TWO_PI);
        const branch = new Branch(
          p.mouseX,
          p.mouseY,
          angle,
          currentSettings.branchLength || 100,
          currentSettings.brushSize || 5,
          currentSettings.baseHue || 0
        );
        branchesRef.current.push(branch);
      };

      p.draw = () => {
        if (!canvasInitialized) return;
        p.background(0, 0.1); // Leichter Transparenzeffekt
        for (const branch of branchesRef.current) {
          branch.grow();
          branch.draw();
        }
      };

      p.windowResized = () => {
        if (!canvasInitialized) return;
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.background(0);
        for (const branch of branchesRef.current) {
          branch.draw();
        }
        canvasBounds = p5InstanceRef.current.canvas.getBoundingClientRect(); // Update Canvas-Bounds
      };
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
      p5InstanceRef.current = null; // Lösche p5-Instanz
    };
  }, []);

  // Clear Canvas
  useEffect(() => {
    if (clearCanvas && p5InstanceRef.current) {
      const p = p5InstanceRef.current;
      branchesRef.current = [];
      p.clear();
      p.background(0);
    }
  }, [clearCanvas]);

  // Save Canvas
  useEffect(() => {
    if (saveCanvas && p5InstanceRef.current) {
      p5InstanceRef.current.saveCanvas("artwork", "jpg");
    }
  }, [saveCanvas]);

  return <div ref={sketchRef}></div>;
};

export default OrganicBranching;
