import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import PreventDragAndClick from "./PreventDragAndClick";
import * as CANNON from "cannon-es";
import Domino from "./Domino.js";
import * as THREE from "three";

/**
 * 물리엔진2
 */

export default function exam() {
  const canvas = document.querySelector("#canvas");
  if (!canvas) return new Error("Can't find canvas element!");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  // 카메라, 씬, 시간, 초기화
  const camera = getPerspectiveCamera();
  const scene = new THREE.Scene();
  scene.add(camera);

  //카메라 컨트롤러 추가, user gesture 필요
  const controls = new OrbitControls(camera, renderer.domElement);

  //렌더러 사이즈, 배경, 픽셀비율에 따른 초기화
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearAlpha(0.5);
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

  //물리엔진 추가
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0);
  //   cannonWorld.allowSleep = true; // body가 엄청 느려지면, simulating 안함
  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);

  //contact material
  const defaultMaterial = new CANNON.Material("default");

  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.003,
      restitution: 0.5,
    }
  );
  cannonWorld.defaultContactMaterial = defaultContactMaterial;

  //shape, rigid body 생성
  const floorBody = new CANNON.Body({
    mass: 0, //fixed object
    position: new CANNON.Vec3(0, 0, 0),
    material: defaultMaterial,
    shape: new CANNON.Plane(),
  });
  floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
  );
  cannonWorld.addBody(floorBody);

  //메시 생성
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "slategray",
    })
  );
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = -Math.PI * 0.5;
  scene.add(floorMesh);

  const dominos = [];
  let domino;
  for (let i = 0; i < 20; i++) {
    domino = new Domino({
      index: i,
      scene,
      cannonWorld,
      gltfLoader: new GLTFLoader(),
      z: -i * 0.8,
    });
    dominos.push(domino);
  }

  //렌더링시 시간을 얻을 객체
  const clock = new THREE.Clock();

  //애니메이션 실행
  draw();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;
    cannonWorld.step(cannonStepTime, delta, 3);

    dominos.forEach((item) => {
      item.modelMesh?.position.copy(item.cannonBody.position);
      item.modelMesh?.quaternion.copy(item.cannonBody.quaternion);
    });

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

  const rayCaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const preventDragAndClick = new PreventDragAndClick(canvas);

  function checkIntersects() {
    console.log(mouse);
    rayCaster.setFromCamera(mouse, camera);
    const mapped = dominos.map((item) => item.modelMesh);
    const intersects = rayCaster.intersectObjects(mapped);
    console.log(intersects);
    // for (const item of intersects) {
    //   if (item.object) {
    //     item.object.cannonBody.applyForce(
    //       new CANNON.Vec3(0, 0, -50),
    //       new CANNON.Vec3(0, 0, 0)
    //     );
    //     break;
    //   }
    // }

    if (intersects[0]) {
      intersects[0].object.cannonBody.applyForce(
        new CANNON.Vec3(0, 0, -100),
        new CANNON.Vec3(0, 0, 0)
      );
    }
  }
  window.addEventListener("resize", resizing);
  canvas.addEventListener("click", (evt) => {
    if (preventDragAndClick.mouseMoved) return;
    mouse.x = (evt.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((evt.clientY / canvas.clientHeight) * 2 - 1);
    checkIntersects();
  });
}
