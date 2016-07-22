class Camera {

    constructor(config) {
        this.x = 0; //camera position
        this.y = 100; //camera position
        this.z = 60; //camera position
        this.iX = 0; //camera position before drag
        this.iZ = 0; //camera position before drag
        this.offsetX = 0; //target positio relative too camera position
        this.offsetY = -100; //target position relative to camera position
        this.offsetZ = -60; //target position relative to camera position
        this.targetX = 0; //target position
        this.targetY = 0; //target position
        this.targetZ = 0; //target position
        this.pressX = 0;
        this.pressZ = 0;
        this.moveTo(config.x || this.x, this.y, config.z || this.z);
    }

    moveTo(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.targetX = this.x + this.offsetX;
        this.targetY = this.y + this.offsetY;
        this.targetZ = this.z + this.offsetZ;
    }

    update() {

    }

    mouseMovePress(x, z) {
        let newX = this.iX + (this.pressX - x) / 20;
        let newZ = this.iZ + (this.pressZ - z) / 20;
        this.moveTo(newX, this.y, newZ);
    }

    mouseDown(x, z) {
        this.iX = this.x;
        this.iZ = this.z;
        this.pressX = x;
        this.pressZ = z;
    }

    mouseWheel(delta) {
        let length = Math.sqrt(this.offsetX * this.offsetX + this.offsetY * this.offsetY + this.offsetZ * this.offsetZ);
        this.offsetX /= length;
        this.offsetY /= length;
        this.offsetZ /= length;
        length += delta;
        this.offsetX *= length;
        this.offsetY *= length;
        this.offsetZ *= length;
        this.moveTo(this.x, this.targetY - this.offsetY, this.targetZ - this.offsetZ);
    }

    dismount() {

    }
}

module.exports = Camera;
