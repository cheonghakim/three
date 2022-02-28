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

  //보조 조명 추가
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  //그리드 헬퍼 추가
  const gridHelper = new THREE.GridHelper();
  gridHelper.scale.set(3, 3, 3);
  scene.add(gridHelper);

  //loading manager 생성
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log("로딩 시작");
  };
  loadingManager.onProgress = (img) => {
    console.log(`${img} 로드`);
  };
  loadingManager.onLoad = () => {
    console.log("로드 완료");
  };
  loadingManager.onError = (err) => {
    console.log(err);
  };

  //텍스쳐 로더 생성
  const textureLoader = new THREE.TextureLoader(loadingManager);

  //텍스쳐 생성
  const rightTex = textureLoader.load("/textures/mcstyle/right.png");
  const leftTex = textureLoader.load("/textures/mcstyle/left.png");
  const topTex = textureLoader.load("/textures/mcstyle/top.png");
  const bottomTex = textureLoader.load("/textures/mcstyle/bottom.png");
  const frontTex = textureLoader.load("/textures/mcstyle/front.png");
  const backTex = textureLoader.load("/textures/mcstyle/back.png");
  const gradientTex = textureLoader.load("/textures/gradient.png");

  const materials = [
    new THREE.MeshBasicMaterial({ map: rightTex }),
    new THREE.MeshBasicMaterial({ map: leftTex }),
    new THREE.MeshBasicMaterial({ map: topTex }),
    new THREE.MeshBasicMaterial({ map: bottomTex }),
    new THREE.MeshBasicMaterial({ map: frontTex }),
    new THREE.MeshBasicMaterial({ map: backTex }),
  ];

  rightTex.magFilter = THREE.NearestFilter;
  leftTex.magFilter = THREE.NearestFilter;
  topTex.magFilter = THREE.NearestFilter;
  bottomTex.magFilter = THREE.NearestFilter;
  frontTex.magFilter = THREE.NearestFilter;
  backTex.magFilter = THREE.NearestFilter;
  gradientTex.magFilter = THREE.NearestFilter;

  //geometry, material 생성 및 데이터 초기화
  const box = new THREE.BoxGeometry(2, 2, 2);
  const cone = new THREE.ConeGeometry(1, 2, 18);
  const cartoonMaterial = new THREE.MeshToonMaterial({
    color: "plum",
    gradientMap: gradientTex,
  });
  const blockMesh = new THREE.Mesh(box, materials);
  const cartoonMesh = new THREE.Mesh(cone, cartoonMaterial);
  //포지션 설정
  cartoonMesh.position.set(-2, 1, 0);
  blockMesh.position.set(2, 1, 0);
  scene.add(blockMesh, cartoonMesh);

  renderer.render(scene, camera);

  //애니메이션 실행
  draw();

  function draw() {
    stats.update();
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
