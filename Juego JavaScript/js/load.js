var loadState = {
	preload: function () { 
	// Add a 'loading...' label on the screen 
	var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' }); 
	loadingLabel.anchor.setTo(0.5, 0.5);
	// Display the progress bar 
	var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar'); 
	progressBar.anchor.setTo(0.5, 0.5); 
	game.load.setPreloadSprite(progressBar);
	// Load all our assets
	//game.load.image('player', 'img/player.png');
	game.load.spritesheet('player', 'img/player2.png', 20, 20);
	game.load.spritesheet('coin', 'img/coin2.png', 32, 32);
	game.load.spritesheet('enemy', 'img/enemy2.png', 32, 32);

 
	//game.load.image('enemy', 'img/enemy.png');
	//game.load.image('coin', 'img/coin.png'); 
    game.load.image('tileset', 'img/tileset.png'); 
	game.load.tilemap('map', 'img/map01.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap('map2', 'img/map.json', null, Phaser.Tilemap.TILED_JSON);


	game.load.image('pixel', 'img/pixel2.png');

	// Load a new asset that we will use in the menu state
	game.load.image('background', 'img/background3.png');

	game.load.spritesheet('mute', 'img/muteButton.png', 28, 22);

	game.load.image('jumpButton', 'img/jumpButton.png'); 
	game.load.image('rightButton', 'img/rightButton.png'); 
	game.load.image('leftButton', 'img/leftButton.png');


	// Sound when the player jumps 
	game.load.audio('jump', ['img/jump.ogg', 'img/jump.mp3']);
	// Sound when the player takes a coin
	 game.load.audio('coin', ['img/coin.ogg', 'img/coin.mp3']);
	// Sound when the player dies 
	game.load.audio('dead', ['img/dead.ogg', 'img/dead.mp3']);

	game.load.audio('music', ['img/bass.mp3']);



	},
	create: function() { 
		// Go to the menu state 
		game.state.start('menu');
	}
};
