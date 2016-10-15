class Camera {

    constructor(config) {
        this.x = config.x || 10; //camera position
        this.y = config.y || 12; //camera position
        this.z = config.z || 10; //camera position
        this.iX = 0; //camera position before drag
        this.iZ = 0; //camera position before drag
        this.offsetX = config.offsetX || -10; //target positio relative too camera position
        this.offsetY = config.offsetY || -12; //target position relative to camera position
        this.offsetZ = config.offsetZ || -10; //target position relative to camera position
        this.targetX = this.x + this.offsetX;
        this.targetY = this.y + this.offsetY;
        this.targetZ = this.z + this.offsetZ;
        this.pressX = 0;
        this.pressZ = 0;
        this.speed = 0.001;
        this.moveSpeed = 0.01;
        this.maxXTarget = 0;
        this.maxZTarget = 0;
        this.minX = 0 - this.offsetX;
        this.minZ = 0 - this.offsetZ;
        this.maxX = this.maxXTarget - this.offsetX;
        this.maxZ = this.maxZTarget - this.offsetZ;
        this.zoom = Math.sqrt(this.offsetX * this.offsetX + this.offsetY * this.offsetY + this.offsetZ * this.offsetZ);
        this.offsetXInit = 0;
        this.offsetYInit = 0;
        this.offsetZInit = 0;
        this.moveReady = false;
        this.zoomMax = config.zoomMax || 30;
        this.zoomMin = config.zoomMin || 5;
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
        this.x -= dx * this.speed * dt * this.offsetZ;
        this.z -= dz * this.speed * dt * this.offsetZ;
        this.limiter();
        this.targetX = this.x + this.offsetX;
        this.targetZ = this.z + this.offsetZ;
    }

    update() {

    }

    dragg(x, z) {
        //Transformation of space. Apply a rotation of PI/4 at  direction vector.
        //screen space to camera space
        if(!this.moveReady) {
            this.initMove(x, z);
        }
        let dx = this.pressX - x;
        let dz = this.pressZ - z;

        let newX = this.iX + dx;
        let newZ = this.iZ + dz;
        this.move(newX, this.y, newZ);
    }

    initMove(x, z) {
        this.moveReady = true;
        this.iX = this.x;
        this.iZ = this.z;
        this.pressX = x;
        this.pressZ = z;
        this.computeCurrentZoom();
    }

    cleatMove() {
        this.moveReady = false;
    }

    computeCurrentZoom() {
        this.zoom = Math.sqrt(this.offsetX * this.offsetX + this.offsetY * this.offsetY + this.offsetZ * this.offsetZ);
        this.offsetXInit = this.offsetX / this.zoom;
        this.offsetYInit = this.offsetY / this.zoom;
        this.offsetZInit = this.offsetZ / this.zoom;
    }

    scale(delta) {
        if(this.offsetY > -this.zoomMin && delta < 0 || this.offsetY < -this.zoomMax && delta > 0) return;
        let zoom = this.zoom + delta;
        this.offsetX = this.offsetXInit * zoom;
        this.offsetY = this.offsetYInit * zoom;
        this.offsetZ = this.offsetZInit * zoom;
        let x = this.targetX - this.offsetX;
        let y = this.targetY - this.offsetY;
        let z = this.targetZ - this.offsetZ;
        this.computeBorder();
        this.move(x, y, z);
    }

    mouseWheel(delta) {
        if(this.offsetY > -this.zoomMin && delta < 0 || this.offsetY < -this.zoomMax && delta > 0) return;
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

    setMapBorder(dataMap) {
        this.maxXTarget = dataMap.nbTileX;
        this.maxZTarget = dataMap.nbTileZ;
        this.computeBorder();
    }

    computeBorder() {
        this.minX = 0 - this.offsetX;
        this.minZ = 0 - this.offsetZ;
        this.maxX = this.maxXTarget - this.offsetX;
        this.maxZ = this.maxZTarget - this.offsetZ;
    }

    limiter() {
        this.x = this.x <= this.minX ? this.minX : this.x;
        this.x = this.x >= this.maxX ? this.maxX : this.x;
        this.z = this.z <= this.minZ ? this.minZ : this.z;
        this.z = this.z >= this.maxZ ? this.maxZ : this.z;
    }

    dismount() {

    }
}

module.exports = Camera;
