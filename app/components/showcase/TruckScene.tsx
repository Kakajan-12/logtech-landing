"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { Suspense, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { CALLOUTS, type CalloutEls } from "./truckCallouts";

type CalloutsRef = RefObject<CalloutEls[]>;

const BRAND = "#0f833f";
const BG = "#02150c";
const DASH_COUNT = 16;
const DASH_SPACING = 2.4;
const ROAD_LENGTH = DASH_COUNT * DASH_SPACING;

// Tractor + trailer converted from the OBJ in /Truck (metres, cab faces +X).
// Wheels are separate nodes "wheel-0".."wheel-4", one per axle, pivoting
// around the axle so they can spin about Z.
const MODEL_URL = "/models/truck.glb";
const TRUCK_LENGTH = 8; // scene units
const ROAD_WIDTH = 2.6;

/**
 * Invisible points on the model that move the DOM callouts (rendered over the
 * canvas by Telematics): projected to screen every frame, faded in by scroll
 * progress and faded out when their side of the truck faces away.
 */
function CalloutAnchors({
  calloutsRef,
  progress,
}: {
  calloutsRef: CalloutsRef;
  progress: MotionValue<number>;
}) {
  const anchors = useRef<(THREE.Group | null)[]>([]);
  const tmp = useMemo(
    () => ({ pos: new THREE.Vector3(), normal: new THREE.Vector3(), toCam: new THREE.Vector3() }),
    [],
  );

  useFrame(({ camera, size }) => {
    const p = progress.get();
    const { pos, normal, toCam } = tmp;
    CALLOUTS.forEach((c, i) => {
      const obj = anchors.current[i];
      const els = calloutsRef.current[i];
      if (!obj || !els?.dot) return;
      obj.getWorldPosition(pos);
      normal.set(...c.normal).transformDirection(obj.matrixWorld);
      toCam.copy(camera.position).sub(pos).normalize();
      const shown =
        THREE.MathUtils.clamp((p - c.at) / 0.04, 0, 1) *
        THREE.MathUtils.clamp((c.until - p) / 0.04, 0, 1);
      const facing = THREE.MathUtils.smoothstep(normal.dot(toCam), 0, 0.2);
      const opacity = String(shown * facing);

      pos.project(camera);
      const x = ((pos.x + 1) / 2) * size.width;
      const y = ((1 - pos.y) / 2) * size.height;
      els.dot.style.opacity = opacity;
      els.dot.style.transform = `translate(${x}px, ${y}px)`;
      if (!els.label || !els.line) return;

      // leader line goes outwards (away from the centre) and up/down by dy
      if (!els.width) els.width = els.label.offsetWidth;
      let side = x < size.width / 2 ? -1 : 1;
      const room = side > 0 ? size.width - x : x;
      if (room < (els.width ?? 0) + 64) side = -side;
      const ex = x + side * 26;
      const ey = y + c.dy;
      const lx = ex + side * 22;
      els.line.setAttribute("points", `${x},${y} ${ex},${ey} ${lx},${ey}`);
      els.line.style.opacity = opacity;
      els.label.style.opacity = opacity;
      els.label.style.transform = `translate(${lx}px, ${ey}px) translate(${
        side > 0 ? "6px" : "calc(-100% - 6px)"
      }, -50%)`;
    });
  });

  return (
    <>
      {CALLOUTS.map((c, i) => (
        <group
          key={c.key}
          position={c.anchor}
          ref={(el) => {
            anchors.current[i] = el;
          }}
        />
      ))}
    </>
  );
}

function Truck({
  animate,
  progress,
  calloutsRef,
}: {
  animate: boolean;
  progress: MotionValue<number>;
  calloutsRef: CalloutsRef;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const beacon = useRef<THREE.Mesh>(null);

  const { wheels, body, scale, offsetX, bodyY } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const wheels: THREE.Object3D[] = [];
    scene.traverse((o) => {
      if (o.name.startsWith("wheel-")) wheels.push(o);
    });
    const bodyNode = scene.getObjectByName("body");
    const body = bodyNode ? [bodyNode] : [];
    return {
      wheels,
      body,
      scale: TRUCK_LENGTH / size.x,
      offsetX: -(box.min.x + box.max.x) / 2,
      bodyY: bodyNode?.position.y ?? 0,
    };
  }, [scene]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (animate) {
      // rolling towards +X means negative rotation about Z
      wheels.forEach((w) => (w.rotation.z -= delta * 12));
      body.forEach((o) => (o.position.y = bodyY + Math.sin(t * 7) * 0.015));
    }
    if (beacon.current) {
      const k = animate ? (t * 0.8) % 1 : 0.3;
      beacon.current.scale.setScalar(1 + k * 2.5);
      (beacon.current.material as THREE.MeshBasicMaterial).opacity = 1 - k;
    }
  });

  return (
    <group scale={scale}>
      <group position={[offsetX, 0, 0]}>
        <primitive object={scene} />
        <CalloutAnchors calloutsRef={calloutsRef} progress={progress} />
        {/* GPS tracker on the cab roof */}
        <group position={[3.3, 3.93, 0]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.13, 0.12, 16]} />
            <meshStandardMaterial color="#38e0a0" emissive="#38e0a0" emissiveIntensity={1.5} />
          </mesh>
          <mesh ref={beacon} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
            <ringGeometry args={[0.17, 0.21, 32]} />
            <meshBasicMaterial color="#38e0a0" transparent side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

function Diorama({
  progress,
  animate,
  calloutsRef,
}: {
  progress: MotionValue<number>;
  animate: boolean;
  calloutsRef: CalloutsRef;
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
        <planeGeometry args={[ROAD_LENGTH, ROAD_WIDTH]} />
        <meshStandardMaterial color="#0a2116" roughness={1} />
      </mesh>
      {[-ROAD_WIDTH / 2, ROAD_WIDTH / 2].map((z) => (
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
          <meshStandardMaterial color="#d3f5e2" emissive="#d3f5e2" emissiveIntensity={0.6} />
        </mesh>
      ))}
      <Suspense fallback={null}>
        <Truck animate={animate} progress={progress} calloutsRef={calloutsRef} />
      </Suspense>
    </group>
  );
}

export default function TruckScene({
  progress,
  active,
  animate,
  calloutsRef,
}: {
  progress: MotionValue<number>;
  active: boolean;
  animate: boolean;
  /** DOM callouts over the canvas, positioned on parts of the model */
  calloutsRef: CalloutsRef;
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
      <hemisphereLight args={["#b5ecce", BG, 0.9]} />
      <directionalLight position={[6, 9, 4]} intensity={2.2} />
      <pointLight position={[-4, 2.5, 3]} intensity={25} distance={14} color={BRAND} />
      {/* procedural studio reflections for chrome and paint (no HDR download) */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-6, 2, 4]} rotation-y={Math.PI / 3} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[6, 2, -4]} rotation-y={-Math.PI / 1.5} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} color={BRAND} position={[0, 1, -8]} scale={[16, 2, 1]} />
      </Environment>
      <Diorama progress={progress} animate={animate} calloutsRef={calloutsRef} />
      <ContactShadows position={[0, 0.02, 0]} scale={12} blur={2.4} far={4} opacity={0.6} />
    </Canvas>
  );
}
