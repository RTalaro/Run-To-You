class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        this.ACCELERATION = 250;
        this.DRAG = 1800;
        this.physics.world.gravity.y = 900;
        this.JUMP_VELOCITY = -1500;
        this.PARTICLE_VELOCITY = 50;
        this.stage = 0;
        this.midAnim = 0;
        this.memories = 0;
        this.respawnx = 100;
        this.respawny = 720;
        this.found = ["YOU HAVE: A CRUSH!", "YOU MADE: BURGUN!", "YOU SOLVED: A PUZZLE!", "YOU HAVE: A BOYFRIEND!"];
    }

    preload(){
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    // TODAY'S GOALS:
    // - finish level design (done)
    // - add collectibles (done)
    // - add memory collect sfx (done)
    // - add memory UI (done)
    // - add game win (done)
    // - your behavior: just running (done)
    // - fix reset indicator and trail (done)


    create() {
        // create tilemap of 144x144 px tiles at 100 x 20 tiles
        this.bg = this.add.tilemap("level1", 144, 144, 100, 20);
        this.map = this.add.tilemap("level1", 144, 144, 100, 20);

        // add tilesets: Tiled name, tilesheet key from Load.js
        this.farmTileset = this.map.addTilesetImage("farm", "farm");
        this.foodTileset = this.map.addTilesetImage("food", "food");
        this.lineTileset = this.map.addTilesetImage("line", "line");
        this.picoTileset = this.map.addTilesetImage("pico", "pico");
        this.pixelsBGTileset = this.map.addTilesetImage("pixels-bg", "pixels-bg");
        this.pixelsCharTileset = this.map.addTilesetImage("pixels-char", "pixels-char");
        this.pixelsGenTileset = this.map.addTilesetImage("pixels-gen", "pixels-gen");
        this.tinyskiTileset = this.map.addTilesetImage("tinyski", "tinyski");
        this.tilesets = [this.farmTileset, this.foodTileset, this.lineTileset,
                         this.picoTileset, this.pixelsBGTileset, this.pixelsCharTileset,
                         this.pixelsGenTileset, this.tinyskiTileset]
        
        // create tilemap layers
        this.bgLayer = this.bg.createLayer("BG", this.tilesets, 0, 0);
        this.bgLayer.setScale(.3);
        this.layerLayer = this.map.createLayer("Layering", this.tilesets, 0, 0);
        this.layerLayer.setScale(0.3);
        this.platformLayer = this.map.createLayer("Plats", this.tilesets, 0, 0);
        this.platformLayer.setScale(0.3);

        // add collision
        this.platformLayer.setCollisionByProperty({
            collides: true
        });
        this.layerLayer.setCollisionByProperty({
            collides: true
        });


        // add me
        my.sprite.player = this.physics.add.sprite(this.respawnx, this.respawny, "me_stand").setScale(5);
        my.sprite.player.body.setMaxVelocity(300);
        this.physics.add.collider(my.sprite.player, this.layerLayer);
        this.physics.add.collider(my.sprite.player, this.platformLayer);
        my.vfx.walk = this.add.particles(0, 0, "walk_vfx", {
            random: true,
            scale: {start: .1, end: .25},
            maxAliveParticles: 8,
            lifespan: 400,
            alpha: {start: 1, end: 0.1}
        });
        my.vfx.walk.stop();
        
        my.vfx.jump = this.add.particles(0, 0, "jump_vfx", {
            scale: {start: .1, end: .1},
            maxAliveParticles: 4,
            lifespan: 200,
            alpha: {start: 1, end: 1}
        });
        my.vfx.jump.stop();


        
        // add memories
        this.myHeartMemory = this.physics.add.sprite(2600, 460, "heart_1").setScale(.2);
        this.myHeartMemory.anims.play('heart');
        this.myHeartMemory.setMaxVelocity(0);
        this.physics.add.overlap(my.sprite.player, this.myHeartMemory, (obj1, obj2) => {
            this.collectsfx.play();
            this.memories++;
            this.respawnx = my.sprite.player.x;
            this.respawny = my.sprite.player.y;
            obj2.destroy();
            this.collect = this.add.bitmapText(my.sprite.player.x, my.sprite.player.y-100, "font", this.found[0], 50).setOrigin(.5);
            my.sprite.player.setDepth(1);
        });
        this.burgerMemory = this.physics.add.sprite(5400, 584, "burger").setScale(.2);
        this.burgerMemory.setMaxVelocity(0);
        this.physics.add.overlap(my.sprite.player, this.burgerMemory, (obj1, obj2) => {
            this.collectsfx.play();
            this.memories++;
            this.respawnx = my.sprite.player.x;
            this.respawny = my.sprite.player.y;
            obj2.destroy();
            this.collect = this.add.bitmapText(my.sprite.player.x, my.sprite.player.y-100, "font", this.found[1], 50).setOrigin(.5);
            my.sprite.player.setDepth(1);
        });
        this.puzzleMemory = this.physics.add.sprite(6715, 498, "puzzle").setScale(.2);
        this.puzzleMemory.setMaxVelocity(0);
        this.physics.add.overlap(my.sprite.player, this.puzzleMemory, (obj1, obj2) => {
            this.collectsfx.play();
            this.memories++;
            this.respawnx = my.sprite.player.x;
            this.respawny = my.sprite.player.y;
            obj2.destroy();
            this.collect = this.add.bitmapText(my.sprite.player.x, my.sprite.player.y-50, "font", this.found[2], 50).setOrigin(.5);
            my.sprite.player.setDepth(1);
        });
        this.yourHeartMemory = this.physics.add.sprite(8375, 411, "heart_1").setScale(.2);
        this.yourHeartMemory.play('heart');
        this.yourHeartMemory.setMaxVelocity(0);
        this.physics.add.overlap(my.sprite.player, this.yourHeartMemory, (obj1, obj2) => {
            this.midAnim = 1;
            this.collectsfx.play();
            this.memories++;
            this.respawnx = my.sprite.player.x;
            this.respawny = my.sprite.player.y;
            obj2.destroy();
            this.collect = this.add.bitmapText(8272, 411-50, "font", this.found[3], 50).setOrigin(.5);
            my.sprite.you.anims.play("youWalk");
            my.sprite.you.setAccelerationX(-50);
            my.sprite.you.setMaxVelocity(20);
            my.sprite.player.setDepth(1);
            my.sprite.player.anims.play("meStand");
            my.sprite.player.setAccelerationX(0);
        });

        // add you
        my.sprite.you = this.physics.add.sprite(this.myHeartMemory.x, this.myHeartMemory.y, "you_stand").setScale(5/3);
        my.sprite.you.body.setMaxVelocity(300);
        this.physics.add.collider(my.sprite.you, this.platformLayer);

        this.physics.add.overlap(my.sprite.player, my.sprite.you, (obj1, obj2) => {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setMaxVelocity(0);
            this.collect = this.add.bitmapText(8500, 500, "font", "WE WON :)", 50).setOrigin(.5);
            my.sprite.you.setAccelerationX(0);
            my.sprite.you.setMaxVelocity(0);
            this.add.sprite(8600, 620, "redo").setScale(2);
            this.add.sprite(8600, 645, "r").setScale(1);
            my.sprite.you.anims.play("youStand");
            my.sprite.player.anims.play("meStand");
        });

        // BRING THESE BACK
        // add bgm + sfx
        this.bgm = this.sound.add("bgm", {loop: true});
        this.bgm.setVolume(.1);
        this.walksfx = this.sound.add("walk_sfx", {loop: true});
        this.foundsfx = this.sound.add("found", {loop: false, volume: 1.25});
        this.collectsfx = this.sound.add("collectsfx", {loop: false, volume: .4});
        this.bgm.play();
        this.walksfx.play();
        this.walksfx.pause();
        
       
        // add animated tiles
        this.animatedTiles.init(this.map);

        // add camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels*0.3, this.map.heightInPixels*0.3);
        this.cameras.main.setZoom(2.5);
        this.bgLayer.setScrollFactor(.25, .25);
        this.cameras.main.startFollow(my.sprite.player, true);
        this.cameras.main.setDeadzone(50, 50);

        cursors = this.input.keyboard.createCursorKeys();
        // reset game
        this.input.keyboard.on('keydown-R', () => {
            this.bgm.destroy();
            this.scene.start("platformerScene");
        }, this);
        this.keyA = this.input.keyboard.addKey('A');
        this.keyD = this.input.keyboard.addKey('D');
        this.keyW = this.input.keyboard.addKey('W');

    }

    update() {
        console.log(my.sprite.you.x, my.sprite.you.y);
        if((cursors.left.isDown || this.keyA.isDown) && !this.midAnim){        // if moving left
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('meWalk', true);
            my.vfx.walk.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walk.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if(my.sprite.player.body.blocked.down){
                my.vfx.walk.start();
                this.walksfx.resume();
            }
        }
        else if((cursors.right.isDown || this.keyD.isDown) && !this.midAnim){      // if moving right
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('meWalk', true);
            my.vfx.walk.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walk.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if(my.sprite.player.body.blocked.down){
                my.vfx.walk.start();
                this.walksfx.resume();
            }
        }
        else{           // no input or if mid animation
            my.sprite.player.body.setAccelerationX(0);
            my.vfx.walk.stop();
            this.walksfx.pause();
        }

        if(!my.sprite.player.body.acceleration.x){      // if acceleration 0
            my.sprite.player.anims.play('meStand');
        }

        if(!my.sprite.player.body.blocked.down){        // if in air
            my.sprite.player.anims.play('meJump');
            this.walksfx.pause();
        }
        else{                                           // if on ground
            my.sprite.player.body.setDragX(500);
            my.vfx.jump.stop();
        }

        // on player jump
        if(my.sprite.player.body.blocked.down && (Phaser.Input.Keyboard.JustDown(cursors.up) || this.keyW.isDown) && !this.midAnim && this.memories < 4){
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.jump.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.jump.start();
        }

        // start cutscene 0
        if(this.stage == 0 && my.sprite.player.x >= 2420){
            this.stage += 0.5;
            this.cameras.main.stopFollow();
            this.cameras.main.pan(my.sprite.player.x+20, 427, 2000, "Sine.easeInOut");
            this.cameras.main.zoomTo(2.5, 300);
            this.midAnim = 1;
            my.sprite.player.anims.play('meStand');
            my.sprite.you.setFlip(true, false);
            my.sprite.you.anims.play('youWalk');
            my.sprite.you.body.setAccelerationX(this.ACCELERATION-200);
        }
        else if(this.stage == 1 && (my.sprite.player.x >= 4800 || this.cameras.main.worldView.contains(my.sprite.you.x, my.sprite.you.y))){
            this.stage += 0.5;
            this.cameras.main.stopFollow();
            this.cameras.main.pan(my.sprite.you.x-250, 584, 2000, "Sine.easeInOut");
            this.cameras.main.zoomTo(2.5, 300);
            this.midAnim = 1;
            my.sprite.player.anims.play('meStand');
            my.sprite.you.setFlip(true, false);
            my.sprite.you.anims.play('youWalk');
            my.sprite.you.body.setMaxVelocity(300);
            my.sprite.you.body.setAccelerationX(this.ACCELERATION-200);
        }
        else if(this.stage == 2 && (my.sprite.player.x >= 6525 || this.cameras.main.worldView.contains(my.sprite.you.x, my.sprite.you.y))){
            this.stage += 0.5;
            this.cameras.main.stopFollow();
            this.cameras.main.pan(my.sprite.you.x-250, 498, 2000, "Sine.easeInOut");
            this.cameras.main.zoomTo(2.5, 300);
            this.midAnim = 1;
            my.sprite.player.anims.play('meStand');
            my.sprite.you.setFlip(true, false);
            my.sprite.you.anims.play('youWalk');
            my.sprite.you.body.setMaxVelocity(300);
            my.sprite.you.body.setAccelerationX(this.ACCELERATION-200);
        }

        // end cutscene when you fall off
        if(my.sprite.you.y > this.map.heightInPixels*.4 && this.stage%1){
            if(this.memories == 0){
                this.foundsfx.play();
            }
            if(this.stage == 0.5){
                this.respawnYouAt(5200, 584.75);
            }
            if(this.stage == 1.5){
                this.respawnYouAt(this.puzzleMemory.x+50, this.puzzleMemory.y);
            }
            if(this.stage == 2.5){
                this.respawnYouAt(8491, 411);
                my.sprite.you.resetFlip();
                my.sprite.you.body.setMaxVelocity(0.00001);
                my.sprite.you.anims.play('youStand');
            }
        }

        // if player falls, send to top
        if(!this.cameras.main.worldView.contains(my.sprite.player.x, my.sprite.player.y)){
            //console.log("out of camera");
            // respawn player
            my.sprite.player.x = this.respawnx;
            my.sprite.player.y = this.respawny;
        }

        console.log("stage", this.stage);
        console.log("memory", this.memories);
    }

    respawnYouAt(x, y){
        // respawn you
        my.sprite.you.body.setMaxVelocity(0.00001);
        my.sprite.you.x = x;
        my.sprite.you.y = y;
        
        // end animation
        this.midAnim = 0;
        this.cameras.main.zoomTo(2);
        this.cameras.main.startFollow(my.sprite.player, true);

        // set ready to receive cutscene
        this.stage += 0.5;
    }
}