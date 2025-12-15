import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as mpPose from "@mediapipe/pose";
import * as camUtils from "@mediapipe/camera_utils";

const TryOnClothes = ({ selectedShirt }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const shirtImg = useRef(new Image());
  const poseRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (selectedShirt) {
      shirtImg.current.src = selectedShirt;
    }
  }, [selectedShirt]);

  const initPose = () => {
    if (!webcamRef.current?.video) return;

    const video = webcamRef.current.video;

    const pose = new mpPose.Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);
    poseRef.current = pose;

    const camera = new camUtils.Camera(video, {
      onFrame: async () => {
        if (poseRef.current && video) {
          await poseRef.current.send({ image: video });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();
    cameraRef.current = camera;
  };

  function onResults(results) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks && shirtImg.current.complete) {
      const lm = results.poseLandmarks;

      const leftShoulderX = lm[11].x * canvas.width;
      const leftShoulderY = lm[11].y * canvas.height;
      const rightShoulderX = lm[12].x * canvas.width;
      const rightShoulderY = lm[12].y * canvas.height;
      const leftHipY = lm[23].y * canvas.height;
      const rightHipY = lm[24].y * canvas.height;

      const shoulderCenterX = (leftShoulderX + rightShoulderX) / 2;
      const shoulderCenterY = (leftShoulderY + rightShoulderY) / 2;
      const hipCenterY = (leftHipY + rightHipY) / 2;

      const shoulderDist = Math.abs(rightShoulderX - leftShoulderX);

      const shirtWidth = shoulderDist * 2.0;
      const shirtHeight = (hipCenterY - shoulderCenterY) * 1.3;

      const x = shoulderCenterX - shirtWidth / 2;
      const y = shoulderCenterY - shirtHeight * 0.15;

      ctx.drawImage(shirtImg.current, x, y, shirtWidth, shirtHeight);
    }
  }

  useEffect(() => {
  const camera = cameraRef.current;
  const video = webcamRef.current?.video;

  return () => {
    if (camera) camera.stop();
    if (video?.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
    }
  };
}, []);

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <Webcam
        ref={webcamRef}
        style={{ display: "none" }}
        videoConstraints={{ width: 640, height: 480 }}
        onUserMedia={initPose}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          border: "2px solid #000",
        }}
      />
    </div>
  );
};

export default TryOnClothes;
