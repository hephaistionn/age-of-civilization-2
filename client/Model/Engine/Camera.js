class Camera {

    constructor(config) {
        this.x = config.x||10; //camera position
        this.y = 12; //camera position
        this.z = config.z||10; //camera position
        this.iX = 0; //camera position before drag
        this.iZ = 0; //camera position before drag
        this.offsetX = -10; //target positio relative too camera position
        this.offsetY = -12; //target position relative to camera position
        this.offsetZ = -10; //target position relative to camera position
        this.targetX = this.x + this.offsetX;
        this.targetY = this.y + this.offsetY;
        this.targetZ = this.z + this.offsetZ;
        this.pressX = 0;
        this.pressZ = 0;
        this.speed = 0.001;
        this.maxXTarget = 0;
        this.maxZTarget = 0;
        this.minX = 0 - this.offsetX;
        this.minZ = 0 - this.offsetZ;
        this.maxX = this.maxXTarget - this.offsetX;
        this.maxZ = this.maxZTarget - this.offsetZ;
    }

    move(x, y, z) {
        this.x = x;
        this.z = z;
        this.y = y;
        this.limiter();
        this.targetX = this.x + this.offsetX;
        this.targetY = this.y + this.offsetY;
        this.targetZ = this.z + this.offsetZ;
    }

    moveTo(dx, dz, dt) {

        let module = Math.sqrt(dx * dx + dz * dz);
        let a = -Math.atan2(dx, dz) + Math.PI / 4;
        dx = module * Math.cos(a);
        dz = module * Math.sin(a);
        this.x -= dx * this.speed *dt * this.offsetZ;
        this.z -= dz * this.speed * dt * this.offsetZ;
        this.limiter();
        this.targetX = this.x + this.offsetX;
        this.targetZ = this.z + this.offsetZ;
    }

    update() {

    }

    mouseMovePress(x, z) {

        //Transformation of space. Apply a rotation of PI/4 at  direction vector.
        //screen space to camera space
        let dx = this.pressX - x;
        let dz = this.pressZ - z;
        let module = Math.sqrt(dx * dx + dz * dz);
        let a = -Math.atan2(dx, dz) + Math.PI / 4;
        dx = module * Math.cos(a);
        dz = module * Math.sin(a);

        let newX = this.iX + dx / 20;
        let newZ = this.iZ + dz / 20;
        this.move(newX, this.y, newZ);
    }

    mouseDown(x, z) {
        this.iX = this.x;
        this.iZ = this.z;
        this.pressX = x;
        this.pressZ = z;
    }

    mouseWheel(delta) {

        if(-this.offsetY < 5 && delta < 0) return;
        let length = Math.sqrt(this.offsetX * this.offsetX + this.offsetY * this.offsetY + this.offsetZ * this.offsetZ);
        this.offsetX /= length;
        this.offsetY /= length;
        this.offsetZ /= length;
        length += delta;
        this.offsetX *= length;
        this.offsetY *= length;
        this.offsetZ *= length;

        let x = this.targetX - this.offsetX;
        let y = this.targetY - this.offsetY;
        let z = this.targetZ - this.offsetZ;

        this.computeBorder();
        this.move(x, y, z);
    }

    setMapBorder(dataMap){
        this.maxXTarget = dataMap.nbTileX;
        this.maxZTarget = dataMap.nbTileZ;
        this.computeBorder();
    }

    computeBorder(){
        this.minX = 0 - this.offsetX;
        this.minZ = 0 - this.offsetZ;
        this.maxX = this.maxXTarget  - this.offsetX;
        this.maxZ = this.maxZTarget - this.offsetZ;
    }

    limiter(){
        this.x = this.x <= this.minX ? this.minX : this.x;
        this.x = this.x >= this.maxX ? this.maxX : this.x;
        this.z = this.z <= this.minZ ? this.minZ : this.z;
        this.z = this.z >= this.maxZ ? this.maxZ : this.z;
    }

    dismount() {

    }
}

module.exports = Camera;
