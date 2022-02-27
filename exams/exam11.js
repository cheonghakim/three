import * as THREE from "three";
import Stats from "stats.js";
import dat from "dat.gui";
import gsap from "gsap";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import KeyController from "./KeyController";

export default function exam() {
  const canvas = document.querySelector("#canvas");
  if (!canvas) return new Error("Can't find canvas element!");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  //FPS 스탯 초기화
  const stats = new Stats();
  document.body.append(stats.domElement);

  //카메라, 씬, 시간, 초기화
  const camera = getPerspectiveCamera();
  const scene = new THREE.Scene();
  scene.add(camera);

  //카메라 컨트롤러 추가, user gesture 필요
  const controls = new PointerLockControls(camera, renderer.domElement);

  //controls.domElement === renderer.domElement ***
  controls.domElement.addEventListener("click", () => {
    controls.lock();
  });

  controls.addEventListener("lock", () => {
    console.log("locked!");
  });

  controls.addEventListener("unlock", () => {
    console.log("unlocked!");
  });

  //키보드 컨트롤
  const keyController = new KeyController();

  function walk() {
    console.log("walking!");
    if (keyController.keys["KeyW"] || keyController.keys["ArrowUp"])
      controls.moveForward(0.05);
    else if (keyController.keys["KeyS"] || keyController.keys["ArrowDown"])
      controls.moveForward(-0.05);
    else if (keyController.keys["KeyA"] || keyController.keys["ArrowLeft"])
      controls.moveRight(-0.05);
    else if (keyController.keys["KeyD"] || keyController.keys["ArrowRight"])
      controls.moveRight(0.05);
  }

  //렌더러 사이즈, 배경, 픽셀비율에 따른 초기화
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearAlpha(0.5);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  //주 조명 추가
  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  //보조 조명 추가
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  //geometry, material 생성 및 데이터 초기화
  let material;
  let mesh;
  const geometries = [
    new THREE.BoxGeometry(),
    new THREE.SphereGeometry(),
    new THREE.CylinderGeometry(),
  ];
  for (let i = 0; i < 20; i += 1) {
    material = new THREE.MeshStandardMaterial({
      color: `rgb(${50 + Math.floor(Math.random() * 205)},${
        50 + Math.floor(Math.random() * 205)
      },${50 + Math.floor(Math.random() * 205)})`,
    });

    mesh = new THREE.Mesh(geometries[Math.floor(Math.random() * 3)], material);
    mesh.position.x = (Math.random() - 0.5) * 10;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 10;

    scene.add(mesh);
  }
  renderer.render(scene, camera);

  //애니메이션 실행
  draw();

  function draw() {
    stats.update();
    walk();
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  //resize 이벤트 콜백
  function resizing() {
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  //perspective 카메라 초기화 함수
  function getPerspectiveCamera() {
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = 1;
    camera.position.z = 20;
    camera.position.y = 1;
    camera.rotateX = 70;
    return camera;
  }

  window.addEventListener("resize", resizing);
}
