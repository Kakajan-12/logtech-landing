"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const BRAND = "#0044e1";
const BG = "#020b24";
const DASH_COUNT = 16;
const DASH_SPACING = 2.4;
const ROAD_LENGTH = DASH_COUNT * DASH_SPACING;

// "Car Kit" by Kenney (CC0), see public/models/CREDITS.txt.
// The model faces +Z and is ~3.25 units long.
const MODEL_URL = "/models/delivery.glb";
const MODEL_SCALE = 1.9;
const WHEELS = [
  "wheel-front-left",
  "wheel-front-right",
  "wheel-back-left",
  "wheel-back-right",
];

function Truck({ animate }: { animate: boolean }) {
  const { scene } = useGLTF(MODEL_URL);
  const beacon = useRef<THREE.Mesh>(null);

  const parts = useMemo(
    () => ({
      wheels: WHEELS.map((name) => scene.getObjectByName(name)).filter(
        (o): o is THREE.Object3D => !!o,
      ),
      body: ["body", "door"]
        .map((name) => scene.getObjectByName(name))
        .filter((o): o is THREE.Object3D => !!o),
    }),
    [scene],
  );
  const bodyBaseY = useMemo(
    () => parts.body.map((o) => o.position.y),
    [parts],
  );

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (animate) {
      // wheels roll forward (+Z in model space)
      parts.wheels.forEach((w) => (w.rotation.x += delta * 9));
      const bob = Math.sin(t * 7) * 0.006;
      parts.body.forEach((o, i) => (o.position.y = bodyBaseY[i] + bob));
    }
    if (beacon.current) {
      const k = animate ? (t * 0.8) % 1 : 0.3;
      beacon.current.scale.setScalar(1 + k * 2.5);
      (beacon.current.material as THREE.MeshBasicMaterial).opacity = 1 - k;
    }
  });

  return (
    // rotate so the truck drives along +X, the direction the road moves
    <group rotation={[0, Math.PI / 2, 0]} scale={MODEL_SCALE}>
      <primitive object={scene} />
      {/* GPS tracker on the front of the cargo box roof */}
      <group position={[0, 1.66, 0.25]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.065, 0.06, 16]} />
          <meshStandardMaterial color="#38e0a0" emissive="#38e0a0" emissiveIntensity={1.5} />
        </mesh>
        <mesh ref={beacon} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
          <ringGeometry args={[0.085, 0.105, 32]} />
          <meshBasicMaterial color="#38e0a0" transparent side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

function Diorama({
  progress,
  animate,
}: {
  progress: MotionValue<number>;
  animate: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const dashes = useRef<(THREE.Mesh | null)[]>([]);
  const offset = useRef(0);

  useFrame((_, delta) => {
    // Scroll turns the whole scene; damping keeps it smooth.
    const target = -0.6 + progress.get() * Math.PI * 1.6;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        target,
        4,
        delta,
      );
    }
    if (animate) offset.current = (offset.current + delta * 7) % ROAD_LENGTH;
    dashes.current.forEach((d, i) => {
      if (!d) return;
      const x = (((i * DASH_SPACING - offset.current) % ROAD_LENGTH) + ROAD_LENGTH) % ROAD_LENGTH;
      d.position.x = x - ROAD_LENGTH / 2;
    });
  });

  return (
    <group ref={group}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROAD_LENGTH, 3.4]} />
        <meshStandardMaterial color="#0a1633" roughness={1} />
      </mesh>
      {[-1.65, 1.65].map((z) => (
        <mesh key={z} position={[0, 0.01, z]}>
          <boxGeometry args={[ROAD_LENGTH, 0.02, 0.05]} />
          <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={2} />
        </mesh>
      ))}
      {Array.from({ length: DASH_COUNT }, (_, i) => (
        <mesh
          key={i}
          position={[0, 0.012, 0]}
          ref={(el) => {
            dashes.current[i] = el;
          }}
        >
          <boxGeometry args={[1, 0.01, 0.08]} />
          <meshStandardMaterial color="#cfe0ff" emissive="#cfe0ff" emissiveIntensity={0.6} />
        </mesh>
      ))}
      <Suspense fallback={null}>
        <Truck animate={animate} />
      </Suspense>
    </group>
  );
}

export default function TruckScene({
  progress,
  active,
  animate,
}: {
  progress: MotionValue<number>;
  active: boolean;
  animate: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [9.5, 4.6, 9.5], fov: 30 }}
      onCreated={({ camera }) => camera.lookAt(0, 1, 0)}
      gl={{ antialias: true, alpha: true }}
      fallback={null}
    >
      <fog attach="fog" args={[BG, 12, 24]} />
      <ambientLight intensity={0.8} />
      <hemisphereLight args={["#b9d0ff", BG, 0.9]} />
      <directionalLight position={[6, 9, 4]} intensity={2.2} />
      <pointLight position={[-4, 2.5, 3]} intensity={25} distance={14} color={BRAND} />
      <Diorama progress={progress} animate={animate} />
      <ContactShadows position={[0, 0.02, 0]} scale={12} blur={2.4} far={4} opacity={0.6} />
    </Canvas>
  );
}
