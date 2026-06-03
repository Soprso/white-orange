import { useRef } from "react";
import gsap from "gsap";

const Magnetic = ({ children, className = "" }) => {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;

    const { left, top, width, height } = el.getBoundingClientRect();

    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);

    gsap.to(el, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1,0.3)",
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default Magnetic;