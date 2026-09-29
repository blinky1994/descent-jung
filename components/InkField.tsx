"use client";

import { useEffect, useRef } from "react";
import { isReducedMotion } from "@/lib/motion";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// Domain-warped fbm: slow smoke rising through dark water.
const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uTint;
uniform float uAmt;
uniform float uRise;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.035;
  p.y -= t * uRise;
  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(fbm(p * 1.3 + 3.2 * q + vec2(1.7, 9.2) + 0.15 * t), fbm(p * 1.3 + 3.2 * q + vec2(8.3, 2.8) - 0.12 * t));
  float f = fbm(p * 1.3 + 3.4 * r);
  float smoke = smoothstep(0.42, 1.05, f);
  smoke = pow(smoke, 1.5);
  float floorGlow = mix(1.0, 0.45, uv.y);
  vec2 c = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float vig = 1.0 - smoothstep(0.15, 1.15, length(c * vec2(0.85, 1.1)));
  float a = clamp(smoke * uAmt * floorGlow * vig, 0.0, 1.0);
  if (a != a) a = 0.0; // guard against NaN on quirky drivers
  gl_FragColor = vec4(uTint * a, a);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export default function InkField({
  tint = "#c2410c",
  amount = 0.5,
  rise = 1,
  className,
}: {
  tint?: string;
  amount?: number;
  rise?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uTint = gl.getUniformLocation(prog, "uTint");
    const uAmt = gl.getUniformLocation(prog, "uAmt");
    const uRise = gl.getUniformLocation(prog, "uRise");
    gl.uniform3fv(uTint, hexToRgb(tint));
    gl.uniform1f(uAmt, amount);
    gl.uniform1f(uRise, rise);

    const small = window.matchMedia("(max-width: 700px)").matches;
    const scale = small ? 0.35 : 0.5;
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduced = isReducedMotion();
    let raf = 0;
    let visible = false;
    let last = 0;
    const t0 = performance.now() - 40000; // start mid-drift so the first frame isn't blank
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return; // ~30fps is plenty for smoke
      last = now;
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const draw = () => {
      gl.uniform1f(uTime, 40);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduced) raf = requestAnimationFrame(frame);
      else if (visible) draw();
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      // No loseContext() here: StrictMode remounts reuse the same canvas, and a
      // lost context would stay lost. Only two fields exist and they live for the page.
    };
  }, [tint, amount, rise]);

  return <canvas ref={ref} className={`inkfield ${className ?? ""}`} aria-hidden />;
}
