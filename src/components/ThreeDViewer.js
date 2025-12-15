// import React, { Suspense, useRef } from "react";
// import { Canvas, useLoader } from "@react-three/fiber";
// import { OrbitControls, Environment, ContactShadows, Html, Float } from "@react-three/drei";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// function Model({ url }) {
//   const gltf = useLoader(GLTFLoader, url);
//   return <primitive object={gltf.scene} dispose={null} />;
// }

// export default function ThreeDViewer({ modelUrl = "/models/clothes.glb", height = 400 }) {
//   return (
//     <div style={{ width: "100%", height }}>
//       <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.4, 2.7], fov: 40 }}>
//         <ambientLight intensity={0.6} />
//         <directionalLight position={[5, 10, 5]} intensity={1} />
//         <Suspense fallback={<Html center>Loading 3D model…</Html>}>
//           <Float floatIntensity={0.6} rotationIntensity={0.1}>
//             <Model url={modelUrl} />
//           </Float>
//           <Environment preset="studio" />
//           <ContactShadows position={[0, -0.8, 0]} opacity={0.4} blur={2} far={2} />
//         </Suspense>
//         <OrbitControls enablePan={true} />
//       </Canvas>
//     </div>
//   );
// }
