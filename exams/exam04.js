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
  const clock = new THREE.Clock();
  const stats = new Stats();
  document.body.append(stats.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearAlpha(0.5);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  scene.add(camera);

  //light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  //mesh
  const geometry = new THREE.SphereGeometry(5, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: "orangered",
    side: THREE.DoubleSide,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  const positionArray = geometry.attributes.position.array;
  const randomArray = [];
  for (let i = 0; i < positionArray.length; i += 3) {
    positionArray[i] += (Math.random() - 0.5) * 0.2;
    positionArray[i + 1] += (Math.random() - 0.5) * 0.2;
    positionArray[i + 2] += (Math.random() - 0.5) * 0.2;
    randomArray[i] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 1] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 2] = (Math.random() - 0.5) * 0.2;
  }
  renderer.render(scene, camera);

  const gui = makeGUI();

  draw();

  function draw() {
    stats.update();
    const time = clock.getElapsedTime() * 3; // 지속적으로 증가하는 값이 필요
    for (let i = 0; i < positionArray.length; i += 3) {
      positionArray[i] += Math.sin(time + randomArray[i] * 100) * 0.001;
      positionArray[i + 1] += Math.sin(time + randomArray[i + 1] * 100) * 0.001;
      positionArray[i + 2] += Math.sin(time + randomArray[i + 2] * 100) * 0.001;
    }
    geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function makeGUI() {
    const gui = new dat.GUI();
    gui.add(camera.position, "x", -5, 5, 0.1).name("camera x");
    gui.add(camera.position, "y", -5, 5, 0.1).name("camera y");
    gui.add(camera.position, "z", 2, 100, 0.1).name("camera z");
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

    return gui;
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
    camera.position.z = 35;
    camera.position.y = 1;
    camera.rotateX = 70;
    return camera;
  }

  window.addEventListener("resize", resizing);
}
