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
  const directionalLight = new THREE.DirectionalLight("white", 0);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight
  );

  scene.add(directionalLightHelper);

  //spotLight 추가
  const spotLight = new THREE.SpotLight();
  spotLight.position.x = -5;
  spotLight.position.y = 3;
  scene.add(spotLight);

  const spotLightHelper = new THREE.SpotLightHelper(spotLight);

  scene.add(spotLightHelper);

  //rectAreaLight 추가
  const rectAreaLight = new THREE.RectAreaLight("orange", 0, 2, 2);
  // light.position.x = -5;
  rectAreaLight.position.y = 2;
  rectAreaLight.position.z = 3;
  scene.add(rectAreaLight);

  const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
  scene.add(rectAreaLightHelper);

  //HemisphereLight 추가
  const hemisphereLight = new THREE.HemisphereLight("red", "blue", 0);
  hemisphereLight.position.x = -5;
  hemisphereLight.position.y = 3;
  scene.add(hemisphereLight);

  const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphereLight
  );
  scene.add(hemisphereLightHelper);

  // 보조 조명 추가
  const ambientLight = new THREE.AmbientLight("white", 0.0);
  scene.add(ambientLight);

  //그리드 헬퍼 추가
  const gridHelper = new THREE.GridHelper();
  gridHelper.scale.set(3, 3, 3);
  scene.add(gridHelper);

  //geometry, material 생성 및 데이터 초기화
  const geometry = new THREE.BoxGeometry();
  const planeGeometry = new THREE.PlaneGeometry(10, 10, 16);
  const basicMaterial = new THREE.MeshBasicMaterial({
    color: "gold",
  });
  const standardMaterial = new THREE.MeshStandardMaterial({
    color: "gold",
    roughness: 1,
    metalness: 1,
  });
  const lambertMaterial = new THREE.MeshLambertMaterial({
    color: "gold",
  });
  const phongMaterial = new THREE.MeshPhongMaterial({
    color: "gold",
    shininess: 1,
  });
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: "gray",
  });

  const basicMesh = new THREE.Mesh(geometry, basicMaterial);
  const standardMesh = new THREE.Mesh(geometry, standardMaterial);
  const lambertMesh = new THREE.Mesh(geometry, lambertMaterial);
  const phongMesh = new THREE.Mesh(geometry, phongMaterial);
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

  //포지션 설정
  basicMesh.position.set(-4, 1, 0);
  standardMesh.position.set(-2, 1, 0);
  lambertMesh.position.set(0, 1, 0);
  phongMesh.position.set(2, 1, 0);
  planeMesh.rotation.x = -Math.PI * 0.5;

  scene.add(basicMesh, standardMesh, lambertMesh, phongMesh, planeMesh);

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
    //intensity
    gui.add(directionalLight, "intensity", 0, 1, 0.1).name("directionalLight");
    gui.add(ambientLight, "intensity", 0, 1, 0.1).name("ambientLight");
    gui.add(hemisphereLight, "intensity", 0, 1, 0.1).name("hemisphereLight");
    gui.add(rectAreaLight, "intensity", 0, 1, 0.1).name("rectAreaLight");
    gui.add(spotLight, "intensity", 0, 1, 0.1).name("spotLight");
    //position
    gui
      .add(directionalLight.position, "x", -20, 20, 0.1)
      .name("directionalLight x");
    gui
      .add(directionalLight.position, "y", -20, 20, 0.1)
      .name("directionalLight y");
    gui
      .add(directionalLight.position, "z", -20, 20, 0.1)
      .name("directionalLight z");

    gui.add(ambientLight.position, "x", -20, 20, 0.1).name("ambientLight x");
    gui.add(ambientLight.position, "y", -20, 20, 0.1).name("ambientLight y");
    gui.add(ambientLight.position, "z", -20, 20, 0.1).name("ambientLight z");

    gui
      .add(hemisphereLight.position, "x", -20, 20, 0.1)
      .name("hemisphereLight x");
    gui
      .add(hemisphereLight.position, "y", -20, 20, 0.1)
      .name("hemisphereLight y");
    gui
      .add(hemisphereLight.position, "z", -20, 20, 0.1)
      .name("hemisphereLight z");

    gui.add(rectAreaLight.position, "x", -20, 20, 0.1).name("rectAreaLight x");
    gui.add(rectAreaLight.position, "y", -20, 20, 0.1).name("rectAreaLight y");
    gui.add(rectAreaLight.position, "z", -20, 20, 0.1).name("rectAreaLight z");

    gui.add(spotLight.position, "x", -20, 20, 0.1).name("spotLight x");
    gui.add(spotLight.position, "y", -20, 20, 0.1).name("spotLight y");
    gui.add(spotLight.position, "z", -20, 20, 0.1).name("spotLight z");
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
