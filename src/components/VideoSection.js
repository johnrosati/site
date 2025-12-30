import React from 'react';

// components/VideoSection.js
const VideoSection = ({
  title,
  videoUrl,
  placeholderImage,
  onClick,
  className = '',
}) => {
  const isClickable = typeof onClick === 'function';

  const handleKeyDown = (e) => {
    if (!isClickable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <section
      className={`group ${isClickable ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-paper rounded-lg' : ''} ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `Open details for ${title}` : undefined}
    >
      <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-black/5 bg-paper">
        <video
          src={videoUrl}
          poster={placeholderImage}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block"
        />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-ink group-hover:text-accent transition-colors">
          {title}
        </h2>
        {isClickable ? (
          <span className="text-sm font-medium text-ink/60 group-hover:text-accent transition-colors">
            View details →
          </span>
        ) : null}
      </div>
    </section>
  );
};

export default VideoSection;