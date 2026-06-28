import React, { useEffect, useRef, useState } from 'react';

export default function ThreeJsBot() {
  const containerRef = useRef(null);
  const [threeLoaded, setThreeLoaded] = useState(false);

  useEffect(() => {
    // Check if THREE is already loaded
    if (window.THREE) {
      setThreeLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => {
      setThreeLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script if it hasn't loaded yet
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!threeLoaded || !containerRef.current) return;

    const THREE = window.THREE;
    const container = containerRef.current;
    const width = container.clientWidth || 250;
    const height = container.clientHeight || 250;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);

    const botGroup = new THREE.Group();

    // Metallic Head
    const headGeo = new THREE.IcosahedronGeometry(0.8, 2);
    const metallicMat = new THREE.MeshPhongMaterial({ 
      color: 0x6366F1, 
      specular: 0xffffff, 
      shininess: 150,
      transparent: true,
      opacity: 0.9
    });
    const head = new THREE.Mesh(headGeo, metallicMat);
    botGroup.add(head);

    // Glowing Eye Ring
    const ringGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const ring = new THREE.Mesh(ringGeo, glowMat);
    ring.position.z = 0.5;
    head.add(ring);

    // Floating Orbits
    const orbitGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const orbitGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const orbit = new THREE.Mesh(orbitGeo, glowMat);
      const angle = (i / 3) * Math.PI * 2;
      orbit.position.set(Math.cos(angle) * 1.3, Math.sin(angle) * 1.3, 0);
      orbitGroup.add(orbit);
    }
    botGroup.add(orbitGroup);

    scene.add(botGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xec4899, 2.5, 10);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 4.2;

    let reqId;
    function animate() {
      reqId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      
      botGroup.position.y = Math.sin(time) * 0.12;
      botGroup.rotation.y = time * 0.4;
      orbitGroup.rotation.z = -time * 0.6;
      orbitGroup.rotation.x = Math.sin(time) * 0.4;
      
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      const w = container.clientWidth || 250;
      const h = container.clientHeight || 250;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [threeLoaded]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[200px] flex items-center justify-center bg-transparent" />
  );
}
