import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// --- Helpers ---
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

// Cinematic camera drift + subtle mouse parallax
function DriftCamera() {
  const { camera, pointer } = useThree();
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;

    // Slow, almost imperceptible drift (cinema vibe)
    const baseX = Math.sin(t.current * 0.06) * 0.25;
    const baseY = 1.55 + Math.sin(t.current * 0.05) * 0.06;
    const baseZ = 7.4 + Math.cos(t.current * 0.04) * 0.15;

    // pointer is normalized [-1..1]
    const px = clamp(pointer.x, -1, 1);
    const py = clamp(pointer.y, -1, 1);

    // subtle parallax; keep it restrained
    const targetX = baseX + px * 0.35;
    const targetY = baseY + py * 0.18;
    const targetZ = baseZ;

    // lerp to keep movement smooth
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);

    camera.lookAt(0, 1.05, 0);
  });

  return null;
}

// A soft "river" band: a ribbon plane with gentle sine displacement in the vertex shader
const RiverShader = {
  uniforms: {
    uTime: { value: 0 },
    uA: { value: new THREE.Color('#1f2a2b') }, // deep water
    uB: { value: new THREE.Color('#38433f') }, // shallow water
    uSheen: { value: new THREE.Color('#c9d0c7') },
  },
  vertexShader: /* glsl */ `
    uniform float uTime;

    varying vec2 vUv;
    varying float vW;

    void main() {
      vUv = uv;

      vec3 p = position;

      float t = uTime * 0.25;
      float w1 = sin((p.x * 1.1) + t);
      float w2 = sin((p.x * 0.55) - t * 0.8);
      float w3 = sin((p.x * 0.22) + t * 0.6);
      float wave = (w1 + 0.6*w2 + 0.35*w3);

      // More movement near the middle of the band, less at edges
      float band = smoothstep(0.0, 0.35, vUv.y) * (1.0 - smoothstep(0.65, 1.0, vUv.y));
      p.y += wave * 0.06 * band;

      vW = wave;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uA;
    uniform vec3 uB;
    uniform vec3 uSheen;

    varying vec2 vUv;
    varying float vW;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      // Depth across the band
      float g = smoothstep(0.05, 0.95, vUv.y);
      vec3 col = mix(uA, uB, g);

      // Soft moving shimmer (very restrained)
      float t = uTime * 0.03;
      float n = noise(vUv * vec2(10.0, 2.0) + vec2(t, -t));
      float shimmer = smoothstep(0.72, 0.92, n) * 0.10;

      // Tiny highlight based on wave sign + center bias
      float center = smoothstep(0.15, 0.50, vUv.y) * (1.0 - smoothstep(0.50, 0.85, vUv.y));
      float crest = smoothstep(0.35, 0.95, vW) * 0.12;

      col += uSheen * (shimmer + crest) * center;

      // Fade edges into fog/background
      float edge = smoothstep(0.0, 0.10, vUv.y) * (1.0 - smoothstep(0.90, 1.0, vUv.y));
      col *= edge;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

function RiverBand() {
  const mat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(RiverShader.uniforms),
      vertexShader: RiverShader.vertexShader,
      fragmentShader: RiverShader.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  useFrame((_, delta) => {
    mat.uniforms.uTime.value += delta;
  });

  return (
    <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0]}>
      {/* wide ribbon, gentle curve implied by lighting + fog */}
      <planeGeometry args={[14, 2.6, 180, 16]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

// A single silhouette layer (like paper cutout)
function SilhouetteLayer({
  z = -2,
  y = 0.9,
  w = 18,
  h = 7,
  color = '#111516',
  opacity = 0.92,
  bend = 0.0,
}) {
  const geom = useMemo(() => {
    // Create a gently undulating top edge
    const shape = new THREE.Shape();
    const left = -w / 2;
    const right = w / 2;

    shape.moveTo(left, -h);
    shape.lineTo(left, 0);

    const steps = 26;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = THREE.MathUtils.lerp(left, right, t);
      const n = Math.sin(t * Math.PI * 2.0 + bend) * 0.22;
      const n2 = Math.sin(t * Math.PI * 4.0 + bend * 0.7) * 0.10;
      const top = 0.55 + n + n2;
      shape.lineTo(x, top);
    }

    shape.lineTo(right, -h);
    shape.lineTo(left, -h);

    return new THREE.ShapeGeometry(shape, 12);
  }, [w, h, bend]);

  return (
    <mesh geometry={geom} position={[0, y, z]}>
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

// A subtle mist layer (big translucent plane)
function Mist() {
  return (
    <mesh position={[0, 1.25, -1.8]}>
      <planeGeometry args={[22, 10, 1, 1]} />
      <meshBasicMaterial color="#f6f4ef" transparent opacity={0.35} />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <div className="w-full h-[400px] md:h-[600px] lg:h-[800px]">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 1.55, 7.4], fov: 50, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ scene, gl }) => {
          const bg = new THREE.Color('#f6f4ef');
          scene.background = bg;
          scene.fog = new THREE.Fog(bg, 4.5, 16);
          gl.setClearColor(bg, 1);
        }}
      >
        {/* We use mostly unlit silhouettes + fog for a cinematic, non-CG look */}
        <DriftCamera />

        {/* Far layers (barely visible) */}
        <SilhouetteLayer z={-7.5} y={1.1} w={24} h={10} color="#0f1415" opacity={0.22} bend={0.7} />
        <SilhouetteLayer z={-5.5} y={1.05} w={22} h={9} color="#0f1415" opacity={0.32} bend={1.4} />

        {/* Mid layers */}
        <SilhouetteLayer z={-3.5} y={0.98} w={20} h={8} color="#111516" opacity={0.55} bend={2.2} />
        <SilhouetteLayer z={-2.4} y={0.93} w={19} h={7.5} color="#111516" opacity={0.68} bend={2.9} />

        {/* River band in front of silhouettes */}
        <RiverBand />

        {/* Foreground banks */}
        <SilhouetteLayer z={-0.8} y={0.86} w={18} h={7} color="#0e1213" opacity={0.88} bend={3.4} />

        <Mist />

        {/* Keep controls disabled to avoid "demo" feel (camera drift + parallax handles engagement) */}
        <OrbitControls enabled={false} />
      </Canvas>
    </div>
  );
}