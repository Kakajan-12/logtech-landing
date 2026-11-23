"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

const R = 2;
export const HUB = { key: "ashgabat", lat: 37.95, lon: 58.38 } as const;
export const CITIES = [
  { key: "istanbul", lat: 41.01, lon: 28.97 },
  { key: "moscow", lat: 55.75, lon: 37.62 },
  { key: "dubai", lat: 25.2, lon: 55.27 },
  { key: "almaty", lat: 43.24, lon: 76.89 },
  { key: "tehran", lat: 35.69, lon: 51.39 },
  { key: "baku", lat: 40.41, lon: 49.87 },
  { key: "tashkent", lat: 41.3, lon: 69.24 },
  { key: "beijing", lat: 39.9, lon: 116.4 },
  { key: "berlin", lat: 52.52, lon: 13.4 },
  { key: "delhi", lat: 28.61, lon: 77.21 },
] as const;
export type CityKey = (typeof CITIES)[number]["key"] | typeof HUB.key;
// labels drawn above their dot where neighbours would collide
const LABEL_ABOVE = new Set<string>(["almaty"]);
const ROUTE_R = R * 1.006; // just above the coastlines

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
        color="#6fdca0"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}

type WorldLines = { coast: number[][]; borders: number[][] };

/**
 * Flat [lon, lat, lon, lat, ...] polylines -> segment pairs on the sphere.
 * Long edges are split so lines follow the curvature instead of cutting chords.
 */
