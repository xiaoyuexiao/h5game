import React from "react";
import Phaser from "phaser";

export default class GameCanvas extends React.Component {
    render() {
        let config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };
        let game = new Phaser.Game(config);
        let cursors;
        let player;
        var score = 0;
        var scoreText;
        function preload ()
        {
            this.load.image('sky', 'assets/sky.png');
            this.load.image('ground', 'assets/platform.png');
            this.load.image('star', 'assets/star.png');
            this.load.image('bomb', 'assets/bomb.png');
            this.load.spritesheet('dude', 'assets/dude.png',{ frameWidth: 32, frameHeight: 48 });
        }

        function create ()
        {
            /**
             * 创建游戏世界
             */
            let platforms;
            this.add.image(400, 300, 'sky');
            platforms = this.physics.add.staticGroup();//创建静态物理组
            platforms.create(400, 568, 'ground').setScale(2).refreshBody();
            platforms.create(600, 400, 'ground');
            platforms.create(50, 250, 'ground');
            platforms.create(750, 220, 'ground');

            /**
             * 创建玩家
             * 1.生成精灵对象
             */

            //1
            
            player = this.physics.add.sprite(100, 450, 'dude');
            player.setBounce(0.2);
            player.setCollideWorldBounds(true);
            player.body.setGravityY(100)

            //创建向左的帧动画
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                frameRate: 10, //每秒10帧
                repeat: -1 //循环播放
            });

            //创建翻转的帧动画
            this.anims.create({
                key: 'turn',
                frames: [ { key: 'dude', frame: 4 } ],
                frameRate: 20
            });

            //创建向右的帧动画
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });

            //添加碰撞检测
            this.physics.add.collider(player, platforms);

            /**
             * 键盘控制
             */
            cursors = this.input.keyboard.createCursorKeys();

            /**
             * 生成星星
             */
            let stars = this.physics.add.group({
                key: 'star',
                repeat: 11,
                setXY: { x: 12, y: 0, stepX: 70 }
            });
            // 随机设置每个星星反弹值
            stars.children.iterate(function (child) {
                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            });
            // 设置星星与地面的碰撞检测
            this.physics.add.collider(stars, platforms);
            // 重叠检测
            function collectStar (player, star)
            {
                star.disableBody(true, true);
                score += 10;
                scoreText.setText('Score: ' + score);
                if (stars.countActive(true) === 0)
                {
                    stars.children.iterate(function (child) {

                        child.enableBody(true, child.x, 0, true, true);

                    });
                    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                    var bomb = bombs.create(x, 16, 'bomb');
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                }
            }
            this.physics.add.overlap(player, stars, collectStar, null, this);
            //计算得分
            scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
            //设置炸弹组
            function hitBomb (player, bomb)
            {
                this.physics.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                gameOver = true;
            }
            let bombs = this.physics.add.group();
            this.physics.add.collider(bombs, platforms);
            this.physics.add.collider(player, bombs, hitBomb, null, this);

        }

        function update (){
            if (cursors.left.isDown) {
                player.setVelocityX(-160);
                player.anims.play('left', true);
            } else if (cursors.right.isDown) {
                player.setVelocityX(160);
                player.anims.play('right', true);
            } else {
                player.setVelocityX(0);
                player.anims.play('turn');
            }

            if (cursors.up.isDown && player.body.touching.down) {
                player.setVelocityY(-400);
            }
        }

        return (
            <div>
                <canvas></canvas>
            </div>
        )
        
    }
}