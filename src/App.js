import React, { useState } from 'react';
import VideoSection from './components/VideoSection';
import Modal from './components/Modal';

const App = () => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  
  const videos = [
    {
      title: "River of Days",
      videoUrl: "/videos/video4.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    {
      title: "River of Days",
      videoUrl: "/videos/video1.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    {
      title: "River of Days",
      videoUrl: "/videos/video2.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    {
      title: "River of Days",
      videoUrl: "/videos/video3.mp4",
      placeholderImage: "https://via.placeholder.com/800x400",
    },
    // other videos
  ];

  return (
    <div className="container mx-auto px-4 pt-24">
      {videos.map((video, index) => (
        <VideoSection
          key={index}
          {...video}
          autoPlay
          loop
          muted
          playsInline
          onClick={() => setModalOpen(true)}
        />
      ))}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-4 text-center">
          <VideoSection
            title="River of Days"
            videoUrl="/videos/video3.mp4"
            placeholderImage="https://via.placeholder.com/800x400"
            autoPlay
            loop
            muted
            playsInline
          />
          <p className="text-sm leading-relaxed mt-4">
            “River of Days” is a contemplative short film that weaves together the stories of three generations in a small riverside town, capturing the fleeting beauty and poignant regrets of ordinary life.<br/><br/>
            The film opens with Kenji, an elderly man in his late 70s, who spends his days fishing. Each cast triggers memories of tenderness, regret, and dreams unfulfilled.<br/><br/>
            Parallel to Kenji’s story is Aya, a young woman in her late 20s, who has returned home, discovering that life's imperfections provide meaning.<br/><br/>
            Interspersed is Yuta, a boy of ten, whose summer days by the river with his dog, Momo, mark his first brush with mortality.<br/><br/>
            Their stories culminate in a poignant moment by the river, where past, present, and future converge.
          </p>
          <div className="mt-6">
          <a
  href="https://twitter.com/riverofdays"
  target="_blank"
  rel="noopener noreferrer"
  className="w-4/5 mx-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
>
  Follow River of Days on X
</a>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;