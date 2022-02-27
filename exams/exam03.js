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

  const group1 = new THREE.Group();
  const box1 = new THREE.Mesh(geometry, material);

  const group2 = new THREE.Group();
  const box2 = box1.clone();
  box2.scale.set(0.3, 0.3, 0.3);
  group2.position.x = 2;
  const group3 = new THREE.Group();
  const box3 = box2.clone();
  box3.scale.set(0.15, 0.15, 0.15);
  group3.position.x = 1;

  group3.add(box3);
  group2.add(box2, group3);
  group1.add(box1, group2);
  scene.add(group1);

  renderer.render(scene, camera);

  const stats = new Stats();
  document.body.append(stats.domElement);
  const clock = new THREE.Clock();

  const gui = new dat.GUI();
  gui.add(camera.position, "x", -5, 5, 0.1).name("camera x");
  gui.add(camera.position, "y", -5, 5, 0.1).name("camera y");
  gui.add(camera.position, "z", 2, 10, 0.1).name("camera z");
  gui
    .add(
      camera.rotation,
      "x",
      THREE.MathUtils.degToRad(-180),
      THREE.MathUtils.degToRad(90),
      THREE.MathUtils.degToRad(1)
    )
    .name("camera x");
  gui
    .add(
      camera.rotation,
      "y",
      THREE.MathUtils.degToRad(-180),
      THREE.MathUtils.degToRad(90),
      THREE.MathUtils.degToRad(1)
    )
    .name("camera y");
  gui
    .add(
      camera.rotation,
      "z",
      THREE.MathUtils.degToRad(-180),
      THREE.MathUtils.degToRad(90),
      THREE.MathUtils.degToRad(1)
    )
    .name("camera z");

  function draw() {
    stats.update();
    const time = clock.getDelta();

    group1.rotation.y += time;
    group2.rotation.y += time;
    group3.rotation.y += time;

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
