var FPS = 100;

class LightingScene extends CGFscene
{
	constructor()
	{
		super();
	};

	init(application)
	{
		super.init(application);

		this.initCameras();

		this.initLights();

		this.enableTextures(true);

		this.gl.clearColor(0.2, 0.6, 1.0, 1.0);
		this.gl.clearDepth(100.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		//Axis
		this.axis = new CGFaxis(this);

		// Materials
		this.materialDefault = new CGFappearance(this);

		// Terrain elements
		this.terrain = new MyTerrain(this);

		//Vehicle
		this.vehicle = new MyVehicle(this);

		this.wheel = new MyChassis(this, 16, 20);
		
		//Crane
		this.crane = new MyCrane(this);
		this.forceCrane = false;
		this.setTextureDropDown();

		this.clocktexture = new CGFappearance(this);
    this.clocktexture.setAmbient(0.8,0.8,0.8,1);
		this.clocktexture.setDiffuse(0.8,0.8,0.8,1);
		this.clocktexture.setSpecular(0.1,0.1,0.1,1);
		this.clocktexture.setShininess(120);
    this.clocktexture.loadTexture('../resources/images/lamp.jpg');


		this.setUpdatePeriod(1000/FPS);

		//Luzes
		this.luz1 = true;
		this.luz2 = true;
		this.luz3 = true;
		this.luz4 = true;

		//Vehicle
		this.luzes = false;

		//options
		this.showAxis=true;
		this.option1=true;
		this.option2=false;



		this.keyAPressed = false;
		this.keyDPressed = false;
		this.keyWPressed = false;
		this.keySPressed = false;

		this.rotation=0;
		this.steering = 0;
		this.speed=0.1;
		this.compensateDirection = false;
	};

	doSomething(){
		console.log("Doing something...");
	}
	
	setTextureDropDown(){
		this.text1 = new CGFappearance(this);
    this.text1.setAmbient(0.8,0.8,0.8,1);
		this.text1.setDiffuse(0.8,0.8,0.8,1);
		this.text1.setSpecular(0.1,0.1,0.1,1);
		this.text1.setShininess(120);
    this.text1.loadTexture('../resources/images/redbull.jpg');

		this.text2 = new CGFappearance(this);
    this.text2.setAmbient(0.8,0.8,0.8,1);
		this.text2.setDiffuse(0.8,0.8,0.8,1);
		this.text2.setSpecular(0.1,0.1,0.1,1);
		this.text2.setShininess(120);
    this.text2.loadTexture('../resources/images/dakar.jpg');

		this.vehicleAppearances = [this.text1, this.text2];
		this.vehicleAppearecesList = new Map();
		this.vehicleAppearecesList.set("redbull", 0);
		this.vehicleAppearecesList.set("dakar", 1);

		this.Texture = "redbull";
		this.currVehicleAppearance = this.vehicleAppearecesList.get(this.Texture);
	}

	checkKeys() {
		if (this.gui.isKeyPressed("KeyW"))
		{
				if(this.speed<1)
						this.speed+=0.01;
		}
		if (this.gui.isKeyPressed("KeyS"))
		{
				if(this.speed>-1)
					this.speed-=0.01;
				//this.move=-1;
		}
		if (this.gui.isKeyPressed("KeyA"))
		{
			this.compensateDirection=false;
			this.keyAPressed=true;
			if(this.rotation<34){
					this.rotation+=2;
			}
			this.steering+=10*this.speed;
		}

	if(this.keyAPressed && !this.gui.isKeyPressed("KeyA")){
		this.keyAPressed = false;
		this.compensateDirection=true;
	}

	if (this.gui.isKeyPressed("KeyD"))
		{
			this.compensateDirection=false;
			this.keyDPressed=true;
			if(this.rotation>-34){
					this.rotation-=2;
			}
			this.steering-=10*this.speed;
		}

		if(this.keyDPressed && !this.gui.isKeyPressed("KeyD")){
			this.keyDPressed = false;
			this.compensateDirection=true;
		}

		if (this.gui.isKeyPressed("KeyZ")){
			this.speed=0;
		}

}

	update(currTime){
		this.lastTime = this.lastTime || 0;

		this.deltaTime = currTime - this.lastTime;
		this.lastTime = currTime;
		//Update texture car
		let index = this.vehicleAppearecesList.get(this.Texture);
		if(index!=this.currVehicleAppearance){
			this.currVehicleAppearance = index;
			this.car.updateTexture(this.vehicleAppearances[index]);
		}

		//Update crane angle
		if(this.forceCrane){
			this.crane.update(this.deltaTime);
			if(this.crane.getCurrentState==7){
				this.forceCrane = false;
				this.crane.setState(0);
			}
		}
		
		//Update car
		this.checkKeys();

		if(this.rotation == 0){
			this.compensateDirection=false;
		}

		if(this.compensateDirection){
			if(this.rotation>0){
				this.rotation-=2;
				this.steering+=10*this.speed;
			} else {
				this.rotation+=2;
				this.steering-=10*this.speed;
			}
		}

		this.vehicle.update(this.speed, this.steering, this.rotation);


	}

	initCameras()
	{
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
	};

	initLights()
	{
		this.setGlobalAmbientLight(1,1,1, 1.0);

		// Positions for four lights
		this.lights[0].setPosition(4.0, 6.0, 1.0, 1.0);
		//this.lights[0].setVisible(true);
		this.lights[0].setSpecular(1.0,1.0,1.0,1.0);
		this.lights[0].setAmbient(0, 0, 0, 1.0);
		this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[0].setConstantAttenuation(1.0);
		this.lights[0].setLinearAttenuation(0);
		this.lights[0].setQuadraticAttenuation(0);

		this.lights[1].setPosition(10.5, 6.0, 1.0, 1.0);
		//this.lights[1].setVisible(true);
		this.lights[1].setAmbient(0, 0, 0, 1.0);
		this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[1].setConstantAttenuation(1.0);
		this.lights[1].setLinearAttenuation(0);
		this.lights[1].setQuadraticAttenuation(0);

		this.lights[2].setPosition(10.5, 6.0, 5.0, 1.0);
		this.lights[2].setSpecular(1.0, 1.0, 1.0, 1.0);
		//this.lights[2].setVisible(true);
		this.lights[2].setAmbient(0, 0, 0, 1.0);
		this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[2].setConstantAttenuation(0);
		this.lights[2].setLinearAttenuation(1.0);
		this.lights[2].setQuadraticAttenuation(0);

		this.lights[3].setPosition(4.0, 6.0, 5.0, 1.0);
		//this.lights[3].setVisible(true);
		this.lights[3].setAmbient(0, 0, 0, 1.0);
		this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[3].setConstantAttenuation(0);
		this.lights[3].setLinearAttenuation(0);
		this.lights[3].setQuadraticAttenuation(0.1);

	};

	updateLights()
	{
		for (var i = 0; i < this.lights.length; i++)
			this.lights[i].update();
	}


	display()
	{

		//check Lights
		if(this.luz1){
				this.lights[0].enable();
		} else {
			this.lights[0].disable();
		}

		if(this.luz2){
				this.lights[1].enable();
		} else {
			this.lights[1].disable();
		}

		if(this.luz3){
				this.lights[2].enable();
		} else {
			this.lights[2].disable();
		}

		if(this.luz4){
				this.lights[3].enable();
		} else {
			this.lights[3].disable();
		}
		// ---- BEGIN Background, camera and axis setup

		// Clear image and depth buffer everytime we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// Initialize Model-View matrix as identity (no transformation)
		this.updateProjectionMatrix();
		this.loadIdentity();

		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();

		// Update all lights used
		this.updateLights();

		// Draw axis
		if(this.showAxis){
			this.axis.display();
		}


		this.materialDefault.apply();

		// ---- END Background, camera and axis setup

		// ---- BEGIN Scene drawing section

		//this.pos-=0.1;
		this.pushMatrix();
			//this.terrain.display();
		this.popMatrix();
		
		if(!this.crane.shouldDisplayCar()){
			this.pushMatrix();
				//this.translate(0,1.35,0);
				this.vehicle.display();
			this.popMatrix();
			this.vehicle.controlLights(this.luzes);
		}
		
		this.materialDefault.apply();
		this.crane.display(this.car, this.chassis);

		// ---- END Scene drawing section
	};
};
