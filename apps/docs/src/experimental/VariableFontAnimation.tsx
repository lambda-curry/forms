import React, { useEffect, useRef, useState } from 'react';

interface VariableFontAnimationProps {
  text?: string;
  fontSize?: number;
  maxInfluenceRadius?: number;
  animationSpeed?: number;
  distortionIntensity?: number;
  className?: string;
}

export const VariableFontAnimation: React.FC<VariableFontAnimationProps> = ({
  text = 'LAMBDA CURRY',
  fontSize = 80,
  maxInfluenceRadius = 120,
  animationSpeed = 0.1,
  distortionIntensity = 1,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load the Recursive variable font from Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Recursive:slnt,wght,CASL,CRSV,MONO@-15..0,300..1000,0..1,0..1,0..1&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    link.onload = () => setIsLoaded(true);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    const container = containerRef.current;
    const letters = container.querySelectorAll('.gooey-letter') as NodeListOf<HTMLSpanElement>;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      
      animationFrameId = requestAnimationFrame(() => {
        letters.forEach((letter) => {
          const rect = letter.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const distance = Math.sqrt(
            Math.pow(centerX - e.clientX, 2) + Math.pow(centerY - e.clientY, 2)
          );
          
          // Calculate intensity based on distance (inverse relationship)
          const normalizedDistance = Math.max(0, 1 - (distance / maxInfluenceRadius));
          const intensity = normalizedDistance * distortionIntensity;
          
          // Map intensity to font variation settings
          const weight = 300 + (intensity * 700); // 300-1000 weight range
          const slant = intensity * -15; // 0 to -15 slant
          const casual = intensity * 1; // 0 to 1 casual axis
          
          // Apply CSS transforms for additional gooey effect
          const scale = 1 + (intensity * 0.3); // Scale up to 1.3x
          const skewX = intensity * 10; // Skew for distortion
          const skewY = intensity * 5;
          
          // Update CSS custom properties
          letter.style.setProperty('--font-weight', weight.toString());
          letter.style.setProperty('--font-slant', slant.toString());
          letter.style.setProperty('--font-casual', casual.toString());
          letter.style.setProperty('--scale', scale.toString());
          letter.style.setProperty('--skew-x', `${skewX}deg`);
          letter.style.setProperty('--skew-y', `${skewY}deg`);
          letter.style.setProperty('--intensity', intensity.toString());
        });
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(animationFrameId);
      
      // Reset all letters to default state
      letters.forEach((letter) => {
        letter.style.setProperty('--font-weight', '400');
        letter.style.setProperty('--font-slant', '0');
        letter.style.setProperty('--font-casual', '0');
        letter.style.setProperty('--scale', '1');
        letter.style.setProperty('--skew-x', '0deg');
        letter.style.setProperty('--skew-y', '0deg');
        letter.style.setProperty('--intensity', '0');
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded, maxInfluenceRadius, distortionIntensity]);

  const letters = text.split('').map((char, index) => (
    <span
      key={index}
      className="gooey-letter"
      style={{
        '--font-weight': '400',
        '--font-slant': '0',
        '--font-casual': '0',
        '--scale': '1',
        '--skew-x': '0deg',
        '--skew-y': '0deg',
        '--intensity': '0',
      } as React.CSSProperties}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <div className={`variable-font-container ${className}`}>
      <style>{`
        .variable-font-container {
          font-family: 'Recursive', monospace;
          font-size: ${fontSize}px;
          font-weight: 400;
          line-height: 1.2;
          cursor: default;
          user-select: none;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          padding: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }

        .variable-font-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .gooey-letter {
          display: inline-block;
          font-variation-settings: 
            'wght' var(--font-weight, 400),
            'slnt' var(--font-slant, 0),
            'CASL' var(--font-casual, 0);
          
          transform: 
            scale(var(--scale, 1))
            skew(var(--skew-x, 0deg), var(--skew-y, 0deg));
          
          transition: 
            font-variation-settings ${animationSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform ${animationSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          
          transform-origin: center center;
          color: white;
          text-shadow: 
            0 0 20px rgba(255,255,255,var(--intensity, 0)),
            0 0 40px rgba(255,255,255,calc(var(--intensity, 0) * 0.5)),
            0 2px 4px rgba(0,0,0,0.3);
          
          filter: blur(calc(var(--intensity, 0) * 0.5px));
        }

        .gooey-letter:hover {
          z-index: 10;
          position: relative;
        }

        /* Loading state */
        .variable-font-container:not(.loaded) .gooey-letter {
          opacity: 0.7;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .variable-font-container {
            font-size: ${fontSize * 0.6}px;
            padding: 20px;
            min-height: 150px;
          }
        }
      `}</style>
      
      <div className={`gooey-text ${isLoaded ? 'loaded' : ''}`} ref={containerRef}>
        {letters}
      </div>
      
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.7)',
          fontFamily: 'system-ui'
        }}>
          Loading font...
        </div>
      )}
    </div>
  );
};

export default VariableFontAnimation;

