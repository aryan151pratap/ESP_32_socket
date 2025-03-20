import { useRef, useEffect, useState } from "react";
import { Maximize, X } from "lucide-react";

const WebcamComponent = () => {
  const videoRef = useRef(null);
  const popupVideoRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        console.log("Requesting webcam access...");
        const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(userStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
          console.log("Webcam started successfully!");
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isPopupOpen && popupVideoRef.current && stream) {
      popupVideoRef.current.srcObject = stream;
      console.log("Popup video stream assigned.");
    }
  }, [isPopupOpen, stream]);

  return (
    <div className="w-full h-full p-2">
      <div className="relative w-`full` h-full flex flex-wrap">
        <h2>Webcam Feed</h2>
        <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg shadow-md"></video>
        <button
          className="absolute right-2 top-2 w-10 h-10 bg-zinc-400/20 text-white rounded-full flex items-center justify-center hover:bg-zinc-600"
          onClick={() => setIsPopupOpen(true)}
        >
          <Maximize size={20} />
        </button>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative w-3/4 h-3/4 bg-white p-4 rounded-lg flex flex-col items-center">
            <button
              className="absolute top-2 right-2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700"
              onClick={() => setIsPopupOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-black mb-4">Webcam Popup</h2>
            <video ref={popupVideoRef} autoPlay playsInline className="w-full h-full rounded-lg"></video>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamComponent;
