import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import ImagePanel from "./ImagePanel";
import gsap from "gsap";

/**
 * 파티클3 - vertex에 mesh 생성
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
  const planeGeometry = new THREE.PlaneGeometry(0.3, 0.3);
  const textureLoader = new THREE.TextureLoader();

  // Points 생성 및 저장
  const sphereGeometry = new THREE.SphereGeometry(1, 8, 8);
  const spherePositionArray = sphereGeometry.attributes.position.array;
  const randomPositionArray = [];
  for (let i = 0; i < spherePositionArray.length; i++) {
    randomPositionArray.push((Math.random() - 0.5) * 10);
  }

  // 여러개의 Plane Mesh 생성
  const imagePanels = [];
  let imagePanel;
  for (let i = 0; i < spherePositionArray.length; i += 3) {
    imagePanel = new ImagePanel({
      textureLoader,
      scene,
      geometry: planeGeometry,
      imageSrc: `/images/0${Math.ceil(Math.random() * 5)}.jpg`,
      x: spherePositionArray[i],
      y: spherePositionArray[i + 1],
      z: spherePositionArray[i + 2],
    });

    imagePanels.push(imagePanel);
  }

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

  function setShape(e) {
    const type = e.target.dataset.type;
    let array;
    switch (type) {
      case "random":
        array = randomPositionArray;
        break;
      case "sphere":
        array = spherePositionArray;
        break;
      default:
        break;
    }

    imagePanels.forEach((item, index) => {
      //rotation
      if (type === "sphere") {
        gsap.to(item.mesh.position, {
          duration: 0.7,
          x: array[index * 3],
          y: array[index * 3 + 1],
          z: array[index * 3 + 2],
        });
        gsap.to(item.mesh.rotation, {
          duration: 0.7,
          x: imagePanels[index].sphereRotationX,
          y: imagePanels[index].sphereRotationY,
          z: imagePanels[index].sphereRotationZ,
        });
      } else {
        gsap.to(item.mesh.position, {
          duration: 1.5,
          x: array[index * 3],
          y: array[index * 3 + 1],
          z: array[index * 3 + 2],
        });
        gsap.to(item.mesh.rotation, {
          duration: 1.5,
          x: 0,
          y: 0,
          z: 0,
        });
      }
    });
  }

  const btnWrapper = document.createElement("div");
  btnWrapper.classList.add("btns");

  const randomBtn = document.createElement("button");
  randomBtn.dataset.type = "random";
  randomBtn.style.cssText = "position: absolute; left: 20px; top: 20px";
  randomBtn.innerHTML = "Random";
  btnWrapper.append(randomBtn);

  const sphereBtn = document.createElement("button");
  sphereBtn.dataset.type = "sphere";
  sphereBtn.style.cssText = "position: absolute; left: 20px; top: 50px";
  sphereBtn.innerHTML = "Sphere";
  btnWrapper.append(sphereBtn);

  document.body.append(btnWrapper);
  btnWrapper.addEventListener("click", setShape);

  window.addEventListener("resize", resizing);
}
