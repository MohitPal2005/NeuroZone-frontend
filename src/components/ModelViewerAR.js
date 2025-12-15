// import React, { useRef, useEffect } from "react";
// import "@google/model-viewer";

// export default function ModelViewerAR({ src = "/models/clothes.glb", iosSrc = "/models/clothes.usdz", alt = "Clothes AR" }) {
//   const mvRef = useRef();

//   useEffect(() => {
//     const mv = mvRef.current;
//     if (!mv) return;
//     const onArStatus = (ev) => { console.log("AR status:", ev.detail.status); };
//     mv.addEventListener("ar-status", onArStatus);
//     return () => mv.removeEventListener("ar-status", onArStatus);
//   }, []);

//   return (
//     <model-viewer
//       ref={mvRef}
//       src={src}
//       ios-src={iosSrc}
//       alt={alt}
//       camera-controls
//       auto-rotate
//       environment-image="neutral"
//       shadow-intensity="0.5"
//       ar
//       ar-modes="webxr scene-viewer quick-look"
//       style={{ width: "100%", height: "400px" }}
//     >
//       <button slot="ar-button" style={{ background: "#0ea5a4", color: "white", padding: "10px 14px", borderRadius: "8px" }}>
//         Try in AR
//       </button>
//     </model-viewer>
//   );
// }
