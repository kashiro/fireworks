(function(exports){

  'use strict';

  var minParticleV = 5;
  var deltaParticleV = 5;
  var explosionRadius = 200;
  var bombRadius = 10;
  // Particleクラスのdurationより多くすること
  // そうすることで、破片が消えた後、花火のaliveがfalseになる依存を作れる
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

    // 横方向に移動する量を花火毎に設定（飛んで行く向き）
    // 描画毎に変化しない
    self.vx = Config.minVx + Math.random() * Config.deltaVx;
    // 縦方向に移動する量を花火毎に設定（飛んで行く高さ）
    // 描画毎にConfig.gravityずつすくなくなる（花火が重力に引きずられるのを表現）
    self.vy = (Config.minVy + Math.random() * Config.deltaVy) * -1;

  }

  Bomb.prototype.explode = function(particlesVector){
    var self = this;
    self.hasExploded = true;
    // 爆発時の破片(Particle)を準備
    // n(10-30)のランダムをe(3-5)回繰り返して個数を算出(30-150)
    // eが爆発時に生成される円の数（3の場合3重の円になる）
    // nが1円あたりの破片の数
    var e = 3 + Math.floor(Math.random() * 3); // 3 - 5
    for(var j = 0; j < e; j++){
      var n = 10 + Math.floor(Math.random() * 21); // 10 - 30
      // 1円毎の移動スピード
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
      // 爆発後
      // 爆発後、花火本体は徐々に円を小さくして消滅してくロジック
      // しかし、目でみてもほとんど変化を把握できないレベルなので不要
      //var deltaRadius = explosionRadius - self.radius;
      //self.previousRadius = self.radius;
      //self.radius += deltaRadius / explosionDividerFactor;

      // 花火（破片も含めて）の表示期間
      self.explodingDuration--;
      if(self.explodingDuration == 0){
        self.alive = false;
      }
    }else{
      // 爆発前
      // vx,vy = 移動距離
      // px,py = 描画位置
      self.vx += 0;
      self.vy += Config.gravity;
      // 花火は上昇するので、vyはマイナスの値
      // 徐々に上昇量が減っていくようになっているので
      // 上昇しなくなったタイミングで爆発させる
      if(self.vy >= 0){
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
