"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type CubeFace = "top" | "left" | "right";

interface AnimatedCubeLogoProps {
  size?: number;
  className?: string;
  animateFaces?: CubeFace[];
}

/**
 * Animated cube logo component that renders a 3D cube with optional face animations on hover.
 * The cube faces use `currentColor` for fill, which inherits the current text color from CSS.
 * 
 * @param props - The props for the component.
 * @param props.size - The size of the cube in pixels. Defaults to 80.
 * @param props.className - Additional CSS classes to apply. Defaults to an empty string.
 * @param props.animateFaces - Array of cube faces to animate when expanded. Defaults to an empty array.
 * @returns The JSX element representing the animated cube logo.
 */
export function AnimatedCubeLogo({
  size = 80,
  className = "",
  animateFaces = [],
}: AnimatedCubeLogoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scale = Math.log(size + 1) / Math.log(81); // normalised so scale=1 at size=80
  const gap = 2.5 * scale;
  const expandDistance = 6 * scale;

  function getOffset(face: CubeFace) {
    const canAnimate = animateFaces.includes(face);
    const extra = isExpanded && canAnimate ? expandDistance : 0;

    switch (face) {
      case "left": return { x: -(gap + extra), y: (gap + extra) / 2 };
      case "right": return { x: gap + extra, y: (gap + extra) / 2 };
      case "top": return { x: 0, y: -(gap + extra) };
    }
  }

  const spring = { type: "spring", stiffness: 300, damping: 30 } as const;
  const left = getOffset("left");
  const right = getOffset("right");
  const top = getOffset("top");

  return (
    <div
      className={`relative overflow-visible ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onMouseDown={() => setIsExpanded(false)}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full overflow-visible"
      >
        {/* Left Face */}
        <motion.path
          d="M50 50 L50 90 L15 70 L15 30 Z"
          fill="currentColor"
          initial={false}
          animate={left}
          transition={spring}
        />

        {/* Right Face */}
        <motion.path
          d="M50 50 L85 30 L85 70 L50 90 Z"
          fill="currentColor"
          initial={false}
          animate={right}
          transition={spring}
        />

        {/* Top Face */}
        <motion.path
          d="M50 10 L85 30 L50 50 L15 30 Z"
          fill="currentColor"
          initial={false}
          animate={top}
          transition={spring}
        />
      </svg>
    </div >
  );
}
