import React from 'react';

interface SeeporaLogoProps {
  className?: string;
  size?: number | string;
}

export const SeeporaLogo: React.FC<SeeporaLogoProps> = ({ className = 'w-8 h-8', size }) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="SEEPORA Official Logo"
    >
      <defs>
        {/* Glow filter for center sensor node */}
        <filter id="sensorGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Gradient for sensor strip inner track */}
        <linearGradient id="sensorTrackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14808c" />
          <stop offset="45%" stopColor="#2dd4bf" />
          <stop offset="55%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>

        {/* Droplet Teal Fill Gradient for subtle dimension */}
        <linearGradient id="dropletTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#168b98" />
          <stop offset="100%" stopColor="#0d6c76" />
        </linearGradient>
      </defs>

      {/* 1. HORIZONTAL PIPE STRUCTURE (BEHIND DROPLET) */}
      {/* Lower fluid shading layer in pipe */}
      <rect x="36" y="94" width="168" height="20" fill="#E2E8F0" />

      {/* Upper and lower pipe contour lines */}
      <line x1="44" y1="70" x2="196" y2="70" stroke="#0F2027" strokeWidth="7" strokeLinecap="round" />
      <line x1="44" y1="120" x2="196" y2="120" stroke="#0F2027" strokeWidth="7" strokeLinecap="round" />

      {/* Left Pipe Flange Bracket [ */}
      <path
        d="M 44 64 L 32 64 L 32 126 L 44 126"
        stroke="#0F2027"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Flange inner lips */}
      <line x1="44" y1="64" x2="44" y2="72" stroke="#0F2027" strokeWidth="6" strokeLinecap="round" />
      <line x1="44" y1="118" x2="44" y2="126" stroke="#0F2027" strokeWidth="6" strokeLinecap="round" />

      {/* Right Pipe Flange Bracket ] */}
      <path
        d="M 196 64 L 208 64 L 208 126 L 196 126"
        stroke="#0F2027"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Flange inner lips */}
      <line x1="196" y1="64" x2="196" y2="72" stroke="#0F2027" strokeWidth="6" strokeLinecap="round" />
      <line x1="196" y1="118" x2="196" y2="126" stroke="#0F2027" strokeWidth="6" strokeLinecap="round" />

      {/* 2. DROPLET TOP FACET (ABOVE SENSOR BAR) */}
      {/* Left triangular facet (Teal) */}
      <path
        d="M 120 22 L 88 92 L 120 92 Z"
        fill="url(#dropletTeal)"
      />
      {/* Right triangular facet (White) */}
      <path
        d="M 120 22 L 120 92 L 152 92 Z"
        fill="#FFFFFF"
      />
      {/* Top outer triangular perimeter outline */}
      <path
        d="M 88 94 L 120 20 L 152 94"
        stroke="#0F2027"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center vertical facet divider */}
      <line x1="120" y1="20" x2="120" y2="92" stroke="#0F2027" strokeWidth="4" />

      {/* 3. DROPLET LOWER BULB (BELOW SENSOR BAR) */}
      {/* Lower droplet bulb body */}
      <path
        d="M 76 96 C 76 138 95 166 120 166 C 145 166 164 138 164 96 Z"
        fill="url(#dropletTeal)"
        stroke="#0F2027"
        strokeWidth="7.5"
        strokeLinejoin="round"
      />

      {/* Specular curved crescent highlight on bottom-left */}
      <path
        d="M 89 122 C 87 136 96 149 110 152"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Upper-right inner curved white highlight/notch */}
      <path
        d="M 120 108 C 138 108 152 115 158 122 C 158 110 148 104 135 104 Z"
        fill="#FFFFFF"
      />

      {/* 4. HORIZONTAL SENSOR STRIP / DETECTION PROBE (ACROSS CENTER) */}
      {/* Outer dark casing box */}
      <rect
        x="64"
        y="85"
        width="112"
        height="20"
        rx="2"
        fill="#0F2027"
        stroke="#0F2027"
        strokeWidth="2"
      />

      {/* Inner glowing sensor strip bar */}
      <rect
        x="68"
        y="89"
        width="104"
        height="12"
        rx="1"
        fill="url(#sensorTrackGrad)"
      />

      {/* Cyan/Mint fine guide wire through track */}
      <line
        x1="70"
        y1="95"
        x2="170"
        y2="95"
        stroke="#E0F2FE"
        strokeWidth="1.2"
        opacity="0.8"
      />

      {/* CENTER GLOWING SENSOR NODE */}
      {/* Outer soft ambient glow */}
      <circle
        cx="120"
        cy="95"
        r="11"
        fill="#38BDF8"
        opacity="0.45"
        filter="url(#sensorGlow)"
      />
      {/* Mid glow ring */}
      <circle
        cx="120"
        cy="95"
        r="7"
        fill="#67E8F9"
        opacity="0.85"
      />
      {/* Bright core sensor contact */}
      <circle
        cx="120"
        cy="95"
        r="4"
        fill="#FFFFFF"
      />
    </svg>
  );
};
