import React, { useEffect, useRef, useState } from 'react';

const VideoSection = ({
  title,
  videoUrl,
  placeholderImage,
  onClick,
  className = '',
  loop = true,
  onEnded,
  autoPlay,
  muted,
  playsInline,
}) => {
  const isClickable = typeof onClick === 'function';
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // iOS Safari autoplay policies: must be muted and inline.
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', '');

    // Your artistic choice (slow motion). Keep this, but set after element exists.
    el.playbackRate = 0.25;

    // Try to start playback; if blocked, show a tap-to-play overlay.
    const tryPlay = () => {
      const p = el.play();
      if (p && typeof p.then === 'function') {
        p.then(() => setNeedsTapToPlay(false)).catch(() => setNeedsTapToPlay(true));
      }
    };

    // Give Safari a moment to settle layout/media before play().
    const t = window.setTimeout(tryPlay, 50);

    return () => window.clearTimeout(t);
  }, [videoUrl]);

  return (
    <section className={`w-full ${className}`.trim()}>
      <div
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={(e) => {
          if (needsTapToPlay) {
            e.preventDefault();
            videoRef.current?.play().then?.(() => setNeedsTapToPlay(false)).catch?.(() => {});
            return;
          }
          onClick?.(e);
        }}
        onKeyDown={(e) => {
          if (!isClickable) return;
          if (e.key === 'Enter') {
            if (needsTapToPlay) {
              e.preventDefault();
              videoRef.current?.play().then?.(() => setNeedsTapToPlay(false)).catch?.(() => {});
              return;
            }
            onClick();
          }
        }}
        className="group cursor-pointer rounded-2xl border-2 border-transparent bg-paper transition-colors focus:outline-none focus-visible:border-accent"
      >
        <div className="p-2">
          <div className="relative overflow-hidden rounded-xl border border-ink/15 bg-paper">
            {needsTapToPlay && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="rounded-full border border-white/30 bg-black/60 px-4 py-2 text-sm tracking-wide text-white">
                  Tap to play
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              src={videoUrl}
              poster={placeholderImage}
              preload="auto"
              autoPlay={autoPlay}
              loop={loop}
              muted
              playsInline
              onEnded={onEnded}
              className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.01]"
            />
          </div>
        </div>

        <div className="px-4 pb-3 pt-2 flex items-end justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-wide text-ink group-hover:text-accent transition-colors">
            {title}
          </h2>
          <span className="text-sm sm:text-base tracking-wide text-ink/70 group-hover:text-accent group-hover:opacity-100 transition-colors transition-opacity">
            View details →
          </span>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;