"use client";
import { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";

const Dashboard = () => {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  // Start video stream from the webcam
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.error("Error starting video stream:", err);
      });
  };

  // Load face-api.js models
  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]);
    faceMyDetect();
  };

  // Detect faces and draw them on the canvas
  const faceMyDetect = () => {
    setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        // Clear previous drawings
        const canvas = faceapi.createCanvasFromMedia(videoRef.current);
        faceapi.matchDimensions(canvas, {
          width: 940,
          height: 650,
        });

        const resizedDetections = faceapi.resizeResults(detections, {
          width: 940,
          height: 650,
        });

        // Clear the canvas before drawing
        canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      }
    }, 1000);
  };

  return (
    <>
      <div className="myapp">
        <div className="appvide">
          <video crossOrigin="anonymous" ref={videoRef} autoPlay muted width="940" height="650"></video>
          <canvas ref={canvasRef} width="940" height="650" className="appcanvas" />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
