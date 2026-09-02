import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const VehicleHologram3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x7bd0ff, 1.8);
    directionalLight.position.set(5, 6, 5);
    scene.add(directionalLight);

    const cyanPoint = new THREE.PointLight(0x38bdf8, 2, 10);
    cyanPoint.position.set(0, 1, 0);
    scene.add(cyanPoint);

    // Car Body & Cabin
    const carGroup = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(3.6, 0.75, 1.8);
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0x1e293b,
      shininess: 120,
      specular: 0x7bd0ff,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    carGroup.add(body);

    const cabinGeo = new THREE.BoxGeometry(1.9, 0.6, 1.4);
    const cabinMat = new THREE.MeshPhongMaterial({
      color: 0x334155,
      shininess: 160,
      specular: 0x38bdf8,
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(-0.2, 0.65, 0);
    carGroup.add(cabin);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.22, 24);
    const wheelMat = new THREE.MeshPhongMaterial({ color: 0x090e17, shininess: 80 });
    const wheelPositions = [
      [1.1, -0.35, 0.85],
      [1.1, -0.35, -0.85],
      [-1.1, -0.35, 0.85],
      [-1.1, -0.35, -0.85],
    ];
    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(pos[0], pos[1], pos[2]);
      carGroup.add(wheel);
    });

    // Glowing Halo Podium (Rotating neon torus)
    const haloGeo = new THREE.TorusGeometry(2.6, 0.045, 16, 80);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x7bd0ff });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -0.55;
    carGroup.add(halo);

    scene.add(carGroup);

    camera.position.set(4.5, 2.5, 5.5);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      carGroup.rotation.y += 0.008;
      halo.rotation.z += 0.015;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
};
