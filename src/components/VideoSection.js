import React, { useEffect, useRef } from 'react';

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

  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.playbackRate = 0.25;
  }, []);

  return (
    <section className={`w-full ${className}`.trim()}>
      <div
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (!isClickable) return;
          if (e.key === 'Enter') onClick();
        }}
        className="group cursor-pointer rounded-2xl border-2 border-transparent bg-paper transition-colors focus:outline-none focus-visible:border-accent"
      >
        <div className="p-2">
          <div className="overflow-hidden rounded-xl border border-ink/15 bg-paper">
            <video
              ref={videoRef}
              src={videoUrl}
              poster={placeholderImage}
              preload="auto"
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              playsInline={playsInline}
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