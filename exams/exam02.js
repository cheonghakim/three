import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "stats.js";
import dat from "dat.gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function exam() {
  const canvas = document.querySelector("#canvas");
  if (!canvas) return new Error("Can't find canvas element!");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  const camera = getPerspectiveCamera();
  const scene = new THREE.Scene();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearAlpha(0.5);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  scene.add(camera);

  const material = new THREE.MeshBasicMaterial({
    color: "red",
  });
  const geometry = new THREE.BoxGeometry();
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  renderer.render(scene, camera);

  const stats = new Stats();
  document.body.append(stats.domElement);
  const clock = new THREE.Clock();

  function draw() {
    stats.update();
    const time = clock.getDelta();
    mesh.rotation.y = time * 500;
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function resizing() {
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  function getPerspectiveCamera() {
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = 1;
    camera.position.z = 5;
    camera.position.y = 1;
    camera.rotateX = 70;
    return camera;
  }

  window.addEventListener("resize", resizing);

  draw();
}
