var Imported = Imported || {};
Imported.JM_UniformCameraPlayerFace = true;

var JM = JM || {};
JM.UniformCameraPlayerFace = JM.UniformCameraPlayerFace || {};
JM.UniformCameraPlayerFace.Version = 0.9;
/*:

*@author JankyMouse
*@plugindesc Patches MV3D for uniform camera and player facing.
*@param options
*@text Settings
*@param autoRotSpeed
*@text Rotation Speed
*@desc The amount characters rotate in 1 second in degrees.
*@parent options
*@type Number
*@decimals 2
*@min 1 @max 360
*@default 0.1
*/
  //"use strict";

var JM_UniformCameraPlayerFace = JM.UniformCameraPlayerFace;
JM_UniformCameraPlayerFace.params = PluginManager.parameters("UniformCameraPlayerFace");

JM_UniformCameraPlayerFace.params = {
  autoRotSpeed: Number(JM_UniformCameraPlayerFace.params['autoRotSpeed'])
};

//--------------------------------------------------------------------------------------------
// mv3d defined @ln 3426

const mv3d_getDirection = mv3d.Character.prototype.getDirection;
mv3d.Character.prototype.getDirection = function(){
  if(this.isPlayer && $gamePlayer.isMoving()){
    switch(true){
    case ((Input.isPressed('left') && Input.isPressed('right')) && (Input.isPressed('down'))):        
        return this.LastCameraYaw = ~~mv3d.blendCameraYaw.currentValue(),
               this.LastCameraYaw;
    case ((Input.isPressed('left') && Input.isPressed('right')) && Input.isPressed('up')):        
        return this.LastCameraYaw = ~~mv3d.blendCameraYaw.currentValue()+180,
               this.LastCameraYaw;
    case ((Input.isPressed('left')) && (Input.isPressed('right'))):
        return this.LastCameraYaw           
    case Input.isPressed('left') && Input.isPressed('down'):
        return this.LastCameraYaw = ~~mv3d.blendCameraYaw.currentValue()-45,
               this.LastCameraYaw;
         //,console.log("1") 
    case Input.isPressed('right') && Input.isPressed('down'):        
        return this.LastCameraYaw = ~~mv3d.blendCameraYaw.currentValue()+45,
               this.LastCameraYaw;
        //,console.log("3")
    case Input.isPressed('left') && Input.isPressed('up'):        
        return this.LastCameraYaw = ~~mv3d.blendCameraYaw.currentValue()-135,
               this.LastCameraYaw;
        //,console.log("7")  
    case Input.isPressed('right') && Input.isPressed('up'):        
        return this.LastCameraYaw = ~~mv3d.blendCameraYaw.currentValue()+135,
               this.LastCameraYaw;  
        //,console.log("9")    
    case Input.isPressed('up'):           
        return this.LastCameraYaw = ~~mv3d.blendCameraYaw.currentValue()+180,
               this.LastCameraYaw;
        //,console.log(this.LastCameraYaw)
    case Input.isPressed('down'):        
        return this.LastCameraYaw = ~~mv3d.blendCameraYaw.currentValue(),
               this.LastCameraYaw;
       // console.log("down")    
    case Input.isPressed('left'):
        //console.log("")
        return this.LastCameraYaw = ~~mv3d.blendCameraYaw.currentValue()+270,
               this.LastCameraYaw;
    case Input.isPressed('right'):
        //console.log("")
        return this.LastCameraYaw = ~~mv3d.blendCameraYaw.currentValue()-270,
               this.LastCameraYaw;    
    }
  }
  if(this.isPlayer && (this.LastCameraYaw != undefined)){
        return this.LastCameraYaw;
  }
  else{
        return mv3d_getDirection.call(this);
  }
};

//---------------------------------------------------------------------------------------------
// mv3d defined @ln 3433

mv3d.Character.prototype.updateDirection = function(){
     
  this.direction = this.getDirection();
  
  const turnSpeed = JM_UniformCameraPlayerFace.params['autoRotSpeed'];
  
  if (this.getConfig('autoRot', this.isComplex)) {
    const needsInitialize = !this.blendDirection;
    if (needsInitialize) {
      this.blendDirection = this.makeBlender('direction', this.direction);
      this.blendDirection.cycle = 360;
    }
    if (this.direction !== this.blendDirection.targetValue()) {
      const blendTime = Math.abs((0,mv3d.util.degDiff)(this.direction, this.blendDirection.currentValue()) / turnSpeed)
      this.blendDirection.setValue(this.direction, blendTime);
      //console.log(blendTime)
    }
    if (this.blendDirection.update() || this.needsPositionUpdate || needsInitialize) {
      this.model.yaw = this.blendDirection.currentValue() + this.getConfig('yaw', 0);
      this.model.rotNode.yaw = this.getConfig('rot', 0);
    }
  }
  if (this.getConfig('autoPitch')) {
    if (!this.blendPitch) {
      this.blendPitch = this.makeBlender('pitch', 90);
    }
    // TODO: calculate proper pitch based on slope
  }
      //mv3d_updateDirection.call(this);
};