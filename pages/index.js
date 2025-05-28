import React, { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";

export default function Home() {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [showMessage, setShowMessage] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);

  const backgroundAudioRef = useRef(null);
  const greetingAudioRef = useRef(null);

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    setConfettiActive(true);
  }, []);

  const fadeAudio = (audio, toVolume, duration = 1000) => {
    if (!audio) return;
    const stepTime = 50;
    const steps = duration / stepTime;
    const volumeStep = (toVolume - audio.volume) / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      if (currentStep >= steps) {
        audio.volume = toVolume;
        if (toVolume === 0) audio.pause();
        clearInterval(fadeInterval);
      } else {
        audio.volume = Math.min(Math.max(audio.volume + volumeStep, 0), 1);
        currentStep++;
      }
    }, stepTime);
  };

  const handleImageClick = (imageId) => {
    setShowMessage(imageId);
    fadeAudio(backgroundAudioRef.current, 0);

    const greetingAudio = new Audio(`/greeting${imageId}.mp3`);
    greetingAudio.volume = 1;
    greetingAudioRef.current = greetingAudio;
    greetingAudio.play();

    greetingAudio.onended = () => {
      setShowMessage(null);
      greetingAudioRef.current = null;

      backgroundAudioRef.current.currentTime = 0;
      backgroundAudioRef.current.play();
      fadeAudio(backgroundAudioRef.current, 1);
    };
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget && !greetingAudioRef.current) {
      if (backgroundAudioRef.current.paused) {
        backgroundAudioRef.current.play();
        fadeAudio(backgroundAudioRef.current, 1);
      }
    }
  };

  return (
    <div style={styles.container} onClick={handleBackgroundClick}>
      {confettiActive && (
        <Confetti width={windowDimensions.width} height={windowDimensions.height} />
      )}

      <style>{`
        @keyframes bouncePulse {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
        @keyframes glowPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>

      <audio ref={backgroundAudioRef} autoPlay loop volume={1}>
        <source src="/birthday.mp3" type="audio/mp3" />
      </audio>

      <h1 style={styles.title}>Happy Birthday, Audrey, Too Cute!</h1>

      <div style={styles.imagesWrapper}>
        <div style={styles.imageBlock}>
          <img
            src="/her-picture.jpg"
            alt="Too Cute"
            onClick={() => handleImageClick(1)}
            style={styles.image}
          />
          <p style={styles.caption}>Click for birthday message from Uncle Osas</p>
        </div>
        <div style={styles.imageBlock}>
          <img
            src="/her-picture-2.jpg"
            alt="Too Cute 2"
            onClick={() => handleImageClick(2)}
            style={styles.image}
          />
          <p style={styles.caption}>Click for birthday message from Grandpa</p>
        </div>
      </div>

      {showMessage && (
        <p style={styles.message}>
          {showMessage === 1
            ? "Surprise! You're growing more beautiful every day, and I'm so proud of you!"
            : "Surprise! You're amazing and keep shining brighter every day my grand child!"}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(to right, #ffe0f0, #f0f8ff)",
    height: "100vh",
    textAlign: "center",
    padding: "50px",
    fontFamily: "Comic Sans MS, cursive",
    userSelect: "none",
  },
  title: {
    fontSize: "3rem",
    color: "#ff69b4",
    animation: "bouncePulse 3s ease-in-out infinite",
  },
  imagesWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    marginTop: "20px",
  },
  imageBlock: {
    textAlign: "center",
  },
  image: {
    width: "300px",
    height: "400px",
    objectFit: "cover",
    borderRadius: "50%",
    boxShadow: "0 0 30px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "transform 0.5s",
    animation: "bouncePulse 3s ease-in-out infinite",
  },
  caption: {
    marginTop: "10px",
    fontSize: "1.2rem",
    color: "#ff69b4",
    fontWeight: "bold",
    animation: "glowPulse 2s infinite ease-in-out",
  },
  message: {
    fontSize: "1.5rem",
    marginTop: "20px",
    color: "#800080",
    transition: "opacity 1s ease-in-out",
  },
};
