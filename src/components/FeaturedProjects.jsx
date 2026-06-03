import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ProjectCard from "./ProjectCard";
import {
  clientProjects,
  learningProjects,
} from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

const FeaturedProjects = () => {
  const sectionRef = useRef(null);

  // -----------------------------
  // Editorial Heading Reveals
  // -----------------------------
  // Each heading group reveals line-by-line from behind
  // an overflow-hidden mask. Labels fade in first,
  // then heading lines slide up with stagger.

  useGSAP(
    () => {
      const groups = gsap.utils.toArray(".heading-group");

      groups.forEach((group) => {
        const label = group.querySelector(".label-reveal");
        const lines = group.querySelectorAll(".heading-reveal");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: group,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        // Label fades in first
        if (label) {
          tl.from(label, {
            opacity: 0,
            y: 12,
            duration: 0.6,
            ease: "power3.out",
          });
        }

        // Heading lines slide up from below the mask
        tl.from(
          lines,
          {
            yPercent: 110,
            duration: 1,
            stagger: 0.12,
            ease: "power4.out",
          },
          label ? "-=0.3" : 0,
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="
        relative
        z-20
        px-6
      "
    >
      {/* ===================== */}
      {/* Intro */}
      {/* ===================== */}

      <div
        className="
          max-w-7xl
          mx-auto
          min-h-[80vh]
          flex
          items-center
        "
      >
        <div className="heading-group">
          <p
            className="
              label-reveal
              text-zinc-500
              uppercase
              tracking-[0.4em]
              text-xs
              mb-6
            "
          >
            Selected Work
          </p>

          <h2
            className="
              font-heading
              uppercase
              leading-[0.85]
              tracking-[-0.06em]
              text-5xl
              sm:text-6xl
              md:text-8xl
              lg:text-[10rem]
            "
          >
            <span className="block overflow-hidden">
              <span className="heading-reveal block">Featured</span>
            </span>
            <span className="block overflow-hidden">
              <span className="heading-reveal block">Projects</span>
            </span>
          </h2>
        </div>
      </div>

      {/* ===================== */}
      {/* CLIENT WORK DIVIDER */}
      {/* ===================== */}

      <div
        className="
          max-w-7xl
          mx-auto
          min-h-[70vh]
          flex
          items-center
        "
      >
        <div className="heading-group">
          <p
            className="
              label-reveal
              text-zinc-600
              uppercase
              tracking-[0.4em]
              text-xs
              mb-4
            "
          >
            Section 01
          </p>

          <h2
            className="
              font-heading
              uppercase
              leading-[0.85]
              tracking-[-0.06em]
              text-5xl
              sm:text-6xl
              md:text-8xl
              lg:text-[9rem]
            "
          >
            <span className="block overflow-hidden">
              <span className="heading-reveal block">Client</span>
            </span>
            <span className="block overflow-hidden">
              <span className="heading-reveal block">Work</span>
            </span>
          </h2>
        </div>
      </div>

      {/* ===================== */}
      {/* CLIENT PROJECTS */}
      {/* ===================== */}

      <div className="relative w-full">
        {clientProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            isLast={index === clientProjects.length - 1}
          />
        ))}
      </div>

      {/* ===================== */}
      {/* LEARNING DIVIDER */}
      {/* ===================== */}

      <div
        className="
          max-w-7xl
          mx-auto
          min-h-[70vh]
          flex
          items-center
        "
      >
        <div className="heading-group">
          <p
            className="
              label-reveal
              text-zinc-600
              uppercase
              tracking-[0.4em]
              text-xs
              mb-4
            "
          >
            Section 02
          </p>

          <h2
            className="
              font-heading
              uppercase
              leading-[0.85]
              tracking-[-0.06em]
              text-5xl
              sm:text-6xl
              md:text-8xl
              lg:text-[9rem]
            "
          >
            <span className="block overflow-hidden">
              <span className="heading-reveal block">Learning</span>
            </span>
            <span className="block overflow-hidden">
              <span className="heading-reveal block">Projects</span>
            </span>
          </h2>
        </div>
      </div>

      {/* ===================== */}
      {/* LEARNING PROJECTS */}
      {/* ===================== */}

      <div className="relative w-full pb-[100vh]">
        {learningProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            isLast={index === learningProjects.length - 1}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;