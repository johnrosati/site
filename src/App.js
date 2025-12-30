import React, { useState } from 'react';
import VideoSection from './components/VideoSection';
import Modal from './components/Modal';
import Button from './components/Button';

const FilmSynopsis = () => (
  <div className="p-6 sm:p-8 text-center bg-paper text-ink">
    <VideoSection
      title="River of Days"
      videoUrl={process.env.PUBLIC_URL + "/videos/video3.mp4"}
      placeholderImage="https://via.placeholder.com/800x400"
      autoPlay
      loop
      muted
      playsInline
    />
    <p className="mt-6 text-sm sm:text-base leading-relaxed text-ink/90 max-w-prose mx-auto">
      “River of Days” is a contemplative short film that weaves together the stories of three generations in a small riverside town, capturing the fleeting beauty and poignant regrets of ordinary life.<br/><br/>
      The film opens with Kenji, an elderly man in his late 70s, who spends his days fishing. Each cast triggers memories of tenderness, regret, and dreams unfulfilled.<br/><br/>
      Parallel to Kenji’s story is Aya, a young woman in her late 20s, who has returned home, discovering that life's imperfections provide meaning.<br/><br/>
      Interspersed is Yuta, a boy of ten, whose summer days by the river with his dog, Momo, mark his first brush with mortality.<br/><br/>
      Their stories culminate in a poignant moment by the river, where past, present, and future converge.
    </p>
    <div className="mt-6">
      <Button
        href="https://twitter.com/riverofdays"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto mx-auto"
      >
        Follow River of Days on X
      </Button>
    </div>
  </div>
);

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
      title: "John Rosati presents",
      videoUrl: process.env.PUBLIC_URL + "/videos/video44.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    {
      title: "John Rosati presents",
      videoUrl: process.env.PUBLIC_URL + "/videos/video1.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    {
      title: "John Rosati presents",
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
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <FilmSynopsis />
        </Modal>
      </div>
    </main>
  );
};

export default App;