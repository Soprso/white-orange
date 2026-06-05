import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Magnetic from "./Magnetic";

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
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

  // Image fade in/out for slideshow
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
        relative
        flex-shrink-0
        w-[85vw]
        max-w-[1100px]
        h-[80vh]
        mr-12
        last:mr-24
        bg-[#0a0a0a]
        rounded-[32px]
        overflow-hidden
        border
        border-zinc-800
        flex
        flex-col
        p-6
        md:p-10
      "
    >
      {/* Header Metadata */}
      <div className="flex justify-between items-start mb-6 shrink-0">
        <p className="text-zinc-500 tracking-[0.35em] text-xs uppercase">
          Section {project.id}
        </p>
        <p className="text-zinc-500 tracking-[0.35em] text-xs uppercase">
          {project.year}
        </p>
      </div>

      {/* Screenshot (Landscape Framing) */}
      <div
        ref={imageRef}
        className="
          w-full 
          aspect-video
          overflow-hidden 
          rounded-2xl
          bg-zinc-900/30
          mb-8
          relative
          flex items-center justify-center
          shrink-0
        "
      >
        <img
          src={project.images[currentImage]}
          alt={`${project.title} - view ${currentImage + 1}`}
          loading="lazy"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Footer Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 md:gap-8 items-end mt-auto overflow-y-auto">
        {/* Title */}
        <div>
          <h3
            className="
              font-heading
              text-4xl
              sm:text-5xl
              md:text-6xl
              xl:text-7xl
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
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-sm mb-6">
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
                  text-[10px]
                  md:text-xs
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
                  className="text-zinc-400 hover:text-white transition-colors text-xs md:text-sm uppercase tracking-widest"
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
                  className="text-zinc-400 hover:text-white transition-colors text-xs md:text-sm uppercase tracking-widest"
                >
                  GitHub ↗
                </a>
              </Magnetic>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;