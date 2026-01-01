import React, { useState, useCallback, useMemo } from 'react';
import VideoSection from './components/VideoSection';
import Modal from './components/Modal';
import FilmSynopsis from './components/FilmSynopsis';

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const closeModal = useCallback(() => setModalOpen(false), []);
  const openModal = useCallback(() => setModalOpen(true), []);

  // These are the stacked videos below (add more here over time)
  const videos = useMemo(
    () => [
      {
        title: 'River of Days',
        videoUrl: process.env.PUBLIC_URL + '/videos/video12.mp4',
      },
      {
        title: 'Shop',
        videoUrl: process.env.PUBLIC_URL + '/videos/Video11.mp4',
      },
      // other videos
    ],
    []
  );

  return (
    <main id="top" className="min-h-screen bg-paper text-ink font-sans">
      <div className="sticky top-0 z-50 w-full border-b border-ink/15 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-2 gap-2">
          <span className="text-xs sm:text-xs tracking-wide text-ink/30 hover:text-ink">
            Welcome to Johnrosati.com currently home to "River of Days" <br></br><br></br>info@johnrosati.com
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-10 sm:pt-14 pb-16 space-y-10">
        {/* Stacked videos (add as many as you want; no duplicates with the carousel) */}
        {videos.map((video) => (
          <VideoSection
            key={video.videoUrl}
            {...video}
            autoPlay
            loop
            muted
            playsInline
            onClick={openModal}
          />
        ))}

        {/* --- Static image preview --- */}
        <div className="w-full mt-24 max-w-6xl mx-auto rounded-2xl overflow-hidden">
          <div
            className="group relative cursor-pointer rounded-2xl border-2 border-transparent bg-paper p-2 sm:p-3 transition-colors focus:outline-none focus-visible:border-accent"
            role="button"
            tabIndex={0}
            aria-label="Cafe scene still"
            onClick={openModal}
            onKeyDown={(e) => {
              if (e.key === 'Enter') openModal();
            }}
          >
            <img
              src={process.env.PUBLIC_URL + '/cafepic.png'}
              alt="Cafe scene still"
              className="w-full h-auto block rounded-xl"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-2 sm:inset-3 flex items-center justify-center rounded-xl bg-black/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="text-white text-xl sm:text-2xl font-semibold tracking-wide">Join the Team</span>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <FilmSynopsis />
        </Modal>
      </div>
    </main>
  );
};

export default App;