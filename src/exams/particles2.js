import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

/**
 * 파티클2-vertex 속성 변경
 */

export default function exam() {
  const canvas = document.querySelector("#canvas");
  if (!canvas) return new Error("Can't find canvas element!");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    // alpha: true,
    antialias: true,
  });

  // 카메라, 씬, 시간, 초기화
  const camera = getPerspectiveCamera();
  const scene = new THREE.Scene();
  scene.add(camera);

  //카메라 컨트롤러 추가, user gesture 필요
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  //렌더러 사이즈, 배경, 픽셀비율에 따른 초기화
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  //directional 추가
  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // 보조 조명 추가
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  //그리드 헬퍼 추가
  const gridHelper = new THREE.GridHelper();
  gridHelper.scale.set(3, 3, 3);
  scene.add(gridHelper);

  //메시 생성
  const geometry = new THREE.BufferGeometry();
  const count = 1000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  //texture load
  const textureLoader = new THREE.TextureLoader();
  const particleTex = textureLoader.load("/images/star.png");
  const material = new THREE.PointsMaterial({
    size: 0.2,
    map: particleTex,
    transparent: true,
    depthWrite: false,
    alphaMap: particleTex,
    vertexColors: true,
  });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  //애니메이션 실행
  draw();

  function draw() {
    controls.update();
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
