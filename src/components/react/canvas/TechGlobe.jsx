import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { earth } from "../../../assets"; // Asegúrate de que esta ruta sea correcta en tu proyecto

const EARTH_MASK_URL = earth.src;

const Particles = ({ count = 6000 }) => {
  const points = useRef();
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = EARTH_MASK_URL;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const tempPositions = [];
      const tempColors = [];
      
      const color1 = new THREE.Color("#915eff"); // Morado
      const color2 = new THREE.Color("#00cea8"); // Turquesa
      const tempColor = new THREE.Color();

      for (let i = 0; i < count; i++) {
        let isValid = false;
        let attempts = 0;

        while (!isValid && attempts < 50) {
          const phi = Math.acos(-1 + (2 * Math.random()));
          const theta = Math.sqrt(Math.PI * count) * phi + (Math.random() * 10);

          const u = (theta % (2 * Math.PI)) / (2 * Math.PI);
          const v = phi / Math.PI;

          const xIdx = Math.floor(u * canvas.width);
          const yIdx = Math.floor(v * canvas.height);
          
          const pixelIdx = (yIdx * canvas.width + xIdx) * 4;
          const brightness = data[pixelIdx];

          if (brightness > 90) { 
            isValid = true;

            const r = 1.25; 
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.cos(phi);
            const z = r * Math.sin(phi) * Math.sin(theta);

            tempPositions.push(x, y, z);

            const mixRatio = Math.random(); 
            tempColor.lerpColors(color1, color2, mixRatio);
            tempColors.push(tempColor.r, tempColor.g, tempColor.b);
          }
          attempts++;
        }
      }

      setGeoData({
        positions: new Float32Array(tempPositions),
        colors: new Float32Array(tempColors)
      });
    };
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
        points.current.rotation.y += delta * 0.08;
    }
  });

  if (!geoData) return null;

  return (
    <group rotation={[0, 0, Math.PI / 8]}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geoData.positions.length / 3}
            array={geoData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={geoData.colors.length / 3}
            array={geoData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          vertexColors={true}
          sizeAttenuation={true}
          transparent={true}
          alphaTest={0.5}
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

const TechGlobe = () => {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ preserveDrawingBuffer: true, alpha: true }}
    >
      <OrbitControls
        enableZoom={false}
        autoRotate={true}
        autoRotateSpeed={0.8}
        enablePan={false}
      />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={2} />
      <pointLight position={[-5, -3, -5]} intensity={1} color="#915eff" />

      {/* --- AQUÍ ESTÁ EL CAMBIO DE COLOR DEL OCÉANO --- */}
      <Sphere args={[1.22, 64, 64]}>
          <meshStandardMaterial 
            color="#0f4c81"  // <--- Azul Marino Tecnológico (Antes era #050816)
            roughness={0.1}  // <--- Bajé la rugosidad para que brille un poco más (parece agua)
            metalness={0.3}  // <--- Subí el metalness para reflejos tech
          />
      </Sphere>

      <Particles count={15000} />

      <Preload all />
    </Canvas>
  );
};

export default TechGlobe;