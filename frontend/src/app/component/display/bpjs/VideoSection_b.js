import React from "react";

const VideoSection = () => {
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "black" }}>
      <video
        src="/videos/BPJS.mp4"
        autoPlay
        loop
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};

export default VideoSection;
