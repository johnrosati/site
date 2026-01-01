import React, { useState, useEffect } from "react";
import Button from "./Button";

const FilmSynopsis = () => {
  const [isPosterOpen, setIsPosterOpen] = useState(false);

  useEffect(() => {
    if (!isPosterOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsPosterOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isPosterOpen]);

  const nameClass = "font-semibold tracking-wide text-ink sm:text-[1.03em] underline decoration-accent/60 underline-offset-2";

  return (
    <div className="bg-paper text-ink">
      <div className="p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-start">
          {/* Media */}
          <div className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5 bg-paper">
              <video
                src={process.env.PUBLIC_URL + "/videos/video9.mp4"}
                poster="https://via.placeholder.com/1200x675"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto block"
              />
            </div>
          </div>

          {/* Copy */}
          <div className="rounded-xl border border-ink/25 bg-paper overflow-hidden">
            <header className="bg-ink/5 px-5 sm:px-6 py-4">
              <h1 className="text-xl sm:text-xl font-semibold tracking-tight">
                River of Days [ 2026 ] USA
              </h1>
            </header>
            <div className="px-5 sm:px-6 pb-6">

              <div className="mt-5 space-y-5 text-sm sm:text-base leading-relaxed text-ink/90 max-w-prose">
                <p>
                  The film opens with <span className={nameClass}>Kenji</span>, an elderly man in his late 70s, who spends his
                  days fishing. Each cast triggers memories of tenderness, regret, and dreams
                  unfulfilled.
                </p>

                <p>
                  Parallel to <span className={nameClass}>Kenji</span>’s story is <span className={nameClass}>Aya</span>, a young woman in her late 20s, who has
                  returned home, discovering that life’s imperfections provide meaning.
                </p>

                <p>
                  Interspersed is <span className={nameClass}>Yuta</span>, a boy of ten, whose summer days by the river with his
                  dog, <span className={nameClass}>Momo</span>, mark his first brush with mortality.
                </p>

                <p>
                  Their stories culminate in a poignant moment by the river, where past,
                  present, and future converge.
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  href="https://twitter.com/riverofdays"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  Follow River of Days on X
                </Button>
              </div>
              <div className="mt-10 max-w-prose">
                <figure
                  role="button"
                  tabIndex={0}
                  aria-label="View poster full screen"
                  onClick={() => setIsPosterOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsPosterOpen(true);
                    }
                  }}
                  className="group cursor-zoom-in overflow-hidden rounded-xl ring-1 ring-black/5 bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <img
                    src={process.env.PUBLIC_URL + "/RODposter.jpg"}
                    alt="River of Days film poster"
                    className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </figure>
                {isPosterOpen && (
                  <div
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Poster preview"
                    onClick={() => setIsPosterOpen(false)}
                  >
                    <button
                      aria-label="Close poster"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPosterOpen(false);
                      }}
                      className="absolute top-6 right-6 text-white text-2xl leading-none hover:opacity-80"
                    >
                      ×
                    </button>
                    <img
                      src={process.env.PUBLIC_URL + "/RODposter.jpg"}
                      alt="River of Days film poster"
                      className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilmSynopsis;
