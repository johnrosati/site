import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// --- A small shader that feels like "light on water" ---
// Gentle vertex displacement + soft moving highlights.
const WaterMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColorDeep: { value: new THREE.Color('#1f2a2b') },
    uColorShallow: { value: new THREE.Color('#2f3a36') },
    uLightTint: { value: new THREE.Color('#b9c2b8') },
    uWaveAmp: { value: 0.12 },
    uWaveFreq: { value: 0.9 },
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uWaveAmp;
    uniform float uWaveFreq;

    varying vec3 vPos;
    varying vec3 vNormal;

    float wave(vec2 p) {
      // Two blended sine waves; slow, filmic motion.
      float t = uTime * 0.15;
      float w1 = sin((p.x * uWaveFreq) + t);
      float w2 = sin((p.y * (uWaveFreq * 0.85)) - t * 0.9);
      float w3 = sin((p.x + p.y) * (uWaveFreq * 0.55) + t * 0.7);
      return (w1 + w2 + 0.6 * w3);
    }

    void main() {
      vPos = position;

      vec3 pos = position;
      float w = wave(pos.xz);
      pos.y += w * uWaveAmp;

      // Approximate normal from local height changes
      float eps = 0.35;
      float wX = wave((pos.xz + vec2(eps, 0.0)));
      float wZ = wave((pos.xz + vec2(0.0, eps)));
      vec3 dx = vec3(1.0, (wX - w) * uWaveAmp / eps, 0.0);
      vec3 dz = vec3(0.0, (wZ - w) * uWaveAmp / eps, 1.0);
      vNormal = normalize(cross(dz, dx));

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uColorDeep;
    uniform vec3 uColorShallow;
    uniform vec3 uLightTint;

    varying vec3 vPos;
    varying vec3 vNormal;

    // Small soft noise (value noise)
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
      // Fake a distant, overcast key light
      vec3 lightDir = normalize(vec3(-0.25, 0.8, 0.35));
      float ndl = clamp(dot(normalize(vNormal), lightDir), 0.0, 1.0);

      // Depth-ish gradient across the plane
      float grad = smoothstep(-18.0, 18.0, vPos.z);
      vec3 base = mix(uColorDeep, uColorShallow, grad);

      // Soft moving caustic-like streaks (very subtle)
      float t = uTime * 0.06;
      float n = noise(vPos.xz * 0.12 + vec2(t, -t));
      float streak = smoothstep(0.55, 0.85, n) * 0.35;

      // Highlight: mostly diffuse + tiny sheen
      float sheen = pow(ndl, 2.0) * 0.25;
      vec3 col = base;
      col += uLightTint * (streak * 0.25 + sheen);

      // Filmic restraint: keep contrast low
      col = mix(col, vec3(0.0), 0.08);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

function WaterPlane() {
  const materialRef = useRef();

  const shaderMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(WaterMaterial.uniforms),
      vertexShader: WaterMaterial.vertexShader,
      fragmentShader: WaterMaterial.fragmentShader,
      side: THREE.DoubleSide,
    });
    return mat;
  }, []);

  useFrame((_, delta) => {
    if (shaderMaterial?.uniforms?.uTime) {
      shaderMaterial.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -0.75, 0]}>
      {/* lots of segments for smooth displacement */}
      <planeGeometry args={[70, 70, 220, 220]} />
      <primitive object={shaderMaterial} attach="material" ref={materialRef} />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <div className="w-full h-[400px] md:h-[600px] lg:h-[800px]">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 10, 18], fov: 45, near: 0.1, far: 200 }}
      >
        {/* A very soft ambient + a single dim key to avoid "CG" harshness */}
        <ambientLight intensity={0.85} />
        <directionalLight position={[-5, 12, 6]} intensity={0.45} />

        <WaterPlane />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.35}
          dampingFactor={0.08}
          enableDamping
          maxPolarAngle={Math.PI / 2.05}
          minPolarAngle={Math.PI / 3.2}
        />
      </Canvas>
    </div>
  );
}