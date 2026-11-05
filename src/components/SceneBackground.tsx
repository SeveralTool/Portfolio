import { useEffect, useRef } from "react";
import * as THREE from "three";

const MAX_PIXEL_RATIO = 2;
const ROTATION_STEP = 0.0002;

export default function SceneBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / Math.max(window.innerHeight, 1),
      0.1,
      1000,
    );
    camera.position.set(7, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(7, 5);
    const material = new THREE.MeshBasicMaterial({
      color: "#000000",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    const positionAttr = geometry.getAttribute("position");
    const vertices: THREE.Vector3[] = [];
    for (let index = 0; index < positionAttr.count; index += 1) {
      vertices.push(
        new THREE.Vector3(
          positionAttr.getX(index),
          positionAttr.getY(index),
          positionAttr.getZ(index),
        ),
      );
    }

    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
    const pointsMaterial = new THREE.PointsMaterial({
      color: "#ffffff",
      size: 0.001,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: "rgb(15, 15, 15)" });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    scene.add(edges);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let running = false;

    const renderFrame = () => {
      if (!running) return;
      frameId = window.requestAnimationFrame(renderFrame);
      shape.rotation.x += ROTATION_STEP;
      shape.rotation.y += ROTATION_STEP;
      shape.rotation.z += ROTATION_STEP;
      points.position.copy(shape.position);
      points.quaternion.copy(shape.quaternion);
      points.scale.copy(shape.scale);
      edges.position.copy(shape.position);
      edges.quaternion.copy(shape.quaternion);
      edges.scale.copy(shape.scale);
      renderer.render(scene, camera);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frameId);
    };

    const start = () => {
      if (running || motionQuery.matches || document.hidden) return;
      running = true;
      renderFrame();
    };

    const onResize = () => {
      const width = window.innerWidth;
      const height = Math.max(window.innerHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
      renderer.setSize(width, height);
      renderer.render(scene, camera);
    };

    const onMotion = () => {
      if (motionQuery.matches) stop();
      else start();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    motionQuery.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    renderer.render(scene, camera);
    start();

    return () => {
      stop();
      motionQuery.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      edgesGeometry.dispose();
      edgesMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div id="back3d" ref={mountRef} aria-hidden="true" />;
}
