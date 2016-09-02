module.exports.followPath = function followPath(Component){

    Component.prototype.followPath = function followPath(dt){

        if(this.shape.length === 0) return;
        this.moveProgress += dt * this.moveSpeed;

        this.moveProgress = Math.min(this.shape.length, this.moveProgress);
        let point = this.shape.getPointAndTangent(this.moveProgress);

        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = point[0];
        matrixWorld[13] = point[1];
        matrixWorld[14] = point[2];

        const a = Math.atan2(point[4], point[3]);

        matrixWorld[0] = Math.cos(a);
        matrixWorld[2] = Math.sin(a);
        matrixWorld[8] = -matrixWorld[2];
        matrixWorld[10] = matrixWorld[0];
    };

    Component.prototype.moveProgress = 0;
    Component.prototype.moveSpeed = 400;
};

module.exports.playAnimation = function playAnimation(Component){

    Component.prototype.playAnimation = function playAnimation(dt){

        if(!this.element.morphTargetInfluences) return;

        const animation = this.animations[this.currentAnimation];
        const steps = animation.steps;
        const duration = animation.duration;
        const nbSteps = steps.length - 1;
        const nbTarget = this.element.morphTargetInfluences.length;

        this.animProgress += dt / duration;
        if(this.animProgress > 1) {
            this.animProgress = Math.min(this.animProgress,1) - 1;
        }

        const indexStep = Math.min(Math.floor(this.animProgress * nbSteps), nbSteps-1);

        for(let i=0; i<nbTarget; i++){
            this.element.morphTargetInfluences[i] = 0
        }

        const ia = steps[indexStep];
        const ib = steps[indexStep+1];
        this.element.morphTargetInfluences[ib] = this.animProgress / (1/nbSteps) - indexStep;
        this.element.morphTargetInfluences[ia] = 1 - this.element.morphTargetInfluences[ib];

    };

    Component.prototype.animProgress = 0;
};
