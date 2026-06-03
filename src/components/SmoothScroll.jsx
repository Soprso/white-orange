import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    // -------------------------------------------------------------------
    // Drive Lenis through gsap.ticker — the required integration for
    // ScrollTrigger scrub + pin to stay in sync with eased scroll position.
    // Without this, pinned sections drift and scrub animations stutter.
    // -------------------------------------------------------------------
    const onTick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0); // prevent lag compensation from fighting Lenis

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;