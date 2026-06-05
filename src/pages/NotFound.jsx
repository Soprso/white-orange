import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "../components/Magnetic";

const NotFound = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.set(".notfound-line", { yPercent: 40, opacity: 0 });
      gsap.set(".notfound-link", { opacity: 0, y: 12 });

      gsap.delayedCall(0.15, () => {
        const tl = gsap.timeline();

        tl.to(".notfound-line", {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
        }).to(
          ".notfound-link",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        );
      });
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
        flex-col
        items-center
        justify-center
        px-6
        bg-[#0a0a0a]
      "
    >
      {/* Name — same as Hero */}
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
            tracking-[-0.05em]
            mb-12
          "
        >
          <span className="notfound-line block font-black uppercase text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] text-white">
            THIS PAGE
          </span>
          <span className="notfound-line block font-editorial italic text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] text-zinc-400 -mt-1">
            doesn't exist.
          </span>
        </h1>

        <div className="notfound-link">
          <Magnetic>
            <Link
              to="/"
              className="
                text-zinc-500
                hover:text-white
                transition-colors
                text-xs
                uppercase
                tracking-[0.3em]
              "
            >
              ← Back to portfolio
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
