import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Magnetic from "./Magnetic";

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);

  // Determine if there is a video in the images array
  const videoSrc = project.images.find(img => img.endsWith(".mp4"));
  const imageArray = project.images.filter(img => !img.endsWith(".mp4"));

  // Slideshow (only if no video and multiple images exist)
  useEffect(() => {
    if (videoSrc || imageArray.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === imageArray.length - 1 ? 0 : prev + 1
      );
    }, 3500);
    return () => clearInterval(interval);
  }, [project, videoSrc, imageArray.length]);

  // Image fade in/out for slideshow
  useGSAP(
    () => {
      if (videoSrc || !imageRef.current) return;
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
    [currentImage, videoSrc]
  );

  return (
    <article
      ref={cardRef}
      className="
        group
        relative
        flex-shrink-0
        w-[85vw]
        sm:w-[60vw]
        md:w-[45vw]
        lg:w-[30vw]
        max-w-[450px]
        h-[75vh]
        md:h-[80vh]
        mr-8
        md:mr-12
        last:mr-24
        bg-[#0a0a0a]
        rounded-[32px]
        overflow-hidden
        border
        border-zinc-800
      "
    >
      {/* ========================================= */}
      {/* 1. EDGE-TO-EDGE MEDIA                     */}
      {/* ========================================= */}
      <div className="absolute inset-0 w-full h-full" ref={imageRef}>
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={imageArray[currentImage]}
            alt={`${project.title} - view`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* ========================================= */}
      {/* 2. PERSISTENT BOTTOM GRADIENT             */}
      {/* Ensures users always know what the card   */}
      {/* is before hovering/tapping.               */}
      {/* ========================================= */}
      <div className="absolute inset-x-0 bottom-0 p-8 pt-32 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-500 group-hover:opacity-0 pointer-events-none">
        <p className="text-zinc-400 tracking-[0.35em] text-[10px] uppercase mb-2">
          Section {project.id} — {project.year}
        </p>
        <h3 className="font-heading text-4xl sm:text-5xl uppercase leading-[0.85] tracking-tight text-white drop-shadow-md">
          {project.title}
        </h3>
      </div>

      {/* ========================================= */}
      {/* 3. HOVER REVEAL OVERLAY                   */}
      {/* Contains full project details.            */}
      {/* ========================================= */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col p-8 pointer-events-none group-hover:pointer-events-auto">
        
        {/* Header Metadata */}
        <div className="flex justify-between items-start shrink-0 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
          <p className="text-zinc-500 tracking-[0.35em] text-[10px] uppercase">
            Section {project.id}
          </p>
          <p className="text-zinc-500 tracking-[0.35em] text-[10px] uppercase">
            {project.year}
          </p>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="font-heading text-4xl sm:text-5xl xl:text-6xl uppercase leading-[0.85] tracking-[-0.05em] mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 text-white">
            {project.title}
          </h3>
          
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="
                  px-3
                  py-1
                  border
                  border-zinc-800
                  rounded-full
                  text-[10px]
                  text-zinc-300
                "
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex gap-6 shrink-0 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-300">
          {project.live && (
            <Magnetic>
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors text-xs uppercase tracking-widest flex items-center gap-2"
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
                className="text-zinc-400 hover:text-white transition-colors text-xs uppercase tracking-widest flex items-center gap-2"
              >
                GitHub ↗
              </a>
            </Magnetic>
          )}
        </div>

      </div>
    </article>
  );
};

export default ProjectCard;