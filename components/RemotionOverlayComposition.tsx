import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Video,
} from 'remotion';

export interface RemotionOverlayProps {
  videoUrl: string;
  title: string;
  subtitle: string;
  theme: 'cinematic' | 'cyberpunk' | 'minimal' | 'neon';
  position: 'lower-third' | 'center' | 'top-banner';
  showProgressBar?: boolean;
  showWatermark?: boolean;
}

export const RemotionOverlayComposition: React.FC<RemotionOverlayProps> = ({
  videoUrl,
  title,
  subtitle,
  theme = 'cinematic',
  position = 'lower-third',
  showProgressBar = true,
  showWatermark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance animation for title card
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 14,
      mass: 0.8,
      stiffness: 100,
    },
  });

  // Fade out towards the end of the first sequence if position is center
  const exitOpacity = position === 'center'
    ? interpolate(frame, [durationInFrames - 30, durationInFrames - 5], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  // Progress percentage
  const progressPercent = (frame / durationInFrames) * 100;

  // Theme palettes
  const themeStyles = {
    cinematic: {
      bg: 'linear-gradient(135deg, rgba(20, 15, 10, 0.85) 0%, rgba(35, 25, 15, 0.75) 100%)',
      border: '1px solid rgba(234, 179, 8, 0.35)',
      titleColor: '#fef08a',
      subtitleColor: '#e2e8f0',
      accent: '#eab308',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
    },
    cyberpunk: {
      bg: 'linear-gradient(135deg, rgba(10, 10, 30, 0.9) 0%, rgba(20, 5, 30, 0.85) 100%)',
      border: '1px solid rgba(6, 182, 212, 0.5)',
      titleColor: '#06b6d4',
      subtitleColor: '#f43f5e',
      accent: '#f43f5e',
      shadow: '0 0 25px rgba(6, 182, 212, 0.4)',
    },
    neon: {
      bg: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.85) 100%)',
      border: '1px solid rgba(168, 85, 247, 0.5)',
      titleColor: '#c084fc',
      subtitleColor: '#38bdf8',
      accent: '#a855f7',
      shadow: '0 0 20px rgba(168, 85, 247, 0.5)',
    },
    minimal: {
      bg: 'rgba(15, 23, 42, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      titleColor: '#ffffff',
      subtitleColor: '#94a3b8',
      accent: '#3b82f6',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    },
  }[theme];

  // Position coordinates
  const positionStyles: React.CSSProperties = {
    'lower-third': {
      bottom: '48px',
      left: '48px',
      maxWidth: '75%',
    },
    center: {
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%) scale(${entrance})`,
      textAlign: 'center',
      maxWidth: '85%',
    },
    'top-banner': {
      top: '40px',
      left: '48px',
      right: '48px',
      maxWidth: 'calc(100% - 96px)',
    },
  }[position];

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      {/* Background Video Layer */}
      {videoUrl ? (
        <Video
          src={videoUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      ) : (
        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontFamily: 'sans-serif',
          }}
        >
          No video loaded
        </AbsoluteFill>
      )}

      {/* Cinematic Letterbox Vignette Overlay */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Remotion Animated Graphic Overlay Card */}
      <Sequence from={0} durationInFrames={durationInFrames}>
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: themeStyles.bg,
            border: themeStyles.border,
            boxShadow: themeStyles.shadow,
            borderRadius: '16px',
            padding: '20px 28px',
            opacity: position === 'center' ? exitOpacity : entrance,
            transform: position !== 'center' ? `translateY(${(1 - entrance) * 25}px)` : positionStyles.transform,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'border-color 0.3s ease',
            ...positionStyles,
          }}
        >
          {title && (
            <h1
              style={{
                margin: 0,
                fontSize: position === 'center' ? '42px' : '28px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: themeStyles.titleColor,
                lineHeight: 1.2,
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              }}
            >
              {title}
            </h1>
          )}

          {subtitle && (
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: position === 'center' ? '20px' : '15px',
                fontWeight: 500,
                color: themeStyles.subtitleColor,
                lineHeight: 1.4,
                opacity: 0.9,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </Sequence>

      {/* Top Right Remotion Branding Badge */}
      {showWatermark && (
        <div
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '6px 14px',
            borderRadius: '20px',
            color: '#e2e8f0',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
            zIndex: 20,
          }}
        >
          <span style={{ color: themeStyles.accent }}>⚡</span>
          <span>Remotion Studio</span>
        </div>
      )}

      {/* Bottom Video Progress Bar */}
      {showProgressBar && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '5px',
            background: 'rgba(255, 255, 255, 0.15)',
            zIndex: 30,
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${themeStyles.titleColor}, ${themeStyles.accent})`,
              boxShadow: `0 0 10px ${themeStyles.accent}`,
              transition: 'width 0.05s linear',
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