function linesGeometry(lines: number[][], r: number) {
  const pos: number[] = [];
  const push = (lon: number, lat: number) => {
    const v = toVec3(lat, lon, r);
    pos.push(v.x, v.y, v.z);
  };
  for (const l of lines) {
    for (let i = 0; i + 3 < l.length; i += 2) {
      const [lo0, la0, lo1, la1] = [l[i], l[i + 1], l[i + 2], l[i + 3]];
      // edge wrapping across the antimeridian: skip, or it spans the globe
      if (Math.abs(lo1 - lo0) > 180) continue;
      const steps = Math.max(
        1,
        Math.ceil(Math.hypot(lo1 - lo0, la1 - la0) / 2),
      );
      for (let k = 0; k < steps; k++) {
        const a = k / steps,
          b = (k + 1) / steps;
        push(lo0 + (lo1 - lo0) * a, la0 + (la1 - la0) * a);
        push(lo0 + (lo1 - lo0) * b, la0 + (la1 - la0) * b);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return g;
}

/** Coastlines and country borders (Natural Earth 1:110m via world-atlas). */
function CountryLines() {
  const [geo, setGeo] = useState<{
    coast: THREE.BufferGeometry;
    borders: THREE.BufferGeometry;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let made: {
      coast: THREE.BufferGeometry;
      borders: THREE.BufferGeometry;
    } | null = null;
    fetch("/geo/world-lines.json")
      .then((r) => r.json() as Promise<WorldLines>)
      .then((d) => {
        if (cancelled) return;
        made = {
          coast: linesGeometry(d.coast, R * 1.003),
          borders: linesGeometry(d.borders, R * 1.003),
        };
        setGeo(made);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      made?.coast.dispose();
      made?.borders.dispose();
    };
  }, []);

  if (!geo) return null;
  return (
    <group>
      <lineSegments geometry={geo.coast}>
        <lineBasicMaterial color="#6fdca0" transparent opacity={0.75} />
      </lineSegments>
      <lineSegments geometry={geo.borders}>
        <lineBasicMaterial color="#38e0a0" transparent opacity={0.4} />
      </lineSegments>
    </group>
  );
}

/** Soft green rim glow around the globe (fresnel). */
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
            gl_FragColor = vec4(0.06, 0.75, 0.4, 1.0) * intensity;
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

// Shared by all trucks on the globe: one set of geometry and materials.
const TRUCK = (() => {
  const box = new THREE.BoxGeometry(1, 1, 1);
  const wheel = new THREE.CylinderGeometry(1, 1, 1, 12).rotateZ(Math.PI / 2);
  const mat = (color: string, emissive = 0.18) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.45,
      metalness: 0.1,
      emissive: color,
      emissiveIntensity: emissive,
    });
  return {
    box,
    wheel,
    white: mat("#f4f7f5", 0.22),
    green: mat("#0f833f", 0.35),
    accent: mat("#38e0a0", 0.6),
    dark: mat("#0b1410", 0),
    glass: mat("#123a2a", 0.1),
    head: new THREE.MeshBasicMaterial({ color: "#fff6c8" }),
    tail: new THREE.MeshBasicMaterial({ color: "#ff4a3d" }),
  };
})();

type Part = [
  THREE.Material,
  [number, number, number],
  [number, number, number],
];
// [material, position, size] — truck faces +Z, +Y is up, units are globe units
const BODY: Part[] = [
  [TRUCK.dark, [0, 0.013, 0.004], [0.044, 0.008, 0.17]], // chassis
  [TRUCK.white, [0, 0.043, -0.028], [0.05, 0.05, 0.116]], // trailer box
  [TRUCK.green, [0, 0.03, -0.028], [0.0505, 0.012, 0.116]], // brand band
  [TRUCK.accent, [0, 0.0365, -0.028], [0.051, 0.0025, 0.116]], // pin stripe
  [TRUCK.green, [0, 0.035, 0.057], [0.048, 0.04, 0.034]], // cab
  [TRUCK.green, [0, 0.058, 0.05], [0.044, 0.01, 0.022]], // roof fairing
  [TRUCK.glass, [0, 0.043, 0.0745], [0.042, 0.016, 0.002]], // windscreen
  [TRUCK.dark, [0, 0.022, 0.0748], [0.044, 0.01, 0.002]], // grille
  [TRUCK.head, [0.017, 0.0225, 0.0755], [0.008, 0.005, 0.002]],
  [TRUCK.head, [-0.017, 0.0225, 0.0755], [0.008, 0.005, 0.002]],
  [TRUCK.tail, [0.019, 0.024, -0.0865], [0.008, 0.005, 0.002]],
  [TRUCK.tail, [-0.019, 0.024, -0.0865], [0.008, 0.005, 0.002]],
];
const AXLES = [0.058, 0.022, -0.052, -0.07];

/** Tiny low-poly tractor-trailer in Hebent colours. */
function TruckIcon() {
  return (
    <group>
      {BODY.map(([material, position, scale], i) => (
        <mesh
          key={i}
          geometry={TRUCK.box}
          material={material}
          position={position}
          scale={scale}
        />
      ))}
      {AXLES.flatMap((z) =>
        [0.0235, -0.0235].map((x) => (
          <mesh
            key={`${z}${x}`}
            geometry={TRUCK.wheel}
            material={TRUCK.dark}
            position={[x, 0.009, z]}
            scale={[0.007, 0.009, 0.009]}
          />
        )),
      )}
    </group>
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
  // great-circle path along the surface, like a road trip rather than a flight
  const curve = useMemo(() => {
    const a = toVec3(HUB.lat, HUB.lon, 1);
    const b = toVec3(to.lat, to.lon, 1);
    const angle = a.angleTo(b);
    return {
      getPoint(t: number) {
        const s = Math.sin(angle);
        return a
          .clone()
          .multiplyScalar(Math.sin((1 - t) * angle) / s)
          .add(b.clone().multiplyScalar(Math.sin(t * angle) / s))
          .setLength(ROUTE_R);
      },
    };
  }, [to]);
  const points = useMemo(
    () => Array.from({ length: 65 }, (_, i) => curve.getPoint(i / 64)),
    [curve],
  );
  const vehicle = useRef<THREE.Group>(null);
  const basis = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      x: new THREE.Vector3(),
      y: new THREE.Vector3(),
      z: new THREE.Vector3(),
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!vehicle.current) return;
    const t = animate ? (clock.elapsedTime * speed + offset) % 1 : offset;
    const p = curve.getPoint(t);
    const ahead = curve.getPoint(Math.min(1, t + 0.002));
    // stand on the surface (up = normal) and face along the route
    const { m, x, y, z } = basis;
    y.copy(p).normalize();
    z.copy(ahead).sub(p);
    if (z.lengthSq() < 1e-12) return;
    x.crossVectors(y, z).normalize();
    z.crossVectors(x, y);
    m.makeBasis(x, y, z);
    vehicle.current.position.copy(p);
    vehicle.current.quaternion.setFromRotationMatrix(m);
  });

  return (
    <group>
      <Line
        points={points}
        color="#2fbf74"
        lineWidth={1.6}
        transparent
        opacity={0.8}
      />
      <group ref={vehicle}>
        <group scale={0.7}>
          <TruckIcon />
        </group>
      </group>
      <mesh position={points[points.length - 1]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#38e0a0" />
      </mesh>
    </group>
  );
}

