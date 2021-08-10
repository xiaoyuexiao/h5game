import React from "react";
import Phaser from "phaser";

export default class GameCanvas extends React.Component {
    render() {
        let config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };
        let game = new Phaser.Game(config);
        
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
            this.add.image(400, 300, 'sky');
            this.add.image(400, 300, 'star');
            this.add.image(500, 300, 'star');
        }

        function update ()

        {
        }

        

        
        console.log("game:",game);
        return <div>
            画布:
            <canvas></canvas>
        </div>
    }
}