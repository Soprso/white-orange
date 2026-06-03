import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Magnetic from "./Magnetic";

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, isLast }) => {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const overlayRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const bgTextRef = useRef(null);

  const [currentImage, setCurrentImage] = useState(0);

  // Slideshow
  useEffect(() => {
    if (!project?.images?.length || project.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }, 3500);
    return () => clearInterval(interval);
  }, [project]);

  useGSAP(
    () => {
      // 1. Entrance: Image clip-path reveal
      gsap.fromTo(
        imageRef.current,
        { clipPath: "inset(10% 10% 10% 10%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 90%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      // 2. Entrance: Title and info reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.from(titleRef.current, {
        yPercent: 110,
        duration: 1,
        ease: "power4.out",
      });

      const pills = cardRef.current.querySelectorAll(".tech-pill");
      if (pills.length) {
        tl.from(
          pills,
          {
            y: 20,
            opacity: 0,
            stagger: 0.05,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.6"
        );
      }

      // 3. Parallax: Oversized Background Text
      gsap.fromTo(
        bgTextRef.current,
        { yPercent: 20 },
        {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // 4. Stacking: Scale down and darken as next card covers this one
      if (!isLast) {
        gsap.fromTo(
          innerRef.current,
          { scale: 1 },
          {
            scale: 0.95,
            ease: "none",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          {
            opacity: 0.6,
            ease: "none",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      } else {
        // 5. Last Card Transition: Recede and fade text to reveal About section
        gsap.fromTo(
          innerRef.current,
          { scale: 1 },
          {
            scale: 0.95,
            ease: "none",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          {
            opacity: 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        gsap.to(bgTextRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: cardRef }
  );

  useGSAP(
    () => {
      if (!imageRef.current) return;
      const imgEl = imageRef.current.querySelector("img");
      if (imgEl) {
        gsap.fromTo(
          imgEl,
          { opacity: 0, scale: 1.05 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            overwrite: true,
          }
        );
      }
    },
    [currentImage]
  );

  return (
    <article
      ref={cardRef}
      className="
        sticky
        top-0
        h-screen
        w-full
        flex
        items-center
        justify-center
        py-8
      "
    >
      <div
        ref={innerRef}
        className="
          relative
          w-full
          h-full
          max-w-7xl
          mx-auto
          bg-[#0a0a0a]
          rounded-[32px]
          overflow-hidden
          border
          border-zinc-800
          flex
          flex-col
        "
      >
        {/* Overlay for depth stacking */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black z-50 pointer-events-none opacity-0"
        />

        {/* Oversized Background Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <span
            ref={bgTextRef}
            className="
              font-heading 
              font-black 
              uppercase 
              whitespace-nowrap 
              text-zinc-100 
              opacity-[0.04] 
              tracking-tighter
              text-[25vw]
              md:text-[18vw]
            "
          >
            {project.title}
          </span>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col h-full p-6 md:p-10">
          {/* Header Metadata */}
          <div className="flex justify-between items-start mb-6">
            <p className="text-zinc-500 tracking-[0.35em] text-xs uppercase">
              0{project.id}
            </p>
            <p className="text-zinc-500 tracking-[0.35em] text-xs uppercase">
              {project.year}
            </p>
          </div>

          {/* Screenshot */}
          <div
            ref={imageRef}
            className="
              flex-1 
              w-full 
              overflow-hidden 
              rounded-2xl
              bg-zinc-900/50
              mb-8
              relative
            "
          >
            <img
              src={project.images[currentImage]}
              alt={project.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Footer Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-end">
            {/* Title */}
            <div>
              <h3
                className="
                  font-heading
                  text-5xl
                  sm:text-6xl
                  md:text-7xl
                  xl:text-[5.5rem]
                  leading-[0.85]
                  tracking-[-0.05em]
                  uppercase
                "
              >
                <span className="block overflow-hidden pb-2">
                  <span ref={titleRef} className="block">
                    {project.title}
                  </span>
                </span>
              </h3>
            </div>

            {/* Details */}
            <div className="flex flex-col items-start lg:items-end text-left lg:text-right">
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 lg:justify-end mb-6">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="
                      tech-pill
                      px-3
                      py-1
                      border
                      border-zinc-800
                      rounded-full
                      text-xs
                      text-zinc-500
                    "
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-6">
                {project.live && (
                  <Magnetic>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors text-sm uppercase tracking-widest"
                    >
                      Visit Site ↗
                    </a>
                  </Magnetic>
                )}
                {project.github && (
                  <Magnetic>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors text-sm uppercase tracking-widest"
                    >
                      GitHub ↗
                    </a>
                  </Magnetic>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;