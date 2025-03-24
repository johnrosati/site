import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';


// Single abstract shape (torus knot) that rotates
function TorusKnot({ position }) {
  const meshRef = useRef();

  // Assign a random rotation speed so they don't all move identically
  const speed = useMemo(() => 0.0005 + Math.random() * 0.005, []);

  // Rotate the shape each frame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusKnotGeometry args={[3.1, 3.3, 256, 32]} />
      <meshPhysicalMaterial
        color="blue"
        metalness={1.2}
        roughness={1.4}
        clearcoat={1.3}
        clearcoatRoughness={1.1}
      />
    </mesh>
  );
}

// Create an array of 30 random positions, then render a TorusKnot for each
function TorusKnotField() {
  const knots = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 130; i++) {
      temp.push({
        // Random positions spread within a roughly 25x25x25 cube
        position: [
          (Math.random() - 0.5) * 125,
          (Math.random() - 0.5) * 125,
          (Math.random() - 0.5) * 125,
        ],
      });
    }
    return temp;
  }, []);

  return (
    <>
      {knots.map((props, i) => (
        <TorusKnot key={i} {...props} />
      ))}
    </>
  );
}

export default function ThreeScene() {
  return (
    <div className="w-full h-[400px] md:h-[600px] lg:h-[800px]">
      <Canvas>
        <ambientLight intensity={1.95} />
        <pointLight position={[2, 10, 10]} />
        <TorusKnotField />
        <OrbitControls />
        <Stars />
      </Canvas>
    </div>
  );
}