
// New name for the state 
var playState = {
	// Removed the preload function
	create: function ( ) { 
 		
 		

		this.wasd = { 
			up: 
			game.input.keyboard.addKey(Phaser.Keyboard.W), 
			left: 
			game.input.keyboard.addKey(Phaser.Keyboard.A), 
			right: 
			game.input.keyboard.addKey(Phaser.Keyboard.D) 
		};

		this.jumpSound = game.add.audio('jump'); 
		this.coinSound = game.add.audio('coin'); 
		this.deadSound = game.add.audio('dead');


		// Removed background color and physics system
		game.add.image(0, 0, 'background');
		this.cursor = game.input.keyboard.createCursorKeys();
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);

		this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player'); 
		game.camera.follow('player');

		//game.world.setBounds(0, -100, 1000, 1000);
		game.camera.follow(this.player);

		//this.player.anchor.setTo(0.5, 0.5); 
		game.physics.arcade.enable(this.player); 
		this.player.body.gravity.y = 500;

		// Create the 'right' animation by looping the frames 1 and 2 
 		this.player.animations.add('right', [1, 2], 8, true);
		// Create the 'left' animation by looping the frames 3 and 4 
		this.player.animations.add('left', [3, 4], 8, true);
		//this.player.body.collideWorldBounds = true

		
		this.enemies = game.add.group();
		this.enemies.enableBody = true; 
		this.enemies.createMultiple(90, 'enemy');

		this.coin = game.add.sprite(60, 140, 'coin'); 
		game.physics.arcade.enable(this.coin); 
		this.coin.anchor.setTo(0.5, 0.5);

		this.coin.animations.add('giro', [0,1,2,3,4,5], 8, true);
		this.coin.animations.play('giro');


		this.scoreLabel = game.add.text(30, 30, 'score: 0',{ font: '18px Arial', fill: '#ffffff' });
	

		// New score variable 
		game.global.score = 0;
		this.createWorld(); 

		//game.time.events.loop(game.global.loooop,this.addEnemy,this);
		this.nextEnemy = 0;


		//Explosion al morir
		// Create the emitter with 15 particles. We don't need to set the x and y 
		// Since we don't know where to do the explosion yet 
		this.emitter = game.add.emitter(0, 0, 15);
		// Set the 'pixel' image for the particles 
		this.emitter.makeParticles('pixel');

		// Set the y speed of the particles between -150 and 150 
		// The speed will be randomly picked between -150 and 150 for each particle 
		this.emitter.setYSpeed(-150, 150);
		// Do the same for the x speed 
		this.emitter.setXSpeed(-150, 150);
		// Use no gravity for the particles 
		this.emitter.gravity = 0;

		this.emitter.minRotation = 100; 
		this.emitter.maxRotation = 500;



		
		// If the game is running on a mobile device 
		if (!game.device.desktop) { 
			// Display the mobile inputs 
			this.addMobileInputs(); 
		}

		//game.add.tween(this.enemy).to({angle: 360}, 300).loop().start();
		
		
		this.music = game.add.audio('music'); // Add the music
		this.music.loop = true; // Make it loop 
		this.music.play(); // Start the music


	},

	update: function() {

		game.physics.arcade.collide(this.player, this.layer);

		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

		this.movePlayer();
		
		if (!this.player.inWorld) { 
				this.playerDie(); 
			}
		 
		game.physics.arcade.collide(this.enemies, this.layer);
		game.physics.arcade.collide(this.enemies, this.enemies);
		
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);


		// If the 'nextEnemy' time has passed 
		if (this.nextEnemy < game.time.now) { 
			var startt = 4000, end = 1000, scoree = 100;
			// Formula to decrease the delay between enemies over time 
			// At first it's 4000ms, then slowly goes to 1000ms 
			var delayy = Math.max(startt - (startt-end)*game.global.score/scoree, end);

			// We add a new enemy
			 this.addEnemy();
			// And we update 'nextEnemy' to have a new enemy in 2.2 seconds 
			this.nextEnemy = game.time.now + 2200;
		}


		// Add this line in the 'update' function of the play.js file
		// It will call 'checkPosition' for each enemy alive 
		this.enemies.forEachAlive(this.checkPosition, this);
		// And then we add the new function: 


		if(game.global.score >= 10){

			this.music.stop();
			this.coinSound.play();

			game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();
			game.add.tween(this.player.scale).to({x: 1, y: 1}, 50).to({x: 1.5, y: 1.5}, 150).start();

			game.time.events.add(2000, this.startplay2, this);
		}

	},


	startplay2: function(){
			game.state.start('play2');
	},


	checkPosition: function(enemy) { 
		if (enemy.y >= this.player.y  ) { 
			//enemy.kill(); 
		} 
	},

	// No changes
	takeCoin: function(player, coin) { 

		// Scale the coin to 0 to make it invisible 
		this.coin.scale.setTo(0, 0);

		// Grow the coin back to its original scale in 300ms 
		game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();

		// New score variable 
		game.global.score += 5; 
		this.scoreLabel.text = 'Score: ' + game.global.score;
		this.updateCoinPosition();

		game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();
		this.coinSound.play();


	},

	updateCoinPosition: function() {
		// Store all the possible coin positions in an array 
		var coinPosition = [
			{x: 140, y: 60}, {x: 360, y: 60}, // Top row 
			{x: 60, y: 140}, {x: 440, y: 140}, // Middle row
			{x: 130, y: 300}, {x: 370, y: 300} // Bottom row
		];

		// Remove the current coin position from the array 
		// Otherwise the coin could appear at the same spot twice in a row 
		for (var i = 0; i < coinPosition.length; i++) { 
			if (coinPosition[i].x === this.coin.x) 
				{ coinPosition.splice(i, 1); } 
		}

		// Randomly select a position from the array 
		var newPosition = coinPosition[ game.rnd.integerInRange(0, coinPosition.length-1)];
		// Set the new position of the coin 
		this.coin.reset(newPosition.x, newPosition.y);

	},
	addEnemy: function(){


		var ale = game.rnd.integerInRange(-1 , 1);
		while(ale == 0){
			ale = game.rnd.integerInRange(-1 , 1);
		}



    	// Get the first dead enemy of the group 
   		var enemy = this.enemies.getFirstDead();
   		var enemy2 = this.enemies.getFirstDead();
   		var enemy3 = this.enemies.getFirstDead();
		// If there isn't any dead enemy, do nothing 
		if (!enemy) { return; }

			// Initialise the enemy 
			enemy.anchor.setTo(0.5, 0.5); 
			enemy.reset(game.world.centerX, 0); 
			enemy.body.gravity.y = 500;
			enemy.body.velocity.x = 200 * ale; 
			enemy.body.bounce.x = 1; 
			enemy.checkWorldBounds = true; 
			enemy.outOfBoundsKill = true;
			//enemy.scale.setTo(.5,.5)
			enemy.animations.add('mover', [0,1,2,3], 16, true);
			enemy.animations.play('mover');
            enemy.scale.setTo(0.66,0.66);


			if(game.global.score >= 20 && game.global.score < 40){

			enemy.body.velocity.x = 200 * ale;

			var enemy2 = this.enemies.getFirstDead();
			enemy2.anchor.setTo(0.2, 0.5); 
			enemy2.reset(game.world.centerX, 0); 
			enemy2.body.gravity.y = 500;
			enemy2.body.velocity.x = 100 * ale; 
			enemy2.body.bounce.x = 1; 
			enemy2.checkWorldBounds = true; 
			enemy2.outOfBoundsKill = true;

			enemy2.scale.setTo(.5,.5);

			}
			else if(game.global.score >= 40  && game.global.score < 60){
				enemy.body.velocity.x = 200 * ale;	

			
			var enemy2 = this.enemies.getFirstDead();
			enemy2.anchor.setTo(0.5, 0.5); 
			enemy2.reset(game.world.centerX, 0); 
			enemy2.body.gravity.y = 500;
			enemy2.body.velocity.x = 100 * ale; 
			enemy2.body.bounce.x = 1; 
			enemy2.checkWorldBounds = true; 
			enemy2.outOfBoundsKill = true;
			

			}
			else if(game.global.score >= 60 && game.global.score < 80){
				enemy.body.velocity.x = 250 * ale;
			
			var enemy2 = this.enemies.getFirstDead();
			enemy2.anchor.setTo(0.5, 0.5); 
			enemy2.reset(game.world.centerX, 0); 
			enemy2.body.gravity.y = 500;
			enemy2.body.velocity.x = 150 * ale; 
			enemy2.body.bounce.x = 1; 
			enemy2.checkWorldBounds = true; 
			enemy2.outOfBoundsKill = true;	
			

			}
			else if(game.global.score >= 80){
				enemy.body.velocity.x = 300 * ale;
			
			var enemy2 = this.enemies.getFirstDead();
			enemy2.anchor.setTo(0.5, 0.5); 
			enemy2.reset(game.world.centerX, 0); 
			enemy2.body.gravity.y = 500;
			enemy2.body.velocity.x = 200 * ale; 
			enemy2.body.bounce.x = 1; 
			enemy2.checkWorldBounds = true; 
			enemy2.outOfBoundsKill = true;	
			
			
			var enemy3 = this.enemies.getFirstDead();
			enemy3.anchor.setTo(0.5, 0.5); 
			enemy3.reset(game.world.centerX, 0); 
			enemy3.body.gravity.y = 500;
			enemy3.body.velocity.x = 180 * ale; 
			enemy3.body.bounce.x = 1; 
			enemy3.checkWorldBounds = true; 
			enemy3.outOfBoundsKill = true
			enemy3.scale.setTo(1.5,1.5);
			}

			
			
			

	},
	// No changes
	playerDie: function() {

		// If the player is already dead, do nothing 
		if (!this.player.alive) {
				return; 
		}


		// Kill the player to make it disappear from the screen 
		this.player.kill();


		//Explosion
		// Set the position of the emitter on the player 
		this.emitter.x = this.player.x; 
		this.emitter.y = this.player.y;

		// Start the emitter, by exploding 15 particles that will live for 600ms 
		this.emitter.start(true, 1000, null, 15);

		this.deadSound.play();
		this.music.stop();



		// Call the 'startMenu' function in 1000ms 
		game.time.events.add(1000, this.startMenu, this);


	},

	startMenu: function(){
		// When the player dies, we go to the menu 
		game.state.start('menu');
	},

	createWorld: function() { 

		// Create the tilemap 
		this.map = game.add.tilemap('map');
		// Add the tileset to the map 
		this.map.addTilesetImage('tileset');
		// Create the layer, by specifying the name of the Tiled layer 
		this.layer = this.map.createLayer('Tile Layer 1');
		// Set the world size to match the size of the layer 
		this.layer.resizeWorld();

		// Enable collisions for the first element of our tileset (the blue wall) 
		this.map.setCollision(1);
	},

	movePlayer: function(){

		if (this.cursor.left.isDown || this.wasd.left.isDown){
			this.player.body.velocity.x = -250;
			this.player.animations.play('left'); // Start the left animation
		}
		else if (this.cursor.right.isDown || this.wasd.right.isDown){
			this.player.body.velocity.x = 250;
			this.player.animations.play('right'); // Start the left animation

		}
		else{
			this.player.body.velocity.x = 0;
			this.player.frame = 0; // Set the player frame to 0 (stand still)
		}

		if(this.cursor.up.isDown && this.player.body.onFloor() || this.wasd.up.isDown && this.player.body.onFloor()){
			this.player.body.velocity.y = -320;
			this.jumpSound.play();

			
		}

	},

	addMobileInputs: function() { 
		// Add the jump button 
		this.jumpButton = game.add.sprite(350, 247, 'jumpButton'); 
		this.jumpButton.inputEnabled = true; 
		this.jumpButton.alpha = 0.5;
		// Add the move left button 
		this.leftButton = game.add.sprite(50, 247, 'leftButton'); 
		this.leftButton.inputEnabled = true; 
		this.leftButton.alpha = 0.5;
		// Add the move right button 
		this.rightButton = game.add.sprite(130, 247, 'rightButton'); 
		this.rightButton.inputEnabled = true; 
		this.rightButton.alpha = 0.5;

		// Call 'jumpPlayer' when the 'jumpButton' is pressed 
		this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);

		// Movement variables 
		this.moveLeft = false; 
		this.moveRight = false;

		this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this); 
		this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this); 
		this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this); 
		this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this); 

		this.rightButton.events.onInputOver.add(function(){this.moveRight=true;}, this);
		this.rightButton.events.onInputOut.add(function(){this.moveRight=false;}, this); 
		this.rightButton.events.onInputDown.add(function(){this.moveRight=true;}, this); 
		this.rightButton.events.onInputUp.add(function(){this.moveRight=false;}, this); 
	},

	jumpPlayer: function() { 
		// If the player is touching the ground 
		if (this.player.body.touching.down) { 
			// Jump with sound 
			this.player.body.velocity.y = -320; 
		}
	},


};
// Removed Phaser and states initialisation
