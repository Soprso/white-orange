import Magnetic from "./Magnetic";

const Contact = () => {
  return (
    <div className="contact-overlay pointer-events-none absolute inset-0 z-20 flex flex-col px-6 py-8">
      
      {/* Top Spacer for perfect centering */}
      <div className="flex-1 min-h-[2rem]"></div>

      <div className="contact-content-wrapper pointer-events-auto flex flex-col items-center text-center shrink-0">

        {/* Main Editorial Typography */}
        <h2 className="contact-heading font-heading font-black text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-[-0.04em] uppercase text-white mb-10 sm:mb-16 flex flex-col items-center">
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
        <div className="contact-links-wrap flex flex-col sm:flex-row items-center gap-6 sm:gap-16">
          <div className="overflow-hidden">
            <Magnetic>
              <a
                href="mailto:ghoshsoumyadeep3@gmail.com"
                className="contact-link group relative inline-flex flex-col items-center gap-1 py-2"
              >
                <span className="text-sm tracking-[0.25em] uppercase text-zinc-300 group-hover:text-white transition-colors inline-flex items-center gap-3">
                  <span>Email</span>
                  <span className="contact-arrow inline-block transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">↗</span>
                </span>
                <span className="text-[0.6rem] tracking-[0.15em] text-zinc-600 transition-colors group-hover:text-zinc-400">
                  ghoshsoumyadeep3@gmail.com
                </span>
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
                className="contact-link group relative inline-flex flex-col items-center gap-1 py-2"
              >
                <span className="text-sm tracking-[0.25em] uppercase text-zinc-300 group-hover:text-white transition-colors inline-flex items-center gap-3">
                  <span>GitHub</span>
                  <span className="contact-arrow inline-block transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">↗</span>
                </span>
                <span className="text-[0.6rem] tracking-[0.15em] text-zinc-600 transition-colors group-hover:text-zinc-400">
                  github.com/Soprso
                </span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-700 origin-right scale-x-100 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0"></span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 delay-100"></span>
              </a>
            </Magnetic>
          </div>
        </div>

      </div>

      {/* Bottom Spacer pushes epilogue down */}
      <div className="flex-1 min-h-[2rem]"></div>

      {/* The Epilogue */}
      <div className="epilogue-wrapper w-full px-6 md:px-12 flex flex-col items-center pointer-events-none shrink-0 mt-auto">
        {/* The Rule */}
        <div className="epilogue-line w-full max-w-sm h-[1px] bg-zinc-800 mb-6 origin-center"></div>
        
        {/* The Closing Phrase */}
        <p className="epilogue-text text-zinc-500 uppercase tracking-[0.4em] text-[0.65rem] mb-4">
          Transmission Complete.
        </p>
        
        {/* The Signature */}
        <div className="epilogue-text flex items-center gap-3 text-zinc-600 text-[0.6rem] tracking-[0.2em] uppercase">
          <span>Soumyadeep Ghosh</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
          <span>2026</span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
