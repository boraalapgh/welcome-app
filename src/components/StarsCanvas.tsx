import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import starGlbUrl from '../assets/star.glb?url';

interface StarsCanvasProps {
  isExiting: boolean;
}

// Star configuration - 3 stars with Y-axis rotation and vertical bobbing
const starConfigs = [
  {
    // Large star (primary) - positioned right
    size: 0.7,
    bobAmplitude: 0.03, // How much it moves up/down
    bobSpeed: 0.8,      // Speed of vertical movement
    bobPhase: 0,        // Phase offset for variation
    basePosition: { x: 0.22, y: -0.05 },
    rotationSpeed: 0.4, // Y-axis rotation speed
    isPrimary: true,
  },
  {
    // Medium star - upper left
    size: 0.5,
    bobAmplitude: 0.05,
    bobSpeed: 1.2,
    bobPhase: Math.PI * 0.65,
    basePosition: { x: -0.15, y: 0.18 },
    rotationSpeed: -0.6,
    isPrimary: false,
  },
  {
    // Small star - lower left
    size: 0.3,
    bobAmplitude: 0.04,
    bobSpeed: 1.5,
    bobPhase: Math.PI * 1.5,
    basePosition: { x: -0.28, y: -0.28 },
    rotationSpeed: 0.8,
    isPrimary: false,
  },
];

// 30 degrees in radians - tilt angle from surface
const TILT_ANGLE = (30 * Math.PI) / 180;

async function loadStarModel(): Promise<THREE.Group> {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      starGlbUrl,
      (gltf) => {
        const model = gltf.scene;

        // Update world matrices to get accurate bounding box
        model.updateMatrixWorld(true);

        // Calculate bounding box in world space
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // Create a pivot group - rotation will happen around this group's origin
        const pivot = new THREE.Group();

        // Move each mesh's geometry so the overall center is at origin
        model.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            // Clone geometry to avoid affecting original
            child.geometry = child.geometry.clone();
            // Translate geometry to center it
            child.geometry.translate(-center.x, -center.y, -center.z);
          }
        });

        // Reset any position offset on the model
        model.position.set(0, 0, 0);

        // Normalize scale
        const normalizeScale = 1 / maxDim;
        model.scale.setScalar(normalizeScale);

        pivot.add(model);
        resolve(pivot);
      },
      undefined,
      (error) => reject(error)
    );
  });
}

export function StarsCanvas({ isExiting }: StarsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starsRef = useRef<THREE.Group[]>([]);
  const systemGroupRef = useRef<THREE.Group | null>(null);
  const exitProgressRef = useRef(0);
  const animationIdRef = useRef<number>(0);
  const isExitingRef = useRef(isExiting);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    if (!container) return;

    const size = container.offsetWidth;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Perspective camera for 3D view
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Add lighting for 3D model
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    // Create a group for the entire system
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);
    systemGroupRef.current = systemGroup;

    let cleanedUp = false;

    // Load GLB and create stars
    const initStars = async () => {
      try {
        const starModel = await loadStarModel();
        if (cleanedUp) return;

        const stars: THREE.Group[] = [];
        starConfigs.forEach((config, index) => {
          // Create a container for position and tilt
          const container = new THREE.Group();
          container.position.set(config.basePosition.x, config.basePosition.y, 0);

          // Apply 30-degree tilt on X-axis (tilted toward viewer)
          container.rotation.x = TILT_ANGLE;

          // Create a new pivot group for this star
          const pivot = new THREE.Group();

          // Deep clone and ensure each mesh has its own geometry
          const clonedModel = starModel.clone(true);
          clonedModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              // Clone geometry and material for each star
              child.geometry = child.geometry.clone();
              child.material = (child.material as THREE.Material).clone();
            }
          });

          pivot.add(clonedModel);
          pivot.scale.setScalar(config.size);

          // Add pivot to container
          container.add(pivot);

          container.userData = {
            ...config,
            initialScale: config.size,
            index,
            baseY: config.basePosition.y,
            starMesh: pivot, // Reference to pivot group for Y rotation
          };

          systemGroup.add(container);
          stars.push(container);
        });
        starsRef.current = stars;
      } catch (error) {
        console.error('Failed to load star GLB:', error);
      }
    };

    initStars();

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      starsRef.current.forEach((container) => {
        const config = container.userData;
        const starMesh = config.starMesh as THREE.Group;

        if (!isExitingRef.current) {
          // Y-axis rotation on the inner star (spinning around its own center)
          starMesh.rotation.y += config.rotationSpeed * 0.016; // ~60fps normalized

          // Container handles position - vertical bobbing motion
          const bobOffset = Math.sin(time * config.bobSpeed + config.bobPhase) * config.bobAmplitude;
          container.position.y = config.baseY + bobOffset;

          // Subtle breathing/pulse effect on the inner star
          const pulse = 1 + Math.sin(time * 2 + config.index * 1.5) * 0.04;
          starMesh.scale.setScalar(config.size * pulse);
        } else {
          // Exit animation - just fade out (no scaling to avoid canvas clipping)
          exitProgressRef.current += 0.008;
          const progress = Math.min(exitProgressRef.current, 1);

          // Smooth ease out
          const easeOut = 1 - Math.pow(1 - progress, 3);

          // Keep current scale (no growth)
          const pulse = 1 + Math.sin(time * 2 + config.index * 1.5) * 0.04;
          starMesh.scale.setScalar(config.size * pulse);

          // Keep bobbing motion
          const bobOffset = Math.sin(time * config.bobSpeed + config.bobPhase) * config.bobAmplitude;
          container.position.y = config.baseY + bobOffset;

          // Keep spinning
          starMesh.rotation.y += config.rotationSpeed * 0.016;

          // Fade out materials
          starMesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const mat = child.material as THREE.MeshStandardMaterial;
              mat.transparent = true;
              mat.depthWrite = false;
              mat.opacity = 1 - easeOut;
              mat.needsUpdate = true;
            }
          });
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const newSize = container.offsetWidth;
      renderer.setSize(newSize, newSize);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cleanedUp = true;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
      renderer.dispose();
    };
  }, []);

  // Handle exit animation trigger
  useEffect(() => {
    isExitingRef.current = isExiting;
    if (isExiting) {
      exitProgressRef.current = 0;
    }
  }, [isExiting]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10"
    />
  );
}
