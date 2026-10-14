import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  // Exact mouse coordinates
  const mousePos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  // Current reticle position (smoothly lerped)
  const reticlePos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  // Magnetic attraction coordinates
  const magneticTarget = useRef<{ x: number; y: number; active: boolean }>({
    x: -100,
    y: -100,
    active: false,
  });

  // Active magnetic DOM element
  const magneticElementRef = useRef<HTMLElement | null>(null);

  const dotRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Instant inner dot placement - mathematically centered at (x, y)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Magnetic attraction check
      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest(
        'button, a, input, select, textarea, [role="button"], [role="link"], label, .cursor-pointer, [data-magnetic]'
      ) as HTMLElement | null;

      if (interactiveEl) {
        setIsHovering(true);
        const rect = interactiveEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Gravitational magnetic pull toward element center
        const pullFactor = 0.65; // Pulls strongly towards center
        const targetX = centerX + (e.clientX - centerX) * (1 - pullFactor);
        const targetY = centerY + (e.clientY - centerY) * (1 - pullFactor);

        magneticTarget.current = {
          x: targetX,
          y: targetY,
          active: true,
        };

        // Subtle tactile magnetic displacement on the interactive element
        const elemPullX = (e.clientX - centerX) * 0.12;
        const elemPullY = (e.clientY - centerY) * 0.12;
        interactiveEl.style.transform = `translate3d(${elemPullX}px, ${elemPullY}px, 0)`;
        interactiveEl.style.transition = 'transform 0.08s ease-out';
        magneticElementRef.current = interactiveEl;
      } else {
        setIsHovering(false);
        magneticTarget.current = { x: e.clientX, y: e.clientY, active: false };

        if (magneticElementRef.current) {
          magneticElementRef.current.style.transform = '';
          magneticElementRef.current.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
          magneticElementRef.current = null;
        }
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => {
      setIsVisible(false);
      if (magneticElementRef.current) {
        magneticElementRef.current.style.transform = '';
        magneticElementRef.current = null;
      }
    };
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth physics loop for single magnetic reticle (NO trail rings)
    let animationFrameId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      // Determine target: magnetic element center if active, else mouse position
      const targetX = magneticTarget.current.active ? magneticTarget.current.x : mousePos.current.x;
      const targetY = magneticTarget.current.active ? magneticTarget.current.y : mousePos.current.y;

      // Tight, responsive follow factor
      const factor = magneticTarget.current.active ? 0.32 : 0.25;
      reticlePos.current.x = lerp(reticlePos.current.x, targetX, factor);
      reticlePos.current.y = lerp(reticlePos.current.y, targetY, factor);

      // Apply transform with translate(-50%, -50%) ensuring EXACT center alignment
      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${reticlePos.current.x}px, ${reticlePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      if (magneticElementRef.current) {
        magneticElementRef.current.style.transform = '';
        magneticElementRef.current = null;
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  // If touch device or disabled by user, do not render
  if (isTouchDevice || !isEnabled) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 1. Inner precision center point (instantaneous, centered in the middle) */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none will-change-transform transition-all duration-150 ${
          isHovering
            ? 'w-2 h-2 bg-cyan-400 shadow-md shadow-cyan-400/80 scale-125'
            : isClicking
            ? 'w-1 h-1 bg-blue-700 scale-90'
            : 'w-1.5 h-1.5 bg-blue-600 shadow-sm shadow-blue-500/50'
        }`}
      />

      {/* 2. Single Magnetic Scientific Reticle (Centered in the middle, NO trails) */}
      <div
        ref={reticleRef}
        className={`fixed top-0 left-0 pointer-events-none will-change-transform transition-[width,height,border-color,background-color,box-shadow] duration-200 ease-out flex items-center justify-center rounded-full ${
          isClicking
            ? 'w-7 h-7 border-2 border-blue-600 bg-blue-500/20'
            : isHovering
            ? 'w-12 h-12 border-2 border-cyan-500 bg-cyan-500/15 shadow-lg shadow-cyan-500/20'
            : 'w-8 h-8 border border-blue-600/70 bg-transparent'
        }`}
      >
        {/* Precision Crosshair Tick Marks (Formal scientific styling) */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 transition-colors duration-150 ${
            isHovering ? 'w-0.5 h-1.5 bg-cyan-400' : 'w-0.5 h-1 bg-blue-500/60'
          }`}
        />
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 transition-colors duration-150 ${
            isHovering ? 'w-0.5 h-1.5 bg-cyan-400' : 'w-0.5 h-1 bg-blue-500/60'
          }`}
        />
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-150 ${
            isHovering ? 'h-0.5 w-1.5 bg-cyan-400' : 'h-0.5 w-1 bg-blue-500/60'
          }`}
        />
        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors duration-150 ${
            isHovering ? 'h-0.5 w-1.5 bg-cyan-400' : 'h-0.5 w-1 bg-blue-500/60'
          }`}
        />
      </div>
    </div>
  );
};
