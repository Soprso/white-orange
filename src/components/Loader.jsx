import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Loader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const initialsRef = useRef(null);
  const ruleRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // Phase 1: Inhale
      // Initials fade in, letter-spacing widens
      tl.to(initialsRef.current, {
        opacity: 1,
        letterSpacing: "0.3em",
        duration: 0.5,
        ease: "power2.out",
      });

      // Phase 2: Hold
      // Thin horizontal rule fades in beneath initials
      tl.to(ruleRef.current, {
        scaleX: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      // Phase 3: Exhale
      // Initials and rule dissolve, spacing continues widening
      tl.to(
        initialsRef.current,
        {
          opacity: 0,
          letterSpacing: "0.6em",
          duration: 0.6,
          ease: "power2.inOut",
        },
        "+=0.1",
      );

      tl.to(
        ruleRef.current,
        {
          opacity: 0,
          scaleX: 0,
          duration: 0.4,
          ease: "power2.inOut",
        },
        "<",
      );

      // Phase 4: Curtain lift
      // Loader slides upward to reveal the Hero beneath
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.5,
        ease: "power3.inOut",
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-[#0a0a0a]
      "
    >
      <div className="text-center">
        {/* Initials */}
        <div
          ref={initialsRef}
          className="
            font-heading
            font-medium
            uppercase
            text-3xl
            md:text-4xl
            tracking-[-0.04em]
            text-zinc-300
            opacity-0
            select-none
          "
        >
          S&thinsp;G
        </div>

        {/* Horizontal Rule */}
        <div
          ref={ruleRef}
          className="
            mt-4
            mx-auto
            h-px
            w-16
            bg-zinc-600
            opacity-0
            scale-x-0
          "
        />
      </div>
    </div>
  );
};

export default Loader;