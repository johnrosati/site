import React, { useState, useEffect } from 'react';
import VideoSection from './components/VideoSection';
import Modal from './components/Modal';
import FilmSynopsis from "./components/FilmSynopsis";

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const targetDate = new Date('2026-07-04T00:00:00-04:00');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setCountdown({ days, hours, minutes, seconds, isOver: false });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad2 = (n) => String(n).padStart(2, '0');
  
  const closeModal = () => setModalOpen(false);
  
  const videos = [
    {
      title: "River of Days",
      videoUrl: process.env.PUBLIC_URL + "/videos/video4.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    {
      title: "Meet the characters",
      videoUrl: process.env.PUBLIC_URL + "/videos/video10.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    {
      title: "Shop",
      videoUrl: process.env.PUBLIC_URL + "/videos/video11.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    // other videos
  ];

  return (
    <main id="top" className="min-h-screen bg-paper text-ink font-sans">
      <div className="sticky top-0 z-50 w-full border-b border-ink/15 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          <a href="#top" className="text-xs sm:text-sm tracking-wide text-ink/80 hover:text-ink">
            Welcome to Johnrosati.com currently home to "River of Days" - please like share and subscribe
          </a>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-ink/10 bg-[#B64545]/15 px-2 py-0.5 text-[11px] tracking-wide text-[#B64545]">
              {countdown.isOver
                ? 'Ends today'
                : `${countdown.days}d ${pad2(countdown.hours)}:${pad2(countdown.minutes)}:${pad2(countdown.seconds)}`}
            </span>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 pt-10 sm:pt-14 pb-16 space-y-10">
        {videos.map((video) => (
          <VideoSection
            key={video.videoUrl}
            {...video}
            autoPlay
            loop
            muted
            playsInline
            onClick={() => setModalOpen(true)}
          />
        ))}

        {/* --- Static image preview --- */}
        <div className="w-full mt-24 rounded-lg overflow-hidden border border-black/10">
          <div className="group relative">
            <img
              src={process.env.PUBLIC_URL + "/cafepic.png"}
              alt="Cafe scene still"
              className="w-full h-auto block"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="text-white text-xl sm:text-2xl font-semibold tracking-wide">
                Join the Team
              </span>
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