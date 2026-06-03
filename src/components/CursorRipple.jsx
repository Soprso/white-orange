import { useEffect } from "react";
import gsap from "gsap";

const CursorRipple = () => {
  useEffect(() => {
    const handleClick = (e) => {
      const ripple = document.createElement("span");

      ripple.className = "cursor-ripple";

      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;

      document.body.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 0.5,
        },
        {
          scale: 6,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
};

export default CursorRipple;