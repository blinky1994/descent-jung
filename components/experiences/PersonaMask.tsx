"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CrackingMask } from "./Mask";
import { personaRoles } from "@/content/extras";
import { isReducedMotion, isTouch } from "@/lib/motion";

export default function PersonaMask() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cracks = q(".mask-crack:not(.mask-crack--main)");
      const mains = q(".mask-crack--main");

      if (isReducedMotion()) {
        gsap.set([...cracks, ...mains], { strokeDashoffset: 0 });
        gsap.set(q(".persona-caption"), { autoAlpha: 1 });
        return;
      }

      gsap.set([...cracks, ...mains], { strokeDashoffset: 1 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });
      tl.to(mains, { strokeDashoffset: 0, duration: 0.3 }, 0.08);
      cracks.forEach((c, i) => tl.to(c, { strokeDashoffset: 0, duration: 0.12 }, 0.14 + i * 0.045));
      q(".persona-role").forEach((r, i) => {
        tl.to(r, { y: "+=70", autoAlpha: 0, filter: "blur(6px)", duration: 0.1, ease: "power1.in" }, 0.16 + i * 0.05);
      });
      tl.to(q(".mask-half--l"), { x: -26, rotate: -4, transformOrigin: "50% 60%", duration: 0.25 }, 0.62)
        .to(q(".mask-half--r"), { x: 26, rotate: 4, transformOrigin: "50% 60%", duration: 0.25 }, 0.62)
        .to(q(".mask-behind"), { opacity: 1, duration: 0.25 }, 0.6)
        .to(q(".persona-caption"), { autoAlpha: 1, y: 0, duration: 0.12 }, 0.82)
        .to({}, { duration: 0.06 });

      if (!isTouch()) {
        const tilt = q(".persona-tilt")[0];
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 1.2, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 1.2, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          ry(nx * 16);
          rx(-ny * 12);
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      }
    },
    { scope: root },
  );

  return (
    <div ref={root} className="persona-stage">
      <div className="persona-pin">
        <div className="persona-roles" aria-hidden>
          {personaRoles.map((r, i) => {
            const a = (i / personaRoles.length) * Math.PI * 2 - Math.PI / 2 + 0.3;
            return (
              <span
                key={r}
                className="persona-role"
                style={{ "--x": Math.cos(a).toFixed(3), "--y": Math.sin(a).toFixed(3) } as React.CSSProperties}
              >
                {r}
              </span>
            );
          })}
        </div>
        <div className="persona-tilt">
          <CrackingMask />
        </div>
        <p className="persona-caption">What is left when the role is taken away?</p>
      </div>
    </div>
  );
}
