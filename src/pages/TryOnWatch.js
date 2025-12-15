import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as mpHands from "@mediapipe/hands";
import * as camUtils from "@mediapipe/camera_utils";

const TryOnWatch = ({ selectedWatch }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const watchImg = useRef(new Image());
  const handsRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (selectedWatch) {
      watchImg.current.src = selectedWatch;
    }
  }, [selectedWatch]);

  const initHands = () => {
    if (!webcamRef.current?.video) return;
    const video = webcamRef.current.video;

    const hands = new mpHands.Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);
    handsRef.current = hands;

    const camera = new camUtils.Camera(video, {
      onFrame: async () => {
        if (handsRef.current && video) {
          await handsRef.current.send({ image: video });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();
    cameraRef.current = camera;
  };

  const onResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks?.length && watchImg.current.complete) {
      const lm = results.multiHandLandmarks[0];

      const wrist = lm[0]; 
      const indexBase = lm[5]; 
      const pinkyBase = lm[17]; 

      const x = wrist.x * canvas.width;
      const y = wrist.y * canvas.height;

      const wristWidth = Math.hypot(
        (indexBase.x - pinkyBase.x) * canvas.width,
        (indexBase.y - pinkyBase.y) * canvas.height
      );

      const watchWidth = wristWidth * 1.5;
      const watchHeight =
        (watchWidth / watchImg.current.width) * watchImg.current.height;

      const angle = Math.atan2(
        pinkyBase.y - indexBase.y,
        pinkyBase.x - indexBase.x
      );

      ctx.save();
      ctx.translate(x, y); 
      ctx.rotate(angle); 
      ctx.drawImage(
        watchImg.current,
        -watchWidth / 2,
        -watchHeight / 2,
        watchWidth,
        watchHeight
      );
      ctx.restore();
    }
  };

  useEffect(() => {
    return () => {
      if (cameraRef.current) cameraRef.current.stop();
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <Webcam
        ref={webcamRef}
        style={{ display: "none" }}
        videoConstraints={{ width: 640, height: 480 }}
        onUserMedia={initHands}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ position: "absolute", top: 0, left: 0, border: "2px solid #000" }}
      />
    </div>
  );
};

export default TryOnWatch;
