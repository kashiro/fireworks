(function(exports){

  'use strict';

  var minParticleV = 5;
  var deltaParticleV = 5;
  var explosionRadius = 200;
  var bombRadius = 10;
  var explodingDuration = 100;
  var explosionDividerFactor = 10;

  function Bomb(){
    var self = this;

    self.radius = bombRadius;
    self.previousRadius = bombRadius;
    self.explodingDuration = explodingDuration;
    self.hasExploded = false;
    self.alive = true;
    self.color = new Color();

    self.px = (window.innerWidth / 4) + (Math.random() * window.innerWidth / 2);
    self.py = window.innerHeight;

    self.vx = Config.minVx + Math.random() + Config.deltaVx;
    self.vy = (Config.minVy + Math.random() * Config.deltaVy) * -1;

  }

  Bomb.prototype.explode = function(particlesVector){
    var self = this;
    self.hasExploded = true;
    var e = 3 + Math.floor(Math.random() * 3); // 3 - 5
    for(var j = 0; j < e; j++){
      var n = 10 + Math.floor(Math.random() * 21); // 10 - 30
      var speed = minParticleV + Math.random() * deltaParticleV;
      var deltaAngle = 2 * Math.PI / n;
      var initialAngle = Math.random() * deltaAngle;
      for(var i = 0; i < n; i++){
        particlesVector.push(new Particle(self, i * deltaAngle + initialAngle, speed));
      }
    }
  }

  Bomb.prototype.update = function(particlesVector){
    var self = this;
    if(self.hasExploded){
      var deltaRadius = explosionRadius - self.radius;
      self.previousRadius = self.radius;
      self.radius += deltaRadius / explosionDividerFactor;
      self.explodingDuration--;
      if(self.explodingDuration == 0){
        self.alive = false;
      }
    }else{
      self.vx = +0;
      self.vy += Config.gravity;
      if(self.vy >= 0){ // invertion point
        self.explode(particlesVector)
      }
      self.px += self.vx;
      self.py += self.vy;
    }
  }

  Bomb.prototype.draw = function(ctx){
    var self = this;
    ctx.beginPath();
    ctx.arc(self.px, self.py, self.previousRadius, 0, Math.PI * 2, false);
    if(!self.hasExploded){
      ctx.fillStyle = self.color.style;
      ctx.lineWidth = 1;
      ctx.fill();
    }
  }

  exports.Bomb = Bomb;

})(window);
