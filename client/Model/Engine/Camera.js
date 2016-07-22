class Camera {

    constructor(config) {
        this.x = 0; //camera position
        this.y = 100; //camera position
        this.z = 60; //camera position
        this.iX = 0; //camera position before drag
        this.iZ = 0; //camera position before drag
        this.offsetX = -75; //target positio relative too camera position
        this.offsetY = -100; //target position relative to camera position
        this.offsetZ = -75; //target position relative to camera position
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

        //Transformation of space. Apply a rotation of PI/4 at  direction vector.
        //screen space to camera space
        let dx = this.pressX - x;
        let dz = this.pressZ - z;
        let module = Math.sqrt(dx * dx + dz * dz);
        let a = -Math.atan2(dx, dz)+ Math.PI/4;
        dx = module * Math.cos(a);
        dz = module * Math.sin(a);

        let newX = this.iX + dx / 20;
        let newZ = this.iZ + dz / 20;
        this.moveTo(newX, this.y, newZ);
    }

    mouseDown(x, z) {
        this.iX = this.x;
        this.iZ = this.z;
        this.pressX = x;
        this.pressZ = z;
    }

    mouseWheel(delta) {

        if(-this.offsetY<40 && delta<0 ) return;
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



        this.moveTo(x, y, z);
    }

    dismount() {

    }
}

module.exports = Camera;
