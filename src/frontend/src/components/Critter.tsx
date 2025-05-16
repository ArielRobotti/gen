import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

type GalaxySceneProps = {
  data: Uint8Array;
};

export const Critter: React.FC<GalaxySceneProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getColorHiContrast = (r: number, g: number, b: number, contrast: number) => {
    const avg = (r + g + b) / 3;
    const newR = Math.min(255, Math.max(0, avg + (r - avg) * contrast))
    const newG = Math.min(255, Math.max(0, avg + (g - avg) * contrast));
    const newB = Math.min(255, Math.max(0, avg + (b - avg) * contrast));
    return `rgba(${newR}, ${newG}, ${newB}, 1)`
  }
  
  const centerColor = getColorHiContrast(data[4]/2, data[14]/2, data[16]/2, 1.5);
  const finalColor = getColorHiContrast(data[405], data[784], data[455], 2);

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
      size: 0.6,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      color: 'rgb(200, 230, 255)',
    } as THREE.PointsMaterialParameters);


    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16
      canvas.height = 16
      const ctx = canvas.getContext('2d')!;

      const gradient = ctx.createRadialGradient(2, 2, 0, 4, 4, 4);
      gradient.addColorStop(0, 'rgb(39, 248, 32)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 00)');

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

    // Crear geometría de la esfera central
    const sphereGeometry = new THREE.SphereGeometry(2, 64);

    // Crear material estilo plasma (puedes cambiar color e intensidad aquí)


    

    // Crear canvas y contexto
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No se pudo obtener el contexto del canvas');

    // Crear gradiente radial
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, centerColor); // Color dinámico en el centro
    gradient.addColorStop(1, finalColor); // Transición hacia transparente

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Crear textura desde el canvas
    const emissiveTexture = new THREE.CanvasTexture(canvas);

    // Crear material con emissiveMap
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x000000), // oscuro para resaltar el brillo
      emissive: new THREE.Color(0xffffff), // blanco, usamos el mapa para definir forma
      emissiveMap: emissiveTexture,
      emissiveIntensity: 2.5,
      metalness: 0.6,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.9,
    });

    // Crear la malla y agregarla a la escena
    const centralSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    centralSphere.position.set(0, 0, 0);
    scene.add(centralSphere);

    // Añadir una luz para que se vea el efecto físico
    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      const t = clock.getElapsedTime() * 2.5;
      gu.time.value = t * Math.PI;
      pointsMesh.rotation.y = t * 0.05;
      renderer.render(scene, camera);
      const scale = 1 + Math.sin(t * 2) * 0.125;
      centralSphere.scale.set(scale, scale, scale);


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
    <div 
      className={`w-full max-w-[500px] aspect-square mx-auto`}
      ref={containerRef}
      style={{
        filter: `drop-shadow(0px 0px 10px rgba(241, 244, 245,1)`
      }}
    >

    </div>
  );
};
export default Critter
