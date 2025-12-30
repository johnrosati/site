import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// "Light on water" — restrained, cinematic. One plane, gentle displacement, soft highlights.
const WaterShader = {
  uniforms: {
    uTime: { value: 0 },
    uDeep: { value: new THREE.Color('#141c1d') },
    uShallow: { value: new THREE.Color('#2a3431') },
    uTint: { value: new THREE.Color('#c7cec4') },
    uWaveAmp: { value: 0.08 },
    uWaveFreq: { value: 0.85 },
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uWaveAmp;
    uniform float uWaveFreq;

    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;

    float wave(vec2 p, float t) {
      float w1 = sin(p.x * uWaveFreq + t);
      float w2 = sin(p.y * (uWaveFreq * 0.75) - t * 0.9);
      float w3 = sin((p.x + p.y) * (uWaveFreq * 0.45) + t * 0.6);
      return (w1 + w2 + 0.65 * w3);
    }

    void main() {
      float t = uTime * 0.18;

      vec3 pos = position;
      float w = wave(pos.xz, t);
      pos.y += w * uWaveAmp;

      // Derive a smoother normal from nearby heights
      float eps = 0.35;
      float wX = wave(pos.xz + vec2(eps, 0.0), t);
      float wZ = wave(pos.xz + vec2(0.0, eps), t);

      vec3 dx = vec3(1.0, (wX - w) * uWaveAmp / eps, 0.0);
      vec3 dz = vec3(0.0, (wZ - w) * uWaveAmp / eps, 1.0);
      vec3 n = normalize(cross(dz, dx));

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPos = worldPos.xyz;
      vWorldNormal = normalize(mat3(modelMatrix) * n);

      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uDeep;
    uniform vec3 uShallow;
    uniform vec3 uTint;

    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;

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
      // Overcast key light direction
      vec3 lightDir = normalize(vec3(-0.25, 0.85, 0.3));
      vec3 n = normalize(vWorldNormal);

      // View direction approximation from fragment position in view space
      // (good enough for Fresnel without extra uniforms)
      vec3 viewDir = normalize(cameraPosition - vWorldPos);

      float ndl = clamp(dot(n, lightDir), 0.0, 1.0);

      // Gentle distance gradient (z acts like "depth" along the plane)
      float depth = smoothstep(-6.0, 22.0, vWorldPos.z);
      vec3 base = mix(uDeep, uShallow, depth);

      // Subtle moving streaks (very restrained)
      float t = uTime * 0.05;
      float n0 = noise(vWorldPos.xz * 0.10 + vec2(t, -t));
      float streak = smoothstep(0.62, 0.88, n0) * 0.18;

      // Fresnel sheen: stronger at grazing angles (like water)
      float fres = pow(1.0 - clamp(dot(n, viewDir), 0.0, 1.0), 2.0);
      float sheen = fres * (0.10 + 0.18 * pow(ndl, 1.4));

      vec3 col = base;
      col += uTint * (streak + sheen);

      // Filmic restraint / soft lift
      col = mix(col, vec3(0.0), 0.06);
      col = pow(col, vec3(0.95));

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

function WaterPlane() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(WaterShader.uniforms),
      vertexShader: WaterShader.vertexShader,
      fragmentShader: WaterShader.fragmentShader,
      side: THREE.DoubleSide,
      transparent: false,
    });
  }, []);

  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
      <planeGeometry args={[60, 60, 240, 240]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <div className="w-full h-[400px] md:h-[600px] lg:h-[800px]">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2.4, 8.5], fov: 50, near: 0.1, far: 120 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ scene, gl }) => {
          scene.background = new THREE.Color('#f6f4ef');
          scene.fog = new THREE.Fog('#f6f4ef', 10, 40);
          gl.setClearColor('#f6f4ef', 1);
        }}
      >
        {/* soft, non-CG lighting */}
        <ambientLight intensity={0.95} />
        <directionalLight position={[-6, 8, 4]} intensity={0.35} />

        <WaterPlane />

        <OrbitControls
          target={[0, -0.6, 6]}
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.28}
          dampingFactor={0.08}
          enableDamping
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 3.6}
          maxAzimuthAngle={Math.PI / 4.2}
          minAzimuthAngle={-Math.PI / 4.2}
        />
      </Canvas>
    </div>
  );
}