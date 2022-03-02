import { Vec3, Body, Box } from "cannon-es";

export default class Domino {
  constructor(info) {
    this.index = info.index;
    this.scene = info.scene;
    this.cannonWorld = info.cannonWorld;
    this.width = info.width || 0.6;
    this.height = info.height || 1;
    this.depth = info.depth || 0.2;
    this.x = info.x || 0;
    this.y = info.y || 0.5;
    this.z = info.z || 0;
    this.rotationY = info.rotationY || 0;

    info.gltfLoader.load("/models/domino.glb", (glb) => {
      this.modelMesh = glb.scene.children[0];
      this.modelMesh.name = `${this.index}번 도미노`;
      this.modelMesh.castShadow = true;
      this.modelMesh.position.set(this.x, this.y, this.z);
      this.scene.add(this.modelMesh);

      this.setRigidBody();
    });
  }
  setRigidBody() {
    this.cannonBody = new Body({
      mass: 1,
      position: new Vec3(this.x, this.y, this.z),
      shape: new Box(new Vec3(this.width / 2, this.height / 2, this.depth / 2)),
    });
    // y축 회전
    this.cannonBody.quaternion.setFromAxisAngle(
      new Vec3(0, 1, 0),
      this.rotationY
    );
    //ratCaster 에서 사용
    this.modelMesh.cannonBody = this.cannonBody;
    this.cannonWorld.addBody(this.cannonBody);
  }
}
