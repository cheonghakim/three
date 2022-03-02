import { Sphere, Body, Vec3 } from "cannon-es";

import { Mesh } from "three";

export default class GetSphere {
  constructor(info) {
    this.scene = info.scene;
    this.cannonWorld = info.cannonWorld;
    this.geometry = info.geometry;
    this.material = info.material;
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scale = info.scale;

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.scale.set(this.scale, this.scale, this.scale);
    this.mesh.castShadow = true;
    this.scene.add(this.mesh);

    this.setRigidBody();
  }

  setRigidBody() {
    this.cannonBody = new Body({
      mass: 1,
      position: new Vec3(this.x, this.y, this.z),
      shape: new Sphere(0.5 * this.scale),
    });

    this.cannonWorld.addBody(this.cannonBody);
  }
}
