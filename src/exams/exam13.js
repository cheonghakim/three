import * as THREE from "three";
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
  const scene = new THREE.Scene();
  scene.add(camera);

  //카메라 컨트롤러 추가, user gesture 필요
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

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight
  );

  scene.add(directionalLightHelper);

  //보조 조명 추가
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  //그리드 헬퍼 추가
  const gridHelper = new THREE.GridHelper();
  gridHelper.scale.set(3, 3, 3);
  scene.add(gridHelper);

  //텍스쳐 로더 생성
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(
    "/textures/stone.jpg",
    () => console.log("로드 완료"),
    () => console.log("로드 중"),
    (err) => console.log(err.path[0].src)
  );

  //texture 변환
  texture.wrapT = THREE.RepeatWrapping;
  texture.wrapS = THREE.RepeatWrapping;
  // texture.offset.x = 0.3;
  // texture.offset.y = 0.3;
  texture.rotation = THREE.MathUtils.degToRad(45);
  texture.center.x = 0.5;
  texture.center.y = 0.5;

  //geometry, material 생성 및 데이터 초기화
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const standardMaterial = new THREE.MeshStandardMaterial({
    map: texture,
  });
  const standardMesh = new THREE.Mesh(geometry, standardMaterial);

  //포지션 설정
  standardMesh.position.set(0, 1, 0);
  scene.add(standardMesh);

  renderer.render(scene, camera);

  //애니메이션 실행
  draw();

  //gui 생성
  const gui = makeGUI();

  function draw() {
    stats.update();
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function makeGUI() {
    const gui = new dat.GUI();
    gui.add(directionalLight.position, "x", -20, 20, 0.1).name("light x");
    gui.add(directionalLight.position, "y", -20, 20, 0.1).name("light y");
    gui.add(directionalLight.position, "z", -20, 20, 0.1).name("light z");
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
    camera.position.z = 20;
    camera.position.y = 1;
    camera.rotateX = 70;
    return camera;
  }

  window.addEventListener("resize", resizing);
}
