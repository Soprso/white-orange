import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Magnetic from "./Magnetic";
import resumePDF from "../assets/resume.pdf";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      // -----------------------------
      // Entrance Animation
      // -----------------------------
      // Set hidden state immediately (runs before first paint)
      // to prevent flash of visible content.

      gsap.set(".hero-line", { y: 80, opacity: 0 });
      gsap.set(".hero-nav", { opacity: 0, y: 20 });

      gsap.delayedCall(0.2, () => {
        const tl = gsap.timeline();

        tl.to(".hero-line", {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        }).to(
          ".hero-nav",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.4",
        );
      });

      // -----------------------------
      // Scroll-Linked Dissolve Exit
      // -----------------------------
      // "Crafting" floats upward, "Experiences" sinks downward,
      // nav links fade out — all scrubbed to scroll position.

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
          0,
        )
        .to(
          ".hero-line-experiences",
          {
            y: 60,
            opacity: 0,
            ease: "none",
          },
          0,
        )
        .to(
          ".hero-nav",
          {
            opacity: 0,
            y: 20,
            ease: "none",
          },
          0.2,
        );
    },
    { scope: containerRef },
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
      {/* Name */}

      <div
        className="
          absolute
          top-8
          left-8
          uppercase
          tracking-[0.3em]
          text-xs
          text-zinc-600
        "
      >
        Soumyadeep Ghosh
      </div>

      <div className="text-center">
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
            Crafting
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
          >
            Experiences
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
              href={resumePDF}
              download="Soumyadeep_Ghosh_Resume.pdf"
              className="hover:text-white transition-colors"
            >
              Resume
            </a>
          </Magnetic>

          <Magnetic>
            <a href="#projects" className="hover:text-white transition-colors">
              Projects
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="https://www.linkedin.com/in/soumyadeep-ghosh-8a3440407/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};

export default Hero;
