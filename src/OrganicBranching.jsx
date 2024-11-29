import React, { useEffect, useRef } from "react";
import p5 from "p5";

const OrganicBranching = ({ settings = {} }) => {
  const sketchRef = useRef(null);

  useEffect(() => {
    const sketch = (p) => {
      // Move Branch class outside of other function definitions
      class Branch {
        constructor(x, y, angle, length, size, hue) {
          this.pos = p.createVector(x, y);
          this.vel = p5.Vector.fromAngle(angle);
          this.originalLength = length;
          this.length = length;
          this.size = size;
          this.hue = hue;
          this.growing = true;
          this.children = [];
          this.currentLength = 0;
        }

        // Rest of the Branch class methods remain the same,
        // but replace p.random with p.random and add p.
        grow() {
          if (!this.growing) return;
          this.currentLength += settings.growthSpeed || 1;
          if (this.currentLength >= this.length) {
            this.growing = false;
            this.createChildren();
          }
        }

        createChildren() {
          if (this.size < 2) return;
          let childCount = Math.floor(
            p.random(1, (settings.branchCount || 3) + 1)
          );
          let angleSpread = p.PI / 2;
          for (let i = 0; i < childCount; i++) {
            let angle =
              this.vel.heading() + p.random(-angleSpread / 2, angleSpread / 2);
            let newLength = this.length * p.random(0.6, 0.8);
            let newSize = this.size * 0.7;
            let newHue =
              (this.hue +
                p.random(-settings.hueRange / 2, settings.hueRange / 2) +
                360) %
              360;
            let endX = this.pos.x + this.vel.x * this.currentLength;
            let endY = this.pos.y + this.vel.y * this.currentLength;
            this.children.push(
              new Branch(endX, endY, angle, newLength, newSize, newHue)
            );
          }
        }

        draw() {
          if (this.currentLength <= 0) return;
          let endX = this.pos.x + this.vel.x * this.currentLength;
          let endY = this.pos.y + this.vel.y * this.currentLength;
          p.colorMode(p.HSB);
          p.stroke(this.hue, 80, 100);
          p.strokeWeight(this.size);
          p.line(this.pos.x, this.pos.y, endX, endY);
          for (let child of this.children) {
            child.grow();
            child.draw();
          }
        }
      }

      let branches = [];

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(sketchRef.current);
        p.background(0);
        p.colorMode(p.HSB);
      };

      p.mouseDragged = () => {
        let angle = p.random(p.TWO_PI);
        let branch = new Branch(
          p.mouseX,
          p.mouseY,
          angle,
          settings.branchLength || 100,
          settings.brushSize || 5,
          settings.baseHue || 0
        );
        branches.push(branch);
      };

      p.keyPressed = () => {
        if (p.key === "c") {
          branches = [];
          p.clear();
          p.background(0);
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.background(0);
      };

      p.draw = () => {
        p.background(0);
        for (let branch of branches) {
          branch.grow();
          branch.draw();
        }
      };
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, [settings]);

  return <div ref={sketchRef}></div>;
};

export default OrganicBranching;
