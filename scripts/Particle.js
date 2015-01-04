(function(exports){

  'use strict';
  var gravity = 1;

  function Particle(parent, angle, speed){
    var self = this;
    self.px = parent.px;
    self.py = parent.py;
    self.vx = Math.cos(angle) * speed;
    self.vy = Math.sin(angle) * speed;
    self.radius = 3;
    self.color = parent.color;
    self.duration = 40 + Math.floor(Math.random() * 20); // 40 - 59
    self.alive = true;
  }

  Particle.prototype.update = function(){
    var self = this;
    self.vy += 0;
    self.vy += Config.gravity / 10;
    self.px += self.vx;
    self.py += self.vy;
    self.duration--;
    if(self.duration <= 0){
      self.alive = false;
    }
  }
  Particle.prototype.draw = function(ctx){
    var self = this;
    ctx.beginPath();
    // 円を描画
    ctx.arc(self.px, self.py, self.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = self.color.style;
    ctx.lineWidth = 1;
    ctx.fill();
  }

  exports.Particle = Particle;

})(window);
