import * as THREE from "three";
import Stats from "stats.js";
import dat from "dat.gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

/**
 * 조명 셋팅
 */

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

  //directional 추가
  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight
  );

  scene.add(directionalLightHelper);

  // 보조 조명 추가
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  //그리드 헬퍼 추가
  const gridHelper = new THREE.GridHelper();
  gridHelper.scale.set(3, 3, 3);
  scene.add(gridHelper);

  //geometry, material 생성 및 데이터 초기화
  const lineMaterial = new THREE.LineBasicMaterial({ color: "yellow" });
  const points = [];
  points.push(new THREE.Vector3(0, 0, 100));
  points.push(new THREE.Vector3(0, 0, -100));
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const guide = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(guide);

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: "plum" });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = "box";

  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshStandardMaterial({ color: "lime" });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.name = "torus";

  scene.add(boxMesh, torusMesh);

  //to render
  const clock = new THREE.Clock();
  const meshes = [boxMesh, torusMesh];
  const raycaster = new THREE.Raycaster();

  //애니메이션 실행
  draw();

  function draw() {
    stats.update();
    const time = clock.getElapsedTime();

    boxMesh.position.y = Math.sin(time) * 2;
    torusMesh.position.y = Math.cos(time) * 2;

    //렌더링 시 마다 색상 초기화
    boxMesh.material.color.set("plum");
    torusMesh.material.color.set("lime");

    //스타트 지점과 방향 설정, 방향 정규화
    const origin = new THREE.Vector3(0, 0, 100);
    const direction = new THREE.Vector3(0, 0, -100);
    direction.normalize();

    const intersects = raycaster.intersectObjects(meshes);
    intersects.forEach((item) => {
      // console.log(item.object.name);
      item.object.material.color.set("red");
    });

    raycaster.set(origin, direction);

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
