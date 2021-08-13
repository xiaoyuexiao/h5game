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
        new Phaser.Game(config);
        let cursors;
        let player;
        let player2;
        var score = 0;
        var scoreText;
        let gameOver;
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
             * 创建玩家组
             * 1.生成精灵对象
             */

            let players = this.physics.add.group();
            player = players.create(100, 450, 'dude');
            player2 = players.create(300, 450, 'dude');
            //player = this.physics.add.sprite(100, 450, 'dude');
            player.setBounce(0.2);
            player.setCollideWorldBounds(true);
            player.body.setGravityY(100);

            player2.setBounce(0.2);
            player2.setCollideWorldBounds(true);
            player2.body.setGravityY(100);

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
            this.physics.add.collider(players, platforms);

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
                    bomb.setBounce(1);// 设置为1，炸弹每次碰撞都完全反弹碰撞前的速度，速度没有减少就会一直运动。
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                }
            }
            this.physics.add.overlap(player2, stars, collectStar, null, this);
            //计算得分
            scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
            //设置炸弹组
            function hitBomb (player, bomb)
            {
                player.setTint(0xff0000);
                player.anims.play('turn');
                this.physics.pause();
                gameOver = true;
            }
            let bombs = this.physics.add.group();
            this.physics.add.collider(bombs, platforms);
            this.physics.add.collider(player, bombs, hitBomb, null, this);

        }

        function update (){
            if (cursors.left.isDown) {
                player2.setVelocityX(-160);
                player2.anims.play('left', true);
            } else if (cursors.right.isDown) {
                player2.setVelocityX(160);
                player2.anims.play('right', true);
            } else {
                player2.setVelocityX(0);
                player2.anims.play('turn');
            }
            if (cursors.up.isDown && player.body.touching.down) {
                player2.setVelocityY(-400);
            }
        }

        /**
         * 改造点：
         * 1.支持双人
         * 2.多种战利品和多种挑战因素
         * 3.多种背景，多种场景
         * 4.投币继续游戏
         * */
        return (
            <div>
                <canvas></canvas>
            </div>
        )
        
    }
}