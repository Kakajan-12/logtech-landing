/**
 * Telemetry callouts pinned to parts of the truck model (public/models/truck.glb).
 * Coordinates are in model space: metres, cab faces +X, Y up, Z across.
 * `normal` points away from the part; a callout fades out when that side
 * turns away from the camera. `at` is the scroll progress where it appears,
 * `dy` is how far (px) the label sits above (-) or below (+) the part.
 */
export type CalloutKey = "gps" | "engine" | "speed" | "fuel" | "temp" | "doors";

export type Callout = {
  key: CalloutKey;
  anchor: [number, number, number];
  normal: [number, number, number];
  /** scroll progress window [at, until] in which the callout is shown */
  at: number;
  until: number;
  dy: number;
};

// Ordered along the scroll: the scene turns the truck, so the cab's right side
// is in view first, then the rear and the other side of the trailer.
export const CALLOUTS: Callout[] = [
  { key: "gps", anchor: [3.3, 4.02, 0], normal: [0, 1, 0], at: 0.03, until: 0.2, dy: -56 },
  { key: "engine", anchor: [3.9, 1.35, 1.22], normal: [0, 0, 1], at: 0.12, until: 0.25, dy: 56 },
  { key: "speed", anchor: [0, 0.55, 1.25], normal: [0, 0, 1], at: 0.23, until: 0.42, dy: -76 },
  { key: "fuel", anchor: [1.9, 0.95, 1.22], normal: [0, 0, 1], at: 0.32, until: 0.56, dy: 64 },
  { key: "doors", anchor: [-11.8, 2.2, 0], normal: [-1, 0, 0], at: 0.6, until: 0.84, dy: -44 },
  { key: "temp", anchor: [-4.5, 3.2, -1.25], normal: [0, 0, -1], at: 0.74, until: 1.01, dy: -52 },
];

/** DOM nodes of one callout, positioned every frame by the 3D scene. */
export type CalloutEls = {
  dot?: HTMLDivElement | null;
  label?: HTMLDivElement | null;
  line?: SVGPolylineElement | null;
  /** cached label width, measured once */
  width?: number;
};
