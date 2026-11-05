import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";

const MAX_PIXEL_RATIO = 2;
const LINE_WIDTH = 0.4;

export default function SceneBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 0, 7.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const radius = 3.15;
    const geometry = new THREE.IcosahedronGeometry(radius, 2);
    const edges = new THREE.EdgesGeometry(geometry);
    const source = edges.getAttribute("position");
    const doubled = new Float32Array(source.count * 6);
    const start = new THREE.Vector3();
    const end = new THREE.Vector3();
    const mid = new THREE.Vector3();
    let write = 0;
    for (let index = 0; index < source.count; index += 2) {
      start.set(source.getX(index), source.getY(index), source.getZ(index));
      end.set(source.getX(index + 1), source.getY(index + 1), source.getZ(index + 1));
      mid.copy(start).add(end).multiplyScalar(0.5).normalize().multiplyScalar(radius);
      doubled.set([start.x, start.y, start.z, mid.x, mid.y, mid.z], write);
      write += 6;
      doubled.set([mid.x, mid.y, mid.z, end.x, end.y, end.z], write);
      write += 6;
    }
    const lineGeometry = new LineSegmentsGeometry();
    lineGeometry.setPositions(doubled);
    const wireMaterial = new LineMaterial({
      color: 0x9ec4ff,
      linewidth: LINE_WIDTH,
      transparent: true,
      opacity: 1,
      worldUnits: false,
    });
    const wire = new LineSegments2(lineGeometry, wireMaterial);
    group.add(wire);

    const unique = new Map<string, THREE.Vector3>();
    for (let index = 0; index < doubled.length; index += 3) {
      const vertex = new THREE.Vector3(doubled[index], doubled[index + 1], doubled[index + 2]);
      unique.set(`${vertex.x.toFixed(3)}|${vertex.y.toFixed(3)}|${vertex.z.toFixed(3)}`, vertex);
    }
    const pointsGeometry = new THREE.BufferGeometry().setFromPoints([...unique.values()]);
    const pointsMaterial = new THREE.PointsMaterial({
      color: "#ffffff",
      size: 0.022,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(points);

    let last = performance.now();

    const resize = () => {
      const width = window.innerWidth;
      const height = Math.max(window.innerHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const compact = width < 800;
      group.scale.setScalar(compact ? 2.05 : 2.7);
      group.position.set(compact ? -5.6 : -8.5, -0.15, 0);
      wireMaterial.resolution.set(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
      renderer.setSize(width, height);
    };

    renderer.setAnimationLoop(() => {
      const now = performance.now();
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      group.rotation.y += delta * 0.1575;
      group.rotation.x += delta * 0.042;
      renderer.render(scene, camera);
    });

    const fade = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.7), 1);
      const opacity = 1 - progress * 0.84;
      wireMaterial.opacity = opacity;
      pointsMaterial.opacity = opacity;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", fade, { passive: true });
    resize();
    fade();

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", fade);
      geometry.dispose();
      edges.dispose();
      lineGeometry.dispose();
      wireMaterial.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div id="back3d" ref={mountRef} aria-hidden="true" />;
}
