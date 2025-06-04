'use client';

import { useRef, useEffect, Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

// Star field component
const StarField = () => {
  const starsRef = useRef<THREE.Points>(null);
  const [rotation, setRotation] = useState(0);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y = rotation;
      starsRef.current.rotation.x = rotation * 0.5;
    }
  });

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setRotation(scrollPercent * Math.PI * 4);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Stars
      ref={starsRef}
      radius={150}
      depth={100}
      count={1000}
      factor={24}
      saturation={0}
      fade
      speed={1}
    />
  );
};

// 3D Logo component
const Logo3D = () => {
  const { scene } = useGLTF('/Arbiter Logo/Logo Mark/Purple_Rounded_letter.glb');
  const logoRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (logoRef.current) {
      // Center the logo and adjust position
      const box = new THREE.Box3().setFromObject(logoRef.current);
      const center = box.getCenter(new THREE.Vector3());
      logoRef.current.position.sub(center);
      logoRef.current.position.y -= 0.3; // Moved up from -0.4 to -0.3
    }
  }, []);

  useFrame((state) => {
    if (logoRef.current) {
      // Keep the subtle floating animation
      logoRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.015 - 0.3; // Adjusted base position to match
      // Apply rotation from scroll
      logoRef.current.rotation.y = rotation;
    }
  });

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setRotation(scrollPercent * Math.PI * 12);
      
      // Hide logo when scrolled down significantly
      if (scrollPercent > 0.3) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;
  return <primitive ref={logoRef} object={scene} scale={1} />;
};

// Main scene component
const Scene = () => {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / window.innerHeight;
      
      if (cameraRef.current) {
        // Camera position animation
        gsap.to(cameraRef.current.position, {
          z: 2 + scrollPercent * 48,
          duration: 0.5,
          ease: 'power2.out'
        });

        // Camera rotation animation
        gsap.to(cameraRef.current.rotation, {
          y: scrollPercent * Math.PI * 2,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 2]}
        fov={75}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8A2BE2" />
      <StarField />
      <Logo3D />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="fixed top-0 left-0 w-full h-screen bg-black flex items-center justify-center">
    <div className="text-white text-2xl">Loading 3D Scene...</div>
  </div>
);

// Main SpaceScene component
export default function SpaceScene() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingFallback />;
  }

  const DynamicCanvas = dynamic(
    () => import('@react-three/fiber').then((mod) => mod.Canvas),
    {
      ssr: false,
      loading: () => <LoadingFallback />,
    }
  );

  return (
    <div className="fixed top-0 left-0 w-full h-screen">
      <Suspense fallback={<LoadingFallback />}>
        <DynamicCanvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 2], fov: 75 }}
        >
          <Scene />
          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.1}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </DynamicCanvas>
      </Suspense>
    </div>
  );
} 