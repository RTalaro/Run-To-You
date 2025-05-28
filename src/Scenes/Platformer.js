class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        this.ACCELERATION = 250;
        this.DRAG = 1800;
        this.physics.world.gravity.y = 900;
        this.JUMP_VELOCITY = -1500;
        this.stage = 0;
        this.midAnim = 0;
    }

    preload(){
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    // TODAY'S GOALS:
    // - finish level design
    // - add particle effects for walk and jump
    // - add collectibles
    // - add end of level signaling
    // - add game win
    // - add game restart


    create() {
        // create tilemap of 144x144 px tiles at 100 x 20 tiles
        this.map = this.add.tilemap("level1", 144, 144, 100, 20);

        // add tilesets: Tiled name, tilesheet key from Load.js
        this.farmTileset = this.map.addTilesetImage("farm", "farm");
        this.foodTileset = this.map.addTilesetImage("food", "food");
        this.lineTileset = this.map.addTilesetImage("line", "line");
        this.picoTileset = this.map.addTilesetImage("pico", "pico");
        this.pixelsBGTileset = this.map.addTilesetImage("pixels-bg", "pixels-bg");
        this.pixelsCharTileset = this.map.addTilesetImage("pixels-char", "pixels-char");
        this.pixelsGenTileset = this.map.addTilesetImage("pixels-gen", "pixels-gen");
        this.roguelikeColorTileset = this.map.addTilesetImage("roguelike_color", "roguelike_color");
        this.roguelikeMonochromeTileset = this.map.addTilesetImage("roguelike_monochrome", "roguelike_monochrome");
        this.tinyskiTileset = this.map.addTilesetImage("tinyski", "tinyski");
        this.tilesets = [this.farmTileset, this.foodTileset, this.lineTileset, this.picoTileset,
                         this.pixelsBGTileset, this.pixelsCharTileset, this.pixelsGenTileset,
                         this.roguelikeColorTileset, this.roguelikeMonochromeTileset, this.tinyskiTileset
                        ]
        
        // create tilemap layers
        this.bgLayer = this.map.createLayer("BG", this.tilesets, 0, 0);
        this.bgLayer.setScale(.3);
        this.platformLayer = this.map.createLayer("Plats", this.tilesets, 0, 0);
        this.platformLayer.setScale(0.3);

        // add collision
        this.platformLayer.setCollisionByProperty({
            collides: true
        });
        
        // add me
        my.sprite.player = this.physics.add.sprite(100, 700, "me_stand").setScale(5);
        my.sprite.player.body.setMaxVelocity(300);
        this.physics.add.collider(my.sprite.player, this.platformLayer);

        // add you
        my.sprite.you = this.physics.add.sprite(2700, 300, "you_stand").setScale(5/3);
        my.sprite.player.body.setMaxVelocity(300);
        this.physics.add.collider(my.sprite.you, this.platformLayer);

        /*// BRING THESE BACK
        // add bgm + sfx
        this.bgm = this.sound.add("bgm", {loop: true});
        this.bgm.play();
        this.walksfx = this.sound.add("walk_sfx", {loop: true, volume: 2});
        this.walksfx.play();
        this.walksfx.pause();
        */
       
        // add animated tiles
        this.animatedTiles.init(this.map);

        // add camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels*0.3, this.map.heightInPixels*0.3);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(1.2);

        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if(cursors.left.isDown && !this.midAnim){        // if moving left
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('meWalk', true);
            //if(my.sprite.player.body.blocked.down){
                //this.walksfx.resume();
            //}
        }
        else if(cursors.right.isDown && !this.midAnim){      // if moving right
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('meWalk', true);
            //if(my.sprite.player.body.blocked.down){
                //this.walksfx.resume();
            //}
        }
        else{           // if no input
            my.sprite.player.body.setAccelerationX(0);
            //this.walksfx.pause();
        }

        if(!my.sprite.player.body.acceleration.x){      // if acceleration 0
            my.sprite.player.anims.play('meStand');
        }

        if(!my.sprite.player.body.blocked.down){        // if in air
            my.sprite.player.anims.play('meJump');
            //this.walksfx.pause();
        }
        else{                                           // if on ground
            my.sprite.player.body.setDragX(500);
        }

        // on player jump
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up) && !this.midAnim){
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }
        
        // start cutscene 0
        if(this.stage == 0 && my.sprite.player.x >= 2520 && my.sprite.player.body.blocked.down){
            this.midAnim = 1;
            my.sprite.player.anims.play('meStand');
            my.sprite.you.setFlip(true, false);
            my.sprite.you.anims.play('youWalk');
            my.sprite.you.body.setAccelerationX(this.ACCELERATION-100);
            this.stage = 1;
        }

        // end cutscene
        if(!this.cameras.main.worldView.contains(my.sprite.you.x, my.sprite.you.y)){
            this.midAnim = 0;
        }
        console.log(this.midAnim);
    }

    to_stage_1 = () => {
        my.sprite.you.setFlip(true, false);
        my.sprite.you.anims.play('youWalk');
        my.sprite.you.body.setAccelerationX(this.ACCELERATION);
        this.stage = 1;
        my.sprite.player.body.setMaxVelocity(0);
    }
}