import { useEffect, useRef } from "react";

type Density = {
  stars: number;
  parallaxIntensity?: number;
  maxSize?: number;
};

export const StarsBackground = ({ stars, parallaxIntensity = 0.6, maxSize = 2 }: Density) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameId = useRef<number | undefined>(undefined);
  const lastScrollY = useRef(0);

  // Generación de estrellas optimizada
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = window.innerWidth * 2.5;
    const height = window.innerHeight * 4;
    const starsCount = Math.min(stars, 10000);

    // Limpiar SVG de forma eficiente
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // DocumentFragment para mejor rendimiento
    const fragment = document.createDocumentFragment();

    // Generar estrellas en batch
    for (let i = 0; i < starsCount; i++) {
      const isSpecialStar = i % 30 === 0;
      const r = isSpecialStar 
        ? Math.random() * (maxSize * 0.5) + (maxSize * 0.5)
        : Math.random() * (maxSize * 0.3) + (maxSize * 0.1);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", (Math.random() * width).toString());
      circle.setAttribute("cy", (Math.random() * height).toString());
      circle.setAttribute("r", r.toString());
      circle.setAttribute("fill", isSpecialStar ? "#eeeeff" : "#ffeeee");
      
      fragment.appendChild(circle);
    }

    svg.appendChild(fragment);
  }, [stars, maxSize]);

  // Efecto Parallax optimizado
  useEffect(() => {
    const updateParallax = () => {
      animationFrameId.current = requestAnimationFrame(updateParallax);
      
      const scrollY = window.scrollY;
      if (Math.abs(scrollY - lastScrollY.current) > 0.5 && svgRef.current) {
        // Usamos transform3d para GPU acceleration
        svgRef.current.style.transform = `translate3d(-50%, calc(-50% - ${scrollY * parallaxIntensity}px), 0)`;
        lastScrollY.current = scrollY;
      }
    };

    animationFrameId.current = requestAnimationFrame(updateParallax);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [parallaxIntensity]);

  return (
    <svg
      ref={svgRef}
      id="bg-parallax"
      xmlns="http://www.w3.org/2000/svg"
      className="fixed top-1/2 left-1/2 w-[300vw] h-[300vh] -z-10 pointer-events-none"
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        perspective: "1000px"
      }}
    />
  );
};

export default StarsBackground;