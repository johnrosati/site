import React, { useState } from 'react';
import VideoSection from './components/VideoSection';
import Modal from './components/Modal';
import FilmSynopsis from "./components/FilmSynopsis";
import ThreeScene from './components/ThreeScene';

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const closeModal = () => setModalOpen(false);
  
  const videos = [
    {
      title: "John Rosati presents",
      videoUrl: process.env.PUBLIC_URL + "/videos/video4.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    {
      title: "River of Days",
      videoUrl: process.env.PUBLIC_URL + "/videos/video44.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    {
      title: "Coming soon",
      videoUrl: process.env.PUBLIC_URL + "/videos/video1.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    {
      title: "River of Days",
      videoUrl: process.env.PUBLIC_URL + "/videos/video2.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    // other videos
  ];

  return (
    <main className="min-h-screen bg-paper text-ink font-sans">
      <div className="container mx-auto px-4 pt-16 sm:pt-24 pb-16 space-y-10">
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

        {/* --- Three.js preview --- */}
<div className="w-full h-[60vh] mt-24 rounded-lg overflow-hidden border border-black/10">
  <ThreeScene />
</div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <FilmSynopsis />
        </Modal>
      </div>
    </main>
  );
};

export default App;