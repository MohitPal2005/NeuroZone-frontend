import React, { useEffect, useRef, useState } from "react";

export default function VoiceSearch({ onSearch }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice search not supported in this browser");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.continuous = false;

    recog.onresult = (event) => {
  const text = event.results[0][0].transcript;
  if (onSearch) onSearch(text.trim());
    };

    recog.onerror = (event) => {
      setError(event.error);
      setListening(false);
    };

    recog.onend = () => setListening(false);

    recognitionRef.current = recog;
  }, [onSearch]);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("");
      setError(null);
      setListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <input
        type="text"
        value={transcript}
        readOnly
        placeholder="Say a product name..."
        className="flex-1 border p-2 rounded-lg"
      />
      <button
        onClick={startListening}
        className={`px-4 py-2 rounded-lg text-white ${listening ? "bg-red-500" : "bg-teal-500"}`}
      >
        {listening ? "Listening..." : "🎤 Speak"}
      </button>
    </div>
  );
}
