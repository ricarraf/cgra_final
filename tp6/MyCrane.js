class MyCrane extends CGFobject{
  constructor(scene){
    super(scene);

    this.baseToJointUnit = new MyBaseToJointUnit(scene);
    this.baseAngle = 0;
    this.baseMaxAngle = 180;
    this.baseMinAngle = 0;

    this.jointMinAngle = 0;
    this.jointMaxAngle = 85;
    this.holdPositionTimer = 0;
    this.HoldTime = 2;

    this.state = 0;
  }

  setAngles(jointAngle, baseAngle){
    this.baseToJointUnit.setAngle(jointAngle);
    this.baseAngle = baseAngle;
  }

  update(deltaTime){
    if(deltaTime>100000)
      return;

    this.animationSpeed = deltaTime/(1000/5);

    if(this.state == 0){
      this.gotoMaxJointAngle(deltaTime, 1)
    }
    else if(this.state == 1){
      this.holdPositionTimer += this.animationSpeed;
      if(this.holdPositionTimer>this.HoldTime)
        this.state = 2;
    }
    else if(this.state == 2){
      this.gotoMinJointAngle(deltaTime, 3);
    }
    else if(this.state == 3){
      let angle = this.baseAngle + this.animationSpeed*(360/60);
      if(angle<this.baseMaxAngle)
        this.baseAngle = angle;
      else
        this.state = 4;
    }
    else if(this.state == 4){
      this.gotoMaxJointAngle(deltaTime, 5)
    }
    else if(this.state == 5){
      this.gotoMinJointAngle(deltaTime, 6);
    }
    else if(this.state == 6){
      let angle = this.baseAngle - this.animationSpeed*(360/60);
      if(angle>this.baseMinAngle)
        this.baseAngle = angle;
      else
        this.state = 7;
    }

  }

  gotoMaxJointAngle(deltaTime, nextState){
    let angle = this.baseToJointUnit.getAngle()+(this.animationSpeed)*(360/60);
    if(angle<this.jointMaxAngle)
      this.baseToJointUnit.setAngle(angle);
    else
      this.state = nextState;
  }

  gotoMinJointAngle(deltaTime, nextState){
    let angle = this.baseToJointUnit.getAngle()-(this.animationSpeed)*(360/60);
    if(angle>this.jointMinAngle)
      this.baseToJointUnit.setAngle(angle);
    else
      this.state = nextState;
  }

  display(car, chassis){
    //MyBaseToJointUnit
    this.scene.pushMatrix();
        this.scene.rotate(this.baseAngle*Math.PI/180,0,1,0);
        this.baseToJointUnit.display(car, chassis, this.shouldDisplayCar());
    this.scene.popMatrix();
  }

  getCurrentState(){
    return this.state;
  }

  setState(state){
    this.state = state;;
  }

  shouldDisplayCar(){
    return (this.state>1 && this.state<5);
  }

}
