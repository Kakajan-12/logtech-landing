"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, Stars } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const R = 2;
const HUB = { lat: 37.95, lon: 58.38 }; // Ashgabat
const CITIES = [
  { lat: 41.01, lon: 28.97 }, // Istanbul
  { lat: 55.75, lon: 37.62 }, // Moscow
  { lat: 25.2, lon: 55.27 }, // Dubai
  { lat: 43.24, lon: 76.89 }, // Almaty
  { lat: 35.69, lon: 51.39 }, // Tehran
  { lat: 40.41, lon: 49.87 }, // Baku
  { lat: 41.3, lon: 69.24 }, // Tashkent
  { lat: 39.9, lon: 116.4 }, // Beijing
  { lat: 52.52, lon: 13.4 }, // Berlin
  { lat: 28.61, lon: 77.21 }, // Delhi
];

function toVec3(lat: number, lon: number, r = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

/** Evenly distributed dots on the sphere (Fibonacci lattice). */
function DotSphere() {
  const positions = useMemo(() => {
    const n = 3200;
    const arr = new Float32Array(n * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      arr[i * 3] = Math.cos(th) * r * R * 1.002;
      arr[i * 3 + 1] = y * R * 1.002;
      arr[i * 3 + 2] = Math.sin(th) * r * R * 1.002;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#7fa8ff"
        transparent
        opacity={0.75}
        sizeAttenuation
      />
    </points>
  );
}

/** Soft blue rim glow around the globe (fresnel). */
function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(0.15, 0.4, 1.0, 1.0) * intensity;
          }`,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  return (
    <mesh scale={1.18} material={material}>
      <sphereGeometry args={[R, 64, 64]} />
    </mesh>
  );
}

function Route({
  to,
  speed,
  offset,
  animate,
}: {
  to: { lat: number; lon: number };
  speed: number;
  offset: number;
  animate: boolean;
}) {
  const curve = useMemo(() => {
    const a = toVec3(HUB.lat, HUB.lon);
    const b = toVec3(to.lat, to.lon);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.setLength(R + a.distanceTo(b) * 0.38);
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [to]);
  const points = useMemo(() => curve.getPoints(64), [curve]);
  const vehicle = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!vehicle.current) return;
    const t = animate ? (clock.elapsedTime * speed + offset) % 1 : offset;
    vehicle.current.position.copy(curve.getPoint(t));
  });

  return (
    <group>
      <Line
        points={points}
        color="#4d8bff"
        lineWidth={1.4}
        transparent
        opacity={0.55}
      />
      <mesh ref={vehicle}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={points[points.length - 1]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#38e0a0" />
      </mesh>
    </group>
  );
}

/** Pulsing ring on the hub city. */
function Hub({ animate }: { animate: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  const { position, quaternion } = useMemo(() => {
    const p = toVec3(HUB.lat, HUB.lon, R * 1.004);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      p.clone().normalize(),
    );
    return { position: p, quaternion: q };
  }, []);

  useFrame(({ clock }) => {
    if (!ring.current) return;
    const k = animate ? (clock.elapsedTime * 0.7) % 1 : 0.4;
    ring.current.scale.setScalar(1 + k * 3);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 1 - k;
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <circleGeometry args={[0.06, 24]} />
        <meshBasicMaterial color="#38e0a0" />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial color="#38e0a0" transparent />
      </mesh>
    </group>
  );
}

function Globe({ animate }: { animate: boolean }) {
  const spin = useRef<THREE.Group>(null);
  // Turn the globe so the hub (Ashgabat) faces the camera at start.
  const initial = useMemo(() => {
    const hub = toVec3(HUB.lat, HUB.lon);
    return new THREE.Euler(
      THREE.MathUtils.degToRad(HUB.lat) * 0.7,
      -Math.atan2(hub.x, hub.z),
      0,
    );
  }, []);

  useFrame((_, delta) => {
    if (animate && spin.current) spin.current.rotation.y += delta * 0.06;
  });

  return (
    <group rotation={[0.15, 0, -0.12]}>
      <group ref={spin}>
        <group rotation={initial}>
          <mesh>
            <sphereGeometry args={[R * 0.995, 64, 64]} />
            <meshStandardMaterial
              color="#06173f"
              emissive="#020a20"
              roughness={0.9}
            />
          </mesh>
          <DotSphere />
          <Hub animate={animate} />
          {CITIES.map((c, i) => (
            <Route
              key={i}
              to={c}
              speed={0.12 + (i % 4) * 0.035}
              offset={i / CITIES.length}
              animate={animate}
            />
          ))}
        </group>
      </group>
      <Atmosphere />
    </group>
  );
}

export default function GlobeScene({
  active,
  animate,
}: {
  active: boolean;
  animate: boolean;
}) {
  // Drag-to-rotate only with a mouse: on touch screens it would block page scroll.
  const [finePointer] = useState(
    () => window.matchMedia("(pointer: fine)").matches,
  );

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      fallback={null}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <Stars radius={60} depth={30} count={1500} factor={3} fade speed={animate ? 0.6 : 0} />
      <Globe animate={animate} />
      {finePointer && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.75}
        />
      )}
    </Canvas>
  );
}
