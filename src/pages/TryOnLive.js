import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceMesh from "@mediapipe/face_mesh";
import * as camUtils from "@mediapipe/camera_utils";

const TryOnLive = ({ glassesSrc = "/images/round_glasses.png" }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const glassesRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const runningRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0, w: 0, a: 0 });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = glassesSrc;

    img.onload = () => {
      glassesRef.current = img;
      tryStart();
    };

    return () => {
      if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();
      modelRef.current = null;
      runningRef.current = false;
    };

  }, [glassesSrc]);

  const tryStart = () => {
    if (runningRef.current) return;

    const videoEl = webcamRef.current && webcamRef.current.video;
    const imgLoaded = !!glassesRef.current;

    if (!videoEl || !imgLoaded) {
      setTimeout(tryStart, 200);
      return;
    }

    startCameraAndModel(videoEl);
  };

  const startCameraAndModel = (videoElement) => {
    if (runningRef.current) return;
    runningRef.current = true;

    const canvasElement = canvasRef.current;
    const ctx = canvasElement.getContext("2d");

    const faceMeshModel = new faceMesh.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    modelRef.current = faceMeshModel;

    faceMeshModel.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMeshModel.onResults((results) => {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      if (videoElement.readyState >= 2) {
        ctx.drawImage(
          videoElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
      }

      if (!results?.multiFaceLandmarks?.length) return;

      const landmarks = results.multiFaceLandmarks[0];
      const leftEye = landmarks[33];
      const rightEye = landmarks[263];

      const vw = canvasElement.width;
      const vh = canvasElement.height;

      const lx = leftEye.x * vw;
      const ly = leftEye.y * vh;
      const rx = rightEye.x * vw;
      const ry = rightEye.y * vh;

      const centerX = (lx + rx) / 2;
      const centerY = (ly + ry) / 2;

      const dx = rx - lx;
      const dy = ry - ly;
      const eyeDist = Math.hypot(dx, dy);

      const angle = Math.atan2(dy, dx);
      const scale = edgeSafe(eyeDist * 1.8, 0.1);

      const img = glassesRef.current;
      if (!img || img.width === 0) return;

      const glassesW = scale;
      const glassesH = (glassesW / img.width) * img.height;

      const last = lastRef.current;
      const lerp = (a, b, t) => a * (1 - t) + b * t;

      last.x = lerp(last.x, centerX, 0.4);
      last.y = lerp(last.y, centerY, 0.4);
      last.w = lerp(last.w, glassesW, 0.4);
      last.a = lerp(last.a, angle, 0.4);

      ctx.save();
      ctx.translate(last.x, last.y);
      ctx.rotate(last.a);
      ctx.drawImage(img, -last.w / 2, -glassesH / 2, last.w, glassesH);
      ctx.restore();
    });

    const camera = new camUtils.Camera(videoElement, {
      onFrame: async () => {
        if (modelRef.current) {
          await modelRef.current.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480,
    });

    cameraRef.current = camera;
    camera.start();
  };

  function edgeSafe(val, min) {
    return !isFinite(val) || val < min ? min : val;
  }

  return (
    <div className="tryon-wrapper">

      <h1 className="tryon-live-title">Live Smart Eyewear Try-On</h1>

      <div className="tryon-live-center">
        <div className="tryon-live-box">
          <Webcam
            audio={false}
            ref={webcamRef}
            width={640}
            height={480}
            videoConstraints={{ facingMode: "user" }}
            className="tryon-video"
          />

          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="tryon-canvas"
          />
        </div>
      </div>
    </div>
  );
};

export default TryOnLive;
