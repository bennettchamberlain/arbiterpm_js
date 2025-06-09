'use client';

import { useRef, useEffect, Suspense, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Stars, useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

// Create a circular texture for the stars
const createStarTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// Star field component
const StarField = () => {
  const starsRef = useRef<THREE.Points>(null);
  const [rotation, setRotation] = useState(0);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y = rotation;
      starsRef.current.rotation.x = rotation * 0.3;
    }
  });

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setRotation(scrollPercent * Math.PI * 1.5);
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

// Deep 3D Star Field component
const DeepStarField = () => {
  const starsRef = useRef<THREE.Points>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const starTexture = useMemo(() => createStarTexture(), []);

  // Create random star positions in 3D space
  const starPositions = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      // Create a more concentrated distribution
      const radius = Math.random() * 110;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      // Spread stars across a smaller z-range
      const z = (Math.random() - 0.5) * 600;

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = z;
    }
    return positions;
  }, []);

  // Create star sizes
  const starSizes = useMemo(() => {
    const sizes = new Float32Array(2000);
    for (let i = 0; i < sizes.length; i++) {
      sizes[i] = Math.random() * 0.5 + 0.1; // Smaller sizes between 0.1 and 0.6
    }
    return sizes;
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      // Rotate the star field based on scroll progress
      starsRef.current.rotation.y = scrollProgress * Math.PI * 2;
      starsRef.current.rotation.x = scrollProgress * Math.PI * 0.5;
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starPositions.length / 3}
          array={starPositions}
          itemSize={3}
          args={[starPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={starSizes.length}
          array={starSizes}
          itemSize={1}
          args={[starSizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        map={starTexture}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 3D Logo component
const Logo3D = () => {
  const { scene } = useGLTF('/Arbiter_Logo/Logo_Mark/Purple_Rounded_letter.glb');
  const logoRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);
  const [visible, setVisible] = useState(true);
  const { camera } = useThree();

  useEffect(() => {
    if (logoRef.current) {
      // Center the logo and adjust position
      const box = new THREE.Box3().setFromObject(logoRef.current);
      const center = box.getCenter(new THREE.Vector3());
      logoRef.current.position.sub(center);
      logoRef.current.position.y -= 0.3;
      // Start the logo closer to the camera
      logoRef.current.position.z = -1;
    }
  }, []);

  useFrame((state) => {
    if (logoRef.current) {
      // Keep the subtle floating animation
      logoRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.015 - 0.3;
      
      // Follow camera position with a delay factor
      const targetZ = -1 + (camera.position.z - 2) * 0.9; // Start at -1 and move at 90% of camera speed
      logoRef.current.position.z = THREE.MathUtils.lerp(
        logoRef.current.position.z,
        targetZ,
        0.00 // Smooth interpolation factor
      );
      
      // Apply rotation from scroll
      logoRef.current.rotation.y = rotation;
    }
  });

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setRotation(scrollPercent * Math.PI * 6);
      
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

// Milky Way Background component
const MilkyWayBackground = () => {
  const texture = useLoader(THREE.TextureLoader, '/textures/milkyway-2.png');
  const meshRef = useRef<THREE.Mesh>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(scrollPercent);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      // Much slower rotation: base rotation + up to 0.5*PI as you scroll (y-axis)
      meshRef.current.rotation.z = Math.PI + scrollProgress * Math.PI * -0.3;
    }
  }, [scrollProgress]);

  return (
    <mesh ref={meshRef} scale={[1000, 1000, 1000]} rotation={[2, 0.5, 0]}>
      <sphereGeometry args={[1, 256, 256]} />
      <meshBasicMaterial 
        map={texture} 
        side={THREE.BackSide} 
        color="#999"
        transparent={true}
        opacity={0.6}
      />
    </mesh>
  );
};

// Main scene component
const Scene = () => {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / window.innerHeight;
      
      if (cameraRef.current) {
        // Camera position animation with even slower movement
        gsap.to(cameraRef.current.position, {
          z: 2 + scrollPercent * 20, // Reduced from 300 to 200 for even slower movement
          duration: 0.5,
          ease: 'power2.out'
        });

        // Camera rotation animation
        gsap.to(cameraRef.current.rotation, {
          y: scrollPercent * Math.PI * 3,
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
      <MilkyWayBackground />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 2]}
        fov={75}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8A2BE2" />
      <StarField />
      <DeepStarField />
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