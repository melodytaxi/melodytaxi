import React, { useState } from "react";
import { FaPlay, FaForward, FaBackward, FaVolumeUp } from "react-icons/fa";

export const Footer = () => {
  const [volume, setVolume] = useState(50);
  const [duration, setDuration] = useState(0);

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <footer className="footer">
      <div className="player">
        <div className="music-name">Music Name</div>
        <div className="controls">
          <div className="buttons">
            <FaBackward className="back-forward" />
            <FaPlay className="play-stop" />
            <FaForward className="back-forward" />
          </div>
          <div className="duration">
            <span className="time">{formatTime(duration)}</span>
            <input type="range" min="0" max="295" className="duration-line" value={duration} onChange={handleDurationChange} />
            <span className="time">4:55</span>
          </div>
        </div>
        <div className="volume">
          <input type="range" min="1" max="100" value={volume} className="volume-line" onChange={handleVolumeChange} />
          <FaVolumeUp className="volume-icon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
