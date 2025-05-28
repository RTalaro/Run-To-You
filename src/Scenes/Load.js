class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assetsNEW/");

        console.log("load packed tilemaps");
        this.load.image("farm", "/tilemaps/farm.png");
        this.load.image("food", "/tilemaps/food.png");
        this.load.image("line", "/tilemaps/line.png");
        this.load.image("pico", "/tilemaps/pico.png");
        this.load.image("pixels-bg", "/tilemaps/pixels-bg.png");
        this.load.image("pixels-char", "/tilemaps/pixels-char.png");
        this.load.image("pixels-gen", "/tilemaps/pixels-gen.png");
        this.load.image("roguelike_color", "/tilemaps/roguelike_color.png");
        this.load.image("roguelike_monochrome", "/tilemaps/roguelike_monochrome.png");
        this.load.image("tinyski", "/tilemaps/tinyski.png");

        console.log("load full level tilemap");
        this.load.tilemapTiledJSON("level1", "level1.tmj");

        console.log("load you and me");
        this.load.image("me_hole", "/me/tile_0093.png");
        this.load.image("me_stand", "/me/tile_0091.png");
        this.load.image("me_walk", "/me/tile_0092.png");
        this.load.image("you_stand", "/you/tile_0000.png");
        this.load.image("you_walk", "/you/tile_0001.png");

        /*// BRING THESE BACK
        console.log("load audio");
        this.load.audio("walk_sfx", "walk_sfx.mp3");
        this.load.audio("bgm", "nofu.mp3");
        */
    }

    create() {
        console.log("load our animations");
        this.anims.create({
            key: 'meWalk',
            frames: [{key: "me_walk", frame: 0},
                     {key: "me_stand", frame: 0}],
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: 'meStand',
            frames: [{key: "me_stand", frame: 0}],
            duration: 300
            //repeat: -1
        });

        this.anims.create({
            key: 'meJump',
            frames: [{key: "me_walk", frame: 0}],
            repeat: -1
        });

        this.anims.create({
            key: 'youWalk',
            frames: [{key: "you_walk", frame: 0},
                     {key: "you_stand", frame: 0}],
            frameRate: 7,
            delay: 300,
            repeat: -1
        });

        this.anims.create({
            key: 'youStand',
            frames: [{key: "you_stand", frame: 0}],
            repeat: -1
        });

        this.anims.create({
            key: 'youJump',
            frames: [{key: "you_walk", frame: 0}],
            repeat: -1
        });        

         console.log("preload done");
         console.log("start game");
         this.scene.start("platformerScene");
    }
}