(function(exports, win){

  'use strict';

  var screenWidth = win.innerWidth;
  var screenHeight = win.innerHeight;
  var percentChanceNewBomb = 5;
  var nBombs = 1; // initial

  function Controller(){
    var self = this;
    self.canvas = document.getElementById('screen');
    self.canvas.width = screenWidth;
    self.canvas.height = screenHeight;
    self.ctx = self.canvas.getContext('2d');

    self.resize();
    win.addEventListener('resize', self.resize.bind(self));
  }

  Controller.prototype.setSpeedParams = function(){
    var heightReached = 0;
    var vy = 0;

    while(heightReached < screenHeight && vy >= 0){
      vy += Config.gravity;
      heightReached += vy;
    }

    Config.minVy = vy / 2;
    Config.deltaVy = vy - Config.minVy;

    var vx = (1 / 4) * screenWidth / (vy /2);
    Config.minVx = -vx;
    Config.deltaVx = 2*vx;
  }

  Controller.prototype.resize = function(){
    var self = this;
    screenWidth = win.innerWidth;
    screenHeight = win.innerHeight;
    self.canvas.width = screenWidth;
    self.canvas.height = screenHeight;
    self.setSpeedParams();
  }

  Controller.prototype.init = function(){
    var self = this;
    self.readyBombs = [];
    self.explodedBombs = [];
    self.particles = [];

    for(var i = 0; i < nBombs; i++){
      self.readyBombs.push(new Bomb());
    }
  }
  Controller.prototype.update = function(){
    var self = this;
    var aliveBombs = [];
    while(self.explodedBombs.length > 0){
      var bomb = self.explodedBombs.shift();
      bomb.update();
      if(bomb.alive){
        aliveBombs.push(bomb);
      }
    }
    self.explodedBombs = aliveBombs;

    var notExplodedBombs = [];
    while(self.readyBombs.length > 0){
      var bomb = self.readyBombs.shift();
      bomb.update(self.particles);
      if(bomb.hasExploded){
        self.explodedBombs.push(bomb);
      }else{
        notExplodedBombs.push(bomb);
      }
    }
    self.readyBombs = notExplodedBombs;

    var aliveParticles = [];
    while(self.particles.length > 0){
      var particle = self.particles.shift();
      particle.update();
      if(particle.alive){
        aliveParticles.push(particle);
      }
    }
    self.particles = aliveParticles;
  }
  Controller.prototype.draw = function(){
    var self = this;
    self.ctx.beginPath();
    self.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Ghostly effect
    self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

    for(var i = 0; i < self.readyBombs.length; i++){
      self.readyBombs[i].draw(self.ctx);
    }

    for(var i = 0; i < self.explodedBombs.length; i++){
      self.explodedBombs[i].draw(self.ctx);
    }

    for(var i = 0; i < self.particles.length; i++){
      self.particles[i].draw(self.ctx);
    }
  }
  Controller.prototype.animation = function(){
    var self = this;
    self.update();
    self.draw();

    if(Math.random() * 100 < percentChanceNewBomb) {
      self.readyBombs.push(new Bomb());
    }
    requestAnimationFrame(self.animation.bind(this));
  }

  exports.Controller = Controller;

})(window, window);
