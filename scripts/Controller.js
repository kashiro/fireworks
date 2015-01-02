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
    // 打ち上げ中の花火(Bomb)
    self.readyBombs = [];
    // 打ち上げ後爆発した花火(Bomb)
    self.explodedBombs = [];
    // 爆発して飛散した破片の花火(Particle)
    self.particles = [];

    // はじめにnBomsの数だけ花火を打ち上げる準備
    for(var i = 0; i < nBombs; i++){
      self.readyBombs.push(new Bomb());
    }
  }
  Controller.prototype.updateExplodedBombs = function(){
    var self = this;
    var aliveBombs = [];
    while(self.explodedBombs.length > 0){
      var bomb = self.explodedBombs.shift();
      // TODO
      bomb.update();
      if(bomb.alive){
        aliveBombs.push(bomb);
      }
    }
    self.explodedBombs = aliveBombs;
  }
  Controller.prototype.updateReadyBombs = function(){
    var self = this;
    var notExplodedBombs = [];
    while(self.readyBombs.length > 0){
      var bomb = self.readyBombs.shift();
      // 爆発するまで徐々に上昇
      bomb.update(self.particles);
      if(bomb.hasExploded){
        self.explodedBombs.push(bomb);
      }else{
        notExplodedBombs.push(bomb);
      }
    }
    self.readyBombs = notExplodedBombs;
  }
  Controller.prototype.updateParticles = function(){
    var self = this;
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
  Controller.prototype.update = function(){
    var self = this;
    // 爆発した花火を更新
    // はじめの花火が爆発するまで何もしない
    this.updateExplodedBombs();
    // 爆発するまでの花火を更新
    this.updateReadyBombs();
    // 爆発して飛散した破片を更新
    this.updateParticles();
  }
  Controller.prototype.draw = function(){
    var self = this;
    self.ctx.beginPath();

    // 描画毎に黒のalpha0.1を塗り重ねていく
    // これによって、オブジェクトが徐々にフェードしていく効果になる
    // 試しに0.1を0にすると残像が消えずに残る
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

    // アニメーション関数実行毎に5%の確立で花火が増える
    if(Math.random() * 100 < percentChanceNewBomb) {
      self.readyBombs.push(new Bomb());
    }
    requestAnimationFrame(self.animation.bind(this));
  }

  exports.Controller = Controller;

})(window, window);
