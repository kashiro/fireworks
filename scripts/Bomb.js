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
    // n(10-30)のランダムをe(3-5)回繰り返して破片の総個数を算出(30-150)
    var e = 3 + Math.floor(Math.random() * 3); // 3 - 5
    for(var j = 0; j < e; j++){
      var n = 10 + Math.floor(Math.random() * 21); // 10 - 30
      // 破片が移動する際の花火本体からの距離(半径)になる値
      var speed = minParticleV + Math.random() * deltaParticleV; //  5 - 9
      // 半径1の弧の長さ(2*Math.PI)を1radianと呼ぶ
      // degreeでいうと、つまり360度をn当分したという意味になる
      var deltaAngle = 2 * Math.PI / n;
      // 破片で当分した角度を最大値としてランダムな角度を算出しそれが最低角度に
      // 仮にnが10の場合、35度を最大値としたランダムの角度
      var initialAngle = Math.random() * deltaAngle;
      for(var i = 0; i < n; i++){
        // 破片が飛び散る角度をラジアンで表現
        // n当分した角度にランダムな最低角度を加算して角度（ラジアン）とする
        //var radian = i * deltaAngle + initialAngle;
        // 破片をバラけさせる為に細かい計算があるが見た目上、下記でも問題ない
        var radian = i * deltaAngle;
        particlesVector.push(new Particle(self, radian, speed));
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
