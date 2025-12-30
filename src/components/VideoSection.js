import React from 'react';

// components/VideoSection.js
const VideoSection = ({ title, videoUrl, placeholderImage, onClick }) => (
  <div onClick={onClick} className="cursor-pointer">
    <video src={videoUrl} poster={placeholderImage} autoPlay loop muted playsInline />
    <h2>{title}</h2>
    <h2 className="mt-4 text-xl font-semibold text-center">
      River of Days
    </h2>
  </div>
);

export default VideoSection;