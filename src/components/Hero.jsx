import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Magnetic from "./Magnetic";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);

  useGSAP(
    () => {
      // =================================================================
      // INITIAL STATES — everything invisible
      // =================================================================

      gsap.set(".char-crafting", { 
        opacity: 0, 
        y: () => gsap.utils.random(-60, 60),
        x: () => gsap.utils.random(-20, 20),
        rotation: () => gsap.utils.random(-25, 25),
        scale: () => gsap.utils.random(0.8, 1.2)
      });
      gsap.set(".hero-line-crafting", { opacity: 1, y: 0 });
      gsap.set(".char-experiences", { 
        opacity: 0, 
        x: () => gsap.utils.random(-150, 150),
        y: () => gsap.utils.random(-150, 200),
        z: () => gsap.utils.random(-300, 300),
        rotationX: () => gsap.utils.random(-180, 180),
        rotationY: () => gsap.utils.random(-180, 180),
        rotationZ: () => gsap.utils.random(-45, 45),
        scale: () => gsap.utils.random(0.2, 2.5),
        transformOrigin: "50% 50%"
      });
      gsap.set(".hero-line-experiences", { opacity: 1, yPercent: 0 });
      gsap.set(".hero-nav", { opacity: 0, y: 20 });
      gsap.set(".hero-name", { opacity: 0 });

      // =================================================================
      // THE CONTINUOUS TIMELINE
      //
      // Phase 1 — "Crafting" materializes alone in the void (the loader)
      // Phase 2 — The Hero assembles around it
      //
      // There is no loader. There is no hero entrance.
      // There is one continuous experience.
      // =================================================================

      const tl = gsap.timeline({
        onComplete: () => {
          // ScrollTrigger exits are deferred until the entrance finishes.
          // This prevents scrub animations from fighting the entrance.
          setupScrollExit();
        },
      });

      // -----------------------------------------------------------------
      // PHASE 1: THE LOADER
      // "Crafting" appears. Alone. Center of a black void.
      // -----------------------------------------------------------------

      // 0.2s — "Crafting" letters assemble dynamically from random positions
      tl.to(
        ".char-crafting",
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: {
            amount: 0.4,
            from: "random"
          }
        },
        0.2
      );

      // -----------------------------------------------------------------
      // PHASE 2: THE HERO ASSEMBLES
      // The overlay dissolves early. "Experiences" enters.
      // -----------------------------------------------------------------

      // 0.8s — Overlay dissolves (overlaps with Crafting finishing)
      tl.to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        0.8
      );

      // 1.0s — "Experiences" letters warp, flip, and bounce into place
      tl.to(
        ".char-experiences",
        {
          opacity: 1,
          x: 0,
          y: 0,
          z: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          scale: 1,
          duration: 1.5,
          ease: "back.out(2)",
          stagger: {
            each: 0.04,
            from: "random"
          }
        },
        1.0
      );

      // 1.4s — Name fades in
      tl.to(
        ".hero-name",
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        1.4
      );

      // 1.6s — Nav links fade in
      tl.to(
        ".hero-nav",
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        1.6
      );

      // Remove overlay from DOM entirely
      tl.set(overlayRef.current, { display: "none" });

      // =================================================================
      // SCROLL-LINKED EXIT (deferred)
      // =================================================================

      function setupScrollExit() {
        const exitTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        exitTl
          .to(
            ".hero-line-crafting",
            {
              y: -60,
              opacity: 0,
              ease: "none",
            },
            0
          )
          .to(
            ".hero-line-experiences",
            {
              y: 60,
              opacity: 0,
              ease: "none",
            },
            0
          )
          .to(
            ".hero-nav",
            {
              opacity: 0,
              y: 20,
              ease: "none",
            },
            0.2
          );
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="
        relative
        min-h-screen
        flex
        items-center
        justify-center
        px-6
      "
    >
      {/* ============================================================= */}
      {/* Loader Overlay                                                  */}
      {/* Full-viewport black screen that dissolves during Phase 2.       */}
      {/* Covers everything below the Hero during the entrance sequence.  */}
      {/* ============================================================= */}
      <div
        ref={overlayRef}
        className="
          fixed
          inset-0
          z-[9999]
          bg-[#0a0a0a]
        "
      />

      {/* Name — top-left branding */}
      <div
        className="
          hero-name
          absolute
          top-8
          left-8
          z-[10000]
          uppercase
          tracking-[0.3em]
          text-xs
          text-zinc-600
        "
      >
        Soumyadeep Ghosh
      </div>

      {/* ============================================================= */}
      {/* Main Content                                                    */}
      {/* z-[10000] places this above the overlay so "Crafting"           */}
      {/* is visible during the loader phase while the overlay is opaque. */}
      {/* ============================================================= */}
      <div className="relative z-[10000] text-center">
        <h1
          className="
            font-heading
            leading-[0.9]
            tracking-[-0.07em]
          "
        >
          <span
            className="
              hero-line
              hero-line-crafting
              font-editorial
              italic
              block
              text-5xl
              md:text-7xl
              lg:text-[7rem]
              text-zinc-500
            "
          >
            {"Crafting".split("").map((char, index) => (
              <span key={index} className="inline-block char-crafting">
                {char}
              </span>
            ))}
          </span>

          <span
            className="
              hero-line
              hero-line-experiences
              block
              font-black
              uppercase
              text-6xl
              md:text-8xl
              lg:text-[10rem]
            "
            style={{ perspective: "1000px" }}
          >
            {"Experiences".split("").map((char, index) => (
              <span key={index} className="inline-block char-experiences">
                {char}
              </span>
            ))}
          </span>
        </h1>

        <div
          className="
            hero-nav
            mt-12
            flex
            items-center
            justify-center
            gap-8
            text-sm
            uppercase
            tracking-[0.25em]
            text-zinc-500
          "
        >
          <Magnetic>
            <a
              href="/Resume.pdf"
              download="Soumyadeep_Ghosh_Resume.pdf"
              className="group relative inline-flex flex-col items-center gap-1 py-1"
            >
              <span className="text-sm tracking-[0.2em] text-zinc-500 uppercase group-hover:text-white transition-colors inline-flex items-center gap-2">
                Resume <span>↓</span>
              </span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-700 origin-right scale-x-100 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0"></span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 delay-100"></span>
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="#projects"
              className="group relative inline-flex flex-col items-center gap-1 py-1"
            >
              <span className="text-sm tracking-[0.2em] text-zinc-500 uppercase group-hover:text-white transition-colors">
                Projects
              </span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-700 origin-right scale-x-100 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0"></span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 delay-100"></span>
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="https://www.linkedin.com/in/soumyadeep-ghosh-8a3440407/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex flex-col items-center gap-1 py-1"
            >
              <span className="text-sm tracking-[0.2em] text-zinc-500 uppercase group-hover:text-white transition-colors inline-flex items-center gap-2">
                LinkedIn <span className="inline-block transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-700 origin-right scale-x-100 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0"></span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 delay-100"></span>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};

export default Hero;
