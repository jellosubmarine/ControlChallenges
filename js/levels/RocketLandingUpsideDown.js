'use strict';
if (typeof Levels === 'undefined') var Levels = {};

Levels.RocketLandingUpsideDown = function()
{
	this.name = "RocketLandingUpsideDown";
	this.title = "Rocket Landing Upside Down";
	this.boilerPlateCode = "function controlFunction(rocket)\n{\n  return {throttle:1,gimbalAngle:-0.2};\n}";
	this.sampleSolution = "function controlFunction(rocket)\n{\n  // Horizontal position control\n  var x_target = 0.0;\n  var dx_target = 0.2 * (x_target - rocket.x);\n  if(Math.abs(x_target - rocket.x) < 20.0) dx_target = 0.0;\n  var theta_target = 0.05 * (dx_target - rocket.dx);\n  \n  // Pitch control with limits on angle and angular rate\n  theta_target = Math.max(-0.6, Math.min(0.6, theta_target));\n  var dtheta_target = 1.0 * (theta_target - rocket.theta);\n  dtheta_target = Math.max(-1.0, Math.min(1.0, dtheta_target));\n  var gimbalAngle = 30.0 * (rocket.dtheta - dtheta_target);\n  \n  // Vertical speed profile for constant acceleration landing\n  var dy_target = -Math.sqrt(10.0 * Math.max(1e-6, rocket.y - 25));\n  \n  // Maintain height until positioned over the landing pad\n  if(Math.abs(rocket.x) > 35.0 || Math.abs(rocket.dx) > 12.0) dy_target = 0.5;\n  \n  // Vertical speed control\n  var throttle = 0.5 + 1.0 * (dy_target - rocket.dy);\n  \n  // Set high throttle while spinning to guarantee control authority\n  if(Math.abs(rocket.theta) > 0.6 || Math.abs(rocket.dtheta) > 0.5) throttle = 0.9;\n  throttle = Math.max(0.25, throttle);\n  \n  return {throttle:throttle, gimbalAngle:gimbalAngle};\n}";
	this.description = "Someone managed to turn the rocket upside down... can you rescue it?";
	this.resetModel();
}


Levels.RocketLandingUpsideDown.prototype.levelComplete = function(){return this.model.landed();}


Levels.RocketLandingUpsideDown.prototype.levelFailed = function(){return this.model.crashed();}

Levels.RocketLandingUpsideDown.prototype.simulate = function (dt, controlFunc)
{
	this.model = this.model.simulate (dt, controlFunc);
}

Levels.RocketLandingUpsideDown.prototype.getSimulationTime = function()	{return this.model.T;}

Levels.RocketLandingUpsideDown.prototype.resetModel = function()
{
	this.model = new Models.RocketLanding({TWR: 2,theta: -3.14,dtheta: 0,Length: 40,Width: 5,x: 50,dx: 20,y: 200,dy: 60,T: 0});
}

Levels.RocketLandingUpsideDown.prototype.draw = function(ctx, canvas){this.model.draw(ctx, canvas);}

Levels.RocketLandingUpsideDown.prototype.infoText = function(ctx, canvas){return this.model.infoText();}