type LabelEls = RefObject<Partial<Record<CityKey, HTMLSpanElement | null>>>;

/**
 * Invisible anchor on the globe that moves its DOM label (rendered over the
 * canvas by GlobeScene) and fades it out on the far side of the globe.
 */
function CityAnchor({
  id,
  lat,
  lon,
  labelsRef,
}: {
  id: CityKey;
  lat: number;
  lon: number;
  labelsRef: LabelEls;
}) {
  const anchor = useRef<THREE.Group>(null);
  const position = useMemo(() => toVec3(lat, lon, R * 1.01), [lat, lon]);
  const world = useMemo(() => new THREE.Vector3(), []);
  const toCam = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, size }) => {
    const el = labelsRef.current[id];
    if (!anchor.current || !el) return;
    anchor.current.getWorldPosition(world);
    toCam.copy(camera.position).sub(world).normalize();
    // globe is centred at the origin, so the world position is the normal
    const facing = toCam.dot(world.clone().normalize());
    el.style.opacity = String(THREE.MathUtils.smoothstep(facing, 0.1, 0.35));
    world.project(camera);
    const x = ((world.x + 1) / 2) * size.width;
    const y = ((1 - world.y) / 2) * size.height;
    el.style.transform = `translate(${x}px, ${y}px) ${LABEL_ABOVE.has(id) ? "translate(-50%, calc(-100% - 6px))" : "translate(-50%, 6px)"}`;
  });

  return <group ref={anchor} position={position} />;
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

function Globe({
  animate,
  labelsRef,
}: {
  animate: boolean;
  labelsRef: LabelEls;
}) {
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
              color="#06301c"
              emissive="#021409"
              roughness={0.9}
            />
          </mesh>
          <DotSphere />
          <CountryLines />
          <Hub animate={animate} />
          {CITIES.map((c, i) => (
            <Route
              key={c.key}
              to={c}
              speed={0.12 + (i % 4) * 0.035}
              offset={i / CITIES.length}
              animate={animate}
            />
          ))}
          {[HUB, ...CITIES].map((c) => (
            <CityAnchor
              key={c.key}
              id={c.key}
              lat={c.lat}
              lon={c.lon}
              labelsRef={labelsRef}
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
  labels,
}: {
  active: boolean;
  animate: boolean;
  /** City names (shown from the lg breakpoint up). */
  labels?: Record<CityKey, string>;
}) {
  // Drag-to-rotate only with a mouse: on touch screens it would block page scroll.
  const [finePointer] = useState(
    () => window.matchMedia("(pointer: fine)").matches,
  );

  const labelsRef: LabelEls = useRef({});

  return (
    <div className="relative size-full">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        fallback={null}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <Stars
          radius={60}
          depth={30}
          count={1500}
          factor={3}
          fade
          speed={animate ? 0.6 : 0}
        />
        <Globe animate={animate} labelsRef={labelsRef} />
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
      {labels && (
        <div
          className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
          aria-hidden
        >
          {[HUB, ...CITIES].map((c) => (
            <span
              key={c.key}
              ref={(el) => {
                labelsRef.current[c.key] = el;
              }}
              className={`absolute left-0 top-0 whitespace-nowrap font-semibold tracking-wide opacity-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${
                c.key === HUB.key
                  ? "text-[13px] text-white"
                  : "text-[11px] text-emerald-100/85"
              }`}
            >
              {labels[c.key]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
