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
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      // 1. Create the horizontal scroll effect
      const getScrollAmount = () => {
        let trackWidth = trackRef.current.scrollWidth;
        return -(trackWidth - window.innerWidth);
      };

      const horizontalTween = gsap.to(trackRef.current, {
        x: getScrollAmount,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${trackRef.current.scrollWidth - window.innerWidth}`,
        pin: true,
        animation: horizontalTween,
        scrub: 1,
        invalidateOnRefresh: true,
      });

      // 2. Typography Scrub Animations for Dividers
      const dividers = gsap.utils.toArray(".divider-card");
      
      dividers.forEach((divider, index) => {
        const chars = divider.querySelectorAll(".char-divider");
        
        // Randomize initial scattered state
        gsap.set(chars, {
          x: () => gsap.utils.random(-300, 300),
          y: () => gsap.utils.random(-300, 300),
          z: () => gsap.utils.random(-300, 300),
          rotationX: () => gsap.utils.random(-180, 180),
          rotationY: () => gsap.utils.random(-180, 180),
          rotationZ: () => gsap.utils.random(-90, 90),
          scale: () => gsap.utils.random(0.1, 2.5),
          opacity: 0,
        });

        if (index === 0) {
          // The first divider ("Featured Projects") is visible before horizontal scroll starts.
          // Assemble it as the user scrolls vertically down to it.
          gsap.to(chars, {
            x: 0, y: 0, z: 0,
            rotationX: 0, rotationY: 0, rotationZ: 0,
            scale: 1, opacity: 1,
            ease: "none",
            stagger: 0.05,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%", // Assemble as it enters viewport
              end: "top top",   // Fully assembled when pinned
              scrub: 1,
            }
          });
        } else {
          // Other dividers: Assemble as they enter from the right horizontally
          gsap.to(chars, {
            x: 0, y: 0, z: 0,
            rotationX: 0, rotationY: 0, rotationZ: 0,
            scale: 1, opacity: 1,
            ease: "none",
            stagger: 0.05,
            scrollTrigger: {
              trigger: divider,
              containerAnimation: horizontalTween,
              start: "left 90%", // Start assembling as it enters
              end: "center center", // Assembled when centered
              scrub: 1,
            }
          });
        }
      });
    },
    { scope: containerRef }
  );

  // Reusable component for the large typographic dividers
  const DividerCard = ({ label, title1, title2 }) => (
    <div className="divider-card flex-shrink-0 w-screen h-screen flex items-center justify-center px-6 mr-12 perspective-[1000px]">
      <div className="heading-group text-center">
        <p className="text-zinc-500 uppercase tracking-[0.4em] text-xs mb-6">
          {label}
        </p>
        <h2 className="font-heading uppercase leading-[0.85] tracking-[-0.06em] text-[15vw] sm:text-6xl md:text-8xl lg:text-[10rem]">
          <span className="block">
            {title1.split("").map((char, i) => (
              <span key={i} className="inline-block char-divider">{char === " " ? "\u00A0" : char}</span>
            ))}
          </span>
          <span className="block text-zinc-400 italic font-editorial lowercase -mt-4 sm:-mt-8">
            {title2.split("").map((char, i) => (
              <span key={i} className="inline-block char-divider">{char === " " ? "\u00A0" : char}</span>
            ))}
          </span>
        </h2>
      </div>
    </div>
  );

  return (
    <section 
      ref={containerRef} 
      id="projects" 
      className="relative z-20 bg-[#0a0a0a]"
    >
      {/* 
        The sticky wrapper that hides horizontal scrollbars and 
        contains the moving track 
      */}
      <div className="h-screen w-screen overflow-hidden">
        {/* 
          The horizontal track that moves left via GSAP 
        */}
        <div 
          ref={trackRef} 
          className="flex flex-row h-full w-max items-center will-change-transform pl-6 md:pl-24"
        >
          
          {/* Main Intro */}
          <DividerCard 
            label="Selected Work" 
            title1="Featured" 
            title2="Projects" 
          />

          {/* Client Projects Intro */}
          <DividerCard 
            label="Section 01" 
            title1="Client" 
            title2="work" 
          />

          {/* Client Projects Loop */}
          {clientProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}

          {/* Learning Projects Intro */}
          <DividerCard 
            label="Section 02" 
            title1="Learning" 
            title2="projects" 
          />

          {/* Learning Projects Loop */}
          {learningProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}

          {/* A blank spacer at the end so the last card doesn't touch the exact right edge */}
          <div className="flex-shrink-0 w-[10vw]" />

        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;