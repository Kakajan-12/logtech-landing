"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { useRef } from "react";
import * as THREE from "three";

const BRAND = "#0044e1";
const BG = "#020b24";
const WHEEL_X = [2.45, 0.2, -1.5, -2.4];
const DASH_COUNT = 16;
const DASH_SPACING = 2.4;
const ROAD_LENGTH = DASH_COUNT * DASH_SPACING;

/** Low-poly truck built from primitives — no external model needed. */
function Truck({ animate }: { animate: boolean }) {
  const body = useRef<THREE.Group>(null);
  const wheels = useRef<(THREE.Group | null)[]>([]);
  const beacon = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (animate) {
      wheels.current.forEach((w) => {
        if (w) w.rotation.z -= delta * 5;
      });
      if (body.current) body.current.position.y = Math.sin(t * 7) * 0.012;
    }
    if (beacon.current) {
      const k = animate ? (t * 0.8) % 1 : 0.3;
      beacon.current.scale.setScalar(1 + k * 2.5);
      (beacon.current.material as THREE.MeshBasicMaterial).opacity = 1 - k;
    }
  });

  return (
    <group>
      <group ref={body}>
        {/* chassis */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[6.2, 0.25, 1.1]} />
          <meshStandardMaterial color="#1f2937" roughness={0.7} />
        </mesh>
        {/* cab */}
        <RoundedBox args={[1.5, 1.6, 1.9]} radius={0.14} position={[2.45, 1.5, 0]} castShadow>
          <meshStandardMaterial color={BRAND} metalness={0.35} roughness={0.35} />
        </RoundedBox>
        {/* windshield + side windows */}
        <mesh position={[3.21, 1.8, 0]}>
          <boxGeometry args={[0.04, 0.7, 1.6]} />
          <meshStandardMaterial color="#0b1530" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[2.65, 1.85, 0]}>
          <boxGeometry args={[0.75, 0.5, 1.92]} />
          <meshStandardMaterial color="#0b1530" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* headlights */}
        {[-0.7, 0.7].map((z) => (
          <mesh key={z} position={[3.21, 0.95, z]}>
            <boxGeometry args={[0.04, 0.16, 0.3]} />
            <meshStandardMaterial color="#fff6d5" emissive="#ffe9a8" emissiveIntensity={3} />
          </mesh>
        ))}
        {/* trailer */}
        <RoundedBox args={[4.6, 2.1, 2]} radius={0.06} position={[-0.75, 1.8, 0]} castShadow>
          <meshStandardMaterial color="#f3f6fb" roughness={0.45} />
        </RoundedBox>
        <mesh position={[-0.75, 1.15, 0]}>
          <boxGeometry args={[4.62, 0.16, 2.02]} />
          <meshStandardMaterial color={BRAND} emissive={BRAND} emissiveIntensity={0.4} />
        </mesh>
        {/* tail lights */}
        {[-0.8, 0.8].map((z) => (
          <mesh key={z} position={[-3.06, 0.95, z]}>
            <boxGeometry args={[0.04, 0.14, 0.24]} />
            <meshStandardMaterial color="#ff4d4d" emissive="#ff2a2a" emissiveIntensity={2.5} />
          </mesh>
        ))}
        {/* GPS tracker on the cab roof */}
        <group position={[2.45, 2.32, 0]}>
          <mesh>
            <cylinderGeometry args={[0.09, 0.12, 0.12, 16]} />
            <meshStandardMaterial color="#38e0a0" emissive="#38e0a0" emissiveIntensity={1.5} />
          </mesh>
          <mesh ref={beacon} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
            <ringGeometry args={[0.16, 0.2, 32]} />
            <meshBasicMaterial color="#38e0a0" transparent side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* wheels: hexagonal hub caps make the rotation visible */}
      {WHEEL_X.flatMap((x, i) =>
        [-0.95, 0.95].map((z, j) => (
          <group
            key={`${i}-${j}`}
            position={[x, 0.45, z]}
            ref={(el) => {
              wheels.current[i * 2 + j] = el;
            }}
          >
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.45, 0.45, 0.32, 28]} />
              <meshStandardMaterial color="#0d0f14" roughness={0.85} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.17 : -0.17]}>
              <cylinderGeometry args={[0.22, 0.22, 0.02, 6]} />
              <meshStandardMaterial color="#9aa4b2" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        )),
      )}
    </group>
  );
}

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
      <Truck animate={animate} />
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
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#b9d0ff", BG, 0.7]} />
      <directionalLight position={[6, 9, 4]} intensity={2} />
      <pointLight position={[-4, 2.5, 3]} intensity={25} distance={14} color={BRAND} />
      <Diorama progress={progress} animate={animate} />
      <ContactShadows position={[0, 0.02, 0]} scale={12} blur={2.4} far={4} opacity={0.6} />
    </Canvas>
  );
}
