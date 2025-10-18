import React, { useEffect, useRef } from 'react';

interface OrbProps {
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  hue?: number;
  forceHoverState?: boolean;
}

/**
 * Animated Orb Component
 * Simple pulsating orb for AI assistant visualization
 */
const Orb: React.FC<OrbProps> = ({
  hoverIntensity = 0.5,
  rotateOnHover = false,
  hue = 140,
  forceHoverState = false
}) => {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orbRef.current) return;

    const intensity = forceHoverState ? 1 : hoverIntensity;
    const scale = 0.9 + (intensity * 0.3);
    const blur = 20 + (intensity * 40);

    orbRef.current.style.transform = `scale(${scale}) ${rotateOnHover && forceHoverState ? 'rotate(180deg)' : ''}`;
    orbRef.current.style.filter = `blur(${blur}px)`;
  }, [hoverIntensity, rotateOnHover, forceHoverState]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        ref={orbRef}
        className="w-32 h-32 rounded-full transition-all duration-500"
        style={{
          background: `radial-gradient(circle, hsl(${hue}, 70%, 60%), hsl(${hue + 20}, 60%, 50%))`,
          boxShadow: `0 0 60px hsl(${hue}, 70%, 60%), 0 0 100px hsl(${hue + 20}, 60%, 50%)`,
        }}
      />
    </div>
  );
};

export default Orb;
