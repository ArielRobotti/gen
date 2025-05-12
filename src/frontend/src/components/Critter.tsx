import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

type GalaxySceneProps = {
  data: Uint8Array;
};

export const Critter: React.FC<GalaxySceneProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const pseudoRandom = (seed: number) =>
    Math.sin(seed * 1337.1) * 43758.5453 % 1;

  const convertToPoints = (data: Uint8Array): THREE.Vector3[] => {
    const vectors: THREE.Vector3[] = [];
    for (let i = 0; i + 2 < data.length; i += 3) {
      const x = (data[i] / 255) * 2 - 1;
      const y = (data[i + 1] / 255) * 2 - 1;
      const z = (data[i + 2] / 255) * 2 - 1;

      const index = i / 3;

      const dx = pseudoRandom(index) * 0.2 - 0.1;
      const dy = pseudoRandom(index + 1) * 0.2 - 0.1;
      const dz = pseudoRandom(index + 2) * 0.2 - 0.1;

      const final = new THREE.Vector3(x + dx, y + dy, z + dz)
        .normalize()
        .multiplyScalar(9.5 + pseudoRandom(index + 3) * 0.5);

      vectors.push(final);
    }
    return vectors;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const points = convertToPoints(data)

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x222222);
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      1000
    );
    camera.position.set(5, 8, 25);

    // const renderer = new THREE.WebGLRenderer();
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientWidth
    );
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;

    const gu = {
      time: { value: 0 },
    };

    const sizes: number[] = [];
    const shift: number[] = [];
    const pushShift = () => {
      shift.push(
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
        (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
        Math.random() * 0.9 + 0.1
      );
    };

    points.forEach(() => {
      sizes.push(Math.random() * 1.5 + 0.5);
      pushShift();
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setAttribute("sizes", new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute("shift", new THREE.Float32BufferAttribute(shift, 4));

    const material = new THREE.PointsMaterial({
      size: 0.3,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      color: 0xbbbbff
    } as THREE.PointsMaterialParameters);

    
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 8;
      canvas.height = 8;
      const ctx = canvas.getContext('2d')!;
      
      const gradient = ctx.createRadialGradient(4, 4, 0, 4, 4, 4);
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(1, 'rgba(30, 255, 0, 0.4)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(4, 4, 4, 0, Math.PI * 2);
      ctx.fill();
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };
    
    material.alphaMap = createCircleTexture();


    const pointsMesh = new THREE.Points(geometry, material);
    pointsMesh.rotation.order = "ZYX";
    pointsMesh.rotation.z = 0.2;
    scene.add(pointsMesh);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      const t = clock.getElapsedTime() * 0.5;
      gu.time.value = t * Math.PI;
      pointsMesh.rotation.y = t * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", onResize);

    return () => {
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [data]);

  return (
    <div className="w-full max-w-[500px] aspect-square mx-auto" 
      ref={containerRef}>

    </div>
  );
};
export default Critter
