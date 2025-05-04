import { useEffect, useRef } from "react";

type ShootingStarsProps = {
  count?: number;
  parallaxIntensity?: number;
  size?: number;
  speed?: number;
};

export const ShootingStars = ({
  count = 8,
  parallaxIntensity = 0.2,
  size = 2,
  speed = 0.5
}: ShootingStarsProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const starsRef = useRef<Array<{
    element: SVGCircleElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    scale: number;
  }>>([]);

  // Inicializar estrellas
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const width = window.innerWidth * 3; // 3x el ancho para parallax
    const height = window.innerHeight * 3; // 3x el alto para parallax

    // Crear estrellas
    starsRef.current = Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 0.5 + Math.random() * speed;
      
      const star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      star.setAttribute("r", size.toString());
      star.setAttribute("fill", "white");
      
      // Posición inicial aleatoria en los bordes
      const edge = Math.floor(Math.random() * 4);
      const x = edge === 0 ? 0 : edge === 1 ? width : Math.random() * width;
      const y = edge === 2 ? 0 : edge === 3 ? height : Math.random() * height;
      
      star.setAttribute("cx", x.toString());
      star.setAttribute("cy", y.toString());
      
      svg.appendChild(star);
      
      return {
        element: star,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        scale: 0.2 + Math.random() * 0.8
      };
    });

    // Animación
    const animate = () => {
      const width = window.innerWidth * 3;
      const height = window.innerHeight * 3;
      
      starsRef.current.forEach(star => {
        // Mover estrella
        star.x += star.vx;
        star.y += star.vy;
        
        // Reiniciar si sale de la pantalla
        if (star.x < 0 || star.x > width || star.y < 0 || star.y > height) {
          star.x = Math.random() * width;
          star.y = Math.random() * height;
        }
        
        star.element.setAttribute("cx", star.x.toString());
        star.element.setAttribute("cy", star.y.toString());
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      starsRef.current.forEach(star => star.element.remove());
    };
  }, [count, size, speed]);

  // Efecto parallax (similar a AnimatedBG)
  useEffect(() => {
    const handleScroll = () => {
      if (!svgRef.current) return;
      const scrollY = window.scrollY;
      svgRef.current.style.transform = `translate3d(-50%, calc(-50% - ${scrollY * parallaxIntensity}px), 0)`;
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [parallaxIntensity]);

  return (
    <svg
      ref={svgRef}
      className="fixed top-1/2 left-1/2 w-[300vw] h-[300vh] -z-10 pointer-events-none"
      style={{
        transform: "translate3d(-50%, -50%, 0)",
        willChange: "transform"
      }}
    />
  );
};