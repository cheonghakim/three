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

  //FPS 스탯 초기화
  const stats = new Stats();
  document.body.append(stats.domElement);

  //카메라, 씬, 시간, 초기화
  const camera = getPerspectiveCamera();
  scene.add(camera);
  const scene = new THREE.Scene();
  const clock = new THREE.Clock();

  //카메라 컨트롤러 추가
  const controls = new OrbitControls(camera, renderer.domElement);

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

  //gui 생성
  const gui = makeGUI();

  //애니메이션 실행
  draw();

  function draw() {
    stats.update();
    // 지속적으로 증가하는 값이 필요
    const time = clock.getElapsedTime() * 3;

    //렌더링 될때 마다 sin 값에의해 일정한 범위 내의 랜덤 값으로 vertex position 변경
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
    camera.position.z = 35;
    camera.position.y = 1;
    camera.rotateX = 70;
    return camera;
  }

  window.addEventListener("resize", resizing);
}
