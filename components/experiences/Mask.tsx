"use client";

import { useId } from "react";

const FACE =
  "M200 18 C292 18 356 92 360 206 C364 318 330 412 276 470 C250 498 226 516 200 518 C174 516 150 498 124 470 C70 412 36 318 40 206 C44 92 108 18 200 18 Z";
const EYE_L = "M92 226 C110 198 160 194 186 222 C162 242 114 246 92 226 Z";
const EYE_R = "M308 226 C290 198 240 194 214 222 C238 242 286 246 308 226 Z";

const SPLIT: [number, number][] = [
  [200, 10],
  [206, 48],
  [194, 80],
  [204, 112],
  [196, 150],
  [206, 186],
  [199, 214],
  [203, 250],
  [195, 288],
  [205, 330],
  [198, 370],
  [204, 400],
  [196, 440],
  [203, 480],
  [200, 530],
];

const toPath = (pts: [number, number][]) => "M" + pts.map((p) => p.join(" ")).join(" L");

export const cracksLeft = [
  toPath([
    [194, 80],
    [160, 70],
    [132, 86],
    [104, 76],
    [74, 98],
  ]),
  toPath([
    [104, 76],
    [96, 52],
    [112, 36],
  ]),
  toPath([
    [195, 288],
    [160, 302],
    [130, 292],
    [98, 320],
    [66, 314],
  ]),
  toPath([
    [196, 440],
    [170, 454],
    [150, 484],
  ]),
  toPath([
    [130, 292],
    [126, 330],
    [104, 356],
  ]),
];

export const cracksRight = [
  toPath([
    [206, 186],
    [238, 162],
    [270, 152],
    [304, 128],
    [334, 132],
  ]),
  toPath([
    [270, 152],
    [284, 178],
    [322, 190],
  ]),
  toPath([
    [205, 330],
    [240, 344],
    [262, 374],
    [298, 382],
  ]),
  toPath([
    [262, 374],
    [268, 412],
    [290, 436],
  ]),
];

export const splitPath = toPath(SPLIT);

function FaceArt({ uid }: { uid: string }) {
  return (
    <>
      <path d={FACE} fill={`url(#${uid}-porcelain)`} />
      <path d={FACE} fill={`url(#${uid}-shade)`} />
      <path d={FACE} fill="none" stroke="rgba(40,30,20,.18)" strokeWidth="1.2" />
      {/* brows */}
      <path d="M90 188 C118 170 160 168 186 184" fill="none" stroke="rgba(60,48,36,.28)" strokeWidth="2" strokeLinecap="round" />
      <path d="M310 188 C282 170 240 168 214 184" fill="none" stroke="rgba(60,48,36,.28)" strokeWidth="2" strokeLinecap="round" />
      {/* eyes are holes into whatever is behind */}
      <path d={EYE_L} className="mask-eye" />
      <path d={EYE_R} className="mask-eye" />
      <path d={EYE_L} fill="none" stroke="rgba(40,30,20,.35)" strokeWidth="1.2" />
      <path d={EYE_R} fill="none" stroke="rgba(40,30,20,.35)" strokeWidth="1.2" />
      {/* nose */}
      <path d="M200 238 C197 282 188 318 182 334 C192 344 208 344 218 334" fill="none" stroke="rgba(60,48,36,.22)" strokeWidth="1.6" strokeLinecap="round" />
      {/* mouth: closed, composed */}
      <path d="M158 404 C178 396 192 398 200 402 C208 398 222 396 242 404 C222 414 178 414 158 404 Z" fill="rgba(150,110,95,.22)" />
      <path d="M158 404 C178 396 192 398 200 402 C208 398 222 396 242 404" fill="none" stroke="rgba(70,48,40,.35)" strokeWidth="1.3" strokeLinecap="round" />
    </>
  );
}

function Defs({ uid }: { uid: string }) {
  const left = `M0 0 L${SPLIT.map((p) => p.join(" ")).join(" L")} L0 540 Z`;
  const right = `M400 0 L${SPLIT.map((p) => p.join(" ")).join(" L")} L400 540 Z`;
  return (
    <defs>
      <radialGradient id={`${uid}-porcelain`} cx="46%" cy="36%" r="72%">
        <stop offset="0" stopColor="#fdfbf6" />
        <stop offset=".55" stopColor="#efe9df" />
        <stop offset=".85" stopColor="#d9d0c1" />
        <stop offset="1" stopColor="#bfb4a3" />
      </radialGradient>
      <radialGradient id={`${uid}-shade`} cx="50%" cy="100%" r="80%">
        <stop offset=".4" stopColor="rgba(0,0,0,0)" />
        <stop offset="1" stopColor="rgba(60,40,20,.18)" />
      </radialGradient>
      <radialGradient id={`${uid}-void`} cx="50%" cy="45%" r="55%">
        <stop offset="0" stopColor="#5a230c" />
        <stop offset=".35" stopColor="#1a0d08" />
        <stop offset="1" stopColor="#0a0807" />
      </radialGradient>
      <clipPath id={`${uid}-face`}>
        <path d={FACE} />
      </clipPath>
      <clipPath id={`${uid}-left`}>
        <path d={left} />
      </clipPath>
      <clipPath id={`${uid}-right`}>
        <path d={right} />
      </clipPath>
      <filter id={`${uid}-gold`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/** The cracking persona of Chapter I. Halves and cracks are animated by the parent. */
export function CrackingMask() {
  const uid = useId().replace(/[:«»]/g, "");
  return (
    <svg viewBox="0 0 400 540" className="mask-svg" role="img" aria-label="A porcelain mask, cracking">
      <Defs uid={uid} />
      <ellipse cx="200" cy="270" rx="120" ry="215" className="mask-behind" fill={`url(#${uid}-void)`} />
      <g className="mask-half mask-half--l">
        <g clipPath={`url(#${uid}-left)`}>
          <FaceArt uid={uid} />
        </g>
        <g clipPath={`url(#${uid}-face)`}>
          {cracksLeft.map((d, i) => (
            <path key={i} d={d} pathLength={1} className="mask-crack" />
          ))}
          <path d={splitPath} pathLength={1} className="mask-crack mask-crack--main" />
        </g>
      </g>
      <g className="mask-half mask-half--r">
        <g clipPath={`url(#${uid}-right)`}>
          <FaceArt uid={uid} />
        </g>
        <g clipPath={`url(#${uid}-face)`}>
          {cracksRight.map((d, i) => (
            <path key={i} d={d} pathLength={1} className="mask-crack" />
          ))}
          <path d={splitPath} pathLength={1} className="mask-crack mask-crack--main" />
        </g>
      </g>
    </svg>
  );
}

/** The returning persona: whole again, cracks filled with gold, held on a baton. */
export function KintsugiMask() {
  const uid = useId().replace(/[:«»]/g, "");
  return (
    <svg viewBox="-40 0 520 760" className="kintsugi-svg" role="img" aria-label="The same mask, repaired with gold, held on a slender rod">
      <Defs uid={uid} />
      <line x1="318" y1="430" x2="430" y2="748" className="kintsugi-rod" />
      <circle cx="430" cy="748" r="5" className="kintsugi-rod-end" />
      <g transform="rotate(-9 200 270)">
        <FaceArt uid={uid} />
        <g filter={`url(#${uid}-gold)`} clipPath={`url(#${uid}-face)`} className="kintsugi-gold">
          <path d={splitPath} pathLength={1} />
          {[...cracksLeft, ...cracksRight].map((d, i) => (
            <path key={i} d={d} pathLength={1} />
          ))}
        </g>
      </g>
    </svg>
  );
}
