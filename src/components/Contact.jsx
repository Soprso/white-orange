import React from "react";
import Magnetic from "./Magnetic";

const Contact = () => {
  return (
    <div className="contact-overlay pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
      <div className="contact-content-wrapper pointer-events-auto flex flex-col items-center text-center">


        {/* Main Editorial Typography */}
        <h2 className="contact-heading font-heading text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-[-0.04em] uppercase text-white mb-16 flex flex-col items-center">
          <span className="block overflow-hidden pb-2">
            <span className="contact-line block">LET'S BUILD</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span className="contact-line contact-italic font-editorial italic font-normal text-zinc-400 lowercase block -mt-2">
              something
            </span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span className="contact-line block">MEMORABLE.</span>
          </span>
        </h2>

        {/* Action Links */}
        <div className="contact-links-wrap flex flex-col sm:flex-row items-center gap-8 sm:gap-16">
          <div className="overflow-hidden">
            <Magnetic>
              <a
                href="mailto:ghoshsoumyadeep3@gmail.com"
                className="contact-link group relative inline-flex items-center gap-3 text-sm tracking-[0.25em] uppercase text-zinc-300 hover:text-white transition-colors py-2"
              >
                <span>Email</span>
                <span className="contact-arrow inline-block transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">↗</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-700 origin-right scale-x-100 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0"></span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 delay-100"></span>
              </a>
            </Magnetic>
          </div>

          <div className="overflow-hidden">
            <Magnetic>
              <a
                href="https://github.com/Soprso"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link group relative inline-flex items-center gap-3 text-sm tracking-[0.25em] uppercase text-zinc-300 hover:text-white transition-colors py-2"
              >
                <span>GitHub</span>
                <span className="contact-arrow inline-block transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">↗</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-700 origin-right scale-x-100 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0"></span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 delay-100"></span>
              </a>
            </Magnetic>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
