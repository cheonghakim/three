import * as THREE from "https://cdn.skypack.dev/three";

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

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearAlpha(0.5);
  console.log(window.devicePixelRatio);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  scene.add(camera);

  const material = new THREE.MeshBasicMaterial({
    color: "red",
  });
  const geometry = new THREE.BoxGeometry();
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer.render(scene, camera);

  function resizing() {
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  function getOrthographicCamera() {
    const camera = new THREE.OrthographicCamera(
      -(window.innerWidth / window.innerHeight),
      window.innerWidth / window.innerHeight,
      -1,
      1,
      0.1,
      1000
    );
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
    camera.zoom(0.5);
    camera.updateProjectionMatrix();
    return camera;
  }

  function getPerspectiveCamera() {
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = 1;
    camera.position.z = 5;
    camera.position.y = 1;
    camera.rotateX = 70;
    return camera;
  }

  window.addEventListener("resize", resizing);
}
