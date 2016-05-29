/**********************************************************************************************************
Game Global Constants
**********************************************************************************************************/

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;

/**********************************************************************************************************
Attaching to Gameport
**********************************************************************************************************/
// Attach to the HTML document via gameport ID
var gameport = document.getElementById("gameport");

/**********************************************************************************************************
Aliasing 
**********************************************************************************************************/
// Using Aliasing 
var Container = PIXI.Container,
	autoDetectRenderer = PIXI.autoDetectRenderer,
	loader = PIXI.loader,
	resources = PIXI.loader.resources,
	TextureCache = PIXI.utils.TextureCache,
	Texture = PIXI.Texture,
	Sprite = PIXI.Sprite
	Text = PIXI.Text;
	
	
/**********************************************************************************************************
Creating the Stage and appending to Gameport
**********************************************************************************************************/	
// Creating the PIXI stage and renderer
var stage = new Container(),
	renderer = autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, {backgroundColor: 0x000000});
	
// Appying to the HTML view
gameport.appendChild(renderer.view);

/**********************************************************************************************************
Loader
**********************************************************************************************************/	

loader
	.add("images/assets.json")
	.load(setup);
	
/**********************************************************************************************************
Global Variables
**********************************************************************************************************/



/**********************************************************************************************************
Setup Function
**********************************************************************************************************/

function setup() {
	
	/*******************************************************************************************************
	Sprite Creation Setup
	*******************************************************************************************************/
	// Creating an alias to the texture atlas
	id = PIXI.loader.resources["images/assets.json"].textures;
	
	/*******************************************************************************************************
	Assigning Music Stuff 
	*******************************************************************************************************/
	
	// ASSIGN MUSIC STUFF HERE
	
	/*******************************************************************************************************
	Scene Creations
	*******************************************************************************************************/
	
	// Introduction Menu
	introScene = new Container();
	stage.addChild(introScene);
	
	// Instruction Scene
	instructScene = new Container();
	stage.addChild(instructScene);
	instructScene.visible = false;
	
		// Position to the Right of the Menu
		// Tween In
		instructScene.position.x = 800;
		instructScene.position.y = 0;
		
	// Credits Scene
	creditScene = new Container();
	stage.addChild(creditScene);
	creditScene.visible = false;	
	
		// Position to the Left of the Menu
		// Tween In
		creditScene.position.x = -800; 
		creditScene.position.y = 0;
	
	// Game Scene
	gameScene = new Container();
	stage.addChild(gameScene);
	gameScene.visible = false;
	
	// Game Over Scene
	gameOverScene = new Container();
	stage.addChild(gameOverScene);
	gameOverScene.visible = false;
	
	/*******************************************************************************************************
	Introduction Scene 
	*******************************************************************************************************/
	// Menu + Buttons
	introMenu = new Sprite (id["Introduction Screen.png"]);
	playBut = new Sprite(id["New Game Button.png"]);
	instructBut = new Sprite(id["How to Play Button.png"]);
	creditsBut = new Sprite(id["Credits Button.png"]);
	
	
	// Add introScene
	introScene.addChild(introMenu);
	
		// Buttons Container
		var introMenuButtons = new Container();
		introMenuButtons.position.x = 350;
		introMenuButtons.position.y = 270;
		introScene.addChild(introMenuButtons);
	
		// Play Button
		introMenuButtons.addChild(playBut);
		playBut.anchor.x = 0.5;
		playBut.anchor.y = 0.5;
		playBut.position.x = -550;
		playBut.position.y = 0;
		createjs.Tween.get(playBut.position).to({x: 0, y: 0}, 1000, createjs.Ease.bounceOut);	
		//playSound.play();
		playBut.interactive = true;
		playBut.on('mousedown', gameHandler)	
		
		// Instruction Button
		introMenuButtons.addChild(instructBut);
		instructBut.anchor.x = 0.5;
		instructBut.anchor.y = 0.5;
		instructBut.position.x = -550;
		instructBut.position.y = 120;
		createjs.Tween.get(instructBut.position).wait(500).to({x: 50, y: 120}, 1000, createjs.Ease.bounceOut);
		//	setTimeout(function(){instructSound.play();}, 750);
		instructBut.interactive = true;
		instructBut.on('mousedown',instructHandler);	
		
		// Credits button
		introMenuButtons.addChild(creditsBut);
		creditsBut.anchor.x = 0.5;
		creditsBut.anchor.y = 0.5;
		creditsBut.position.x = -550;
		creditsBut.position.y = 240;
		createjs.Tween.get(creditsBut.position).wait(1000).to({x: 100, y: 240}, 1000, createjs.Ease.bounceOut);
		//	setTimeout(function(){creditsTweenSound.play();}, 1250);
		creditsBut.interactive = true;
		creditsBut.on('mousedown', creditHandler);
	
	
	/*******************************************************************************************************
	Instructions Scene 
	*******************************************************************************************************/
	instructScreen = new Sprite(id["How to Play Screen.png"]);
	instructScene.addChild(instructScreen);
	
		// Back Button
		instructBack = new Sprite(id["Back Button.png"]);
		instructScene.addChild(instructBack);
		instructBack.anchor.x = 0.5;
		instructBack.anchor.y = 0.5;
		instructBack.position.x = 250;		
		instructBack.position.y = 500;		
		instructBack.interactive = true;
		instructBack.on('mousedown', generalBackHandler);
		
		// Will probably need a next button to transit different instruction images
	
	/*******************************************************************************************************
	Credits Scene 
	*******************************************************************************************************/
	creditScreen = new Sprite(id["Credits Screen.png"]);
	creditScene.addChild(creditScreen);
	
		// Back Button
		creditBack = new Sprite(id["Back Button.png"]);
		creditScene.addChild(creditBack);
		creditBack.anchor.x = 0.5;
		creditBack.anchor.y = 0.5;
		creditBack.position.x = 250;	
		creditBack.position.y = 500; 	
		creditBack.interactive = true;
		creditBack.on('mousedown', generalBackHandler);
		
	/*******************************************************************************************************
	Game Scene 
	*******************************************************************************************************/
	gameScreen = new Sprite(id["Game Screen.png"]);
	
	
	/*******************************************************************************************************
	Game Over Scene 
	*******************************************************************************************************/
	
	/*******************************************************************************************************
	Render Setup!
	*******************************************************************************************************/
	renderer.render(stage);
	state = introduction;
	gameLoop();
}

/**********************************************************************************************************
GameLoop 
**********************************************************************************************************/
function gameLoop() {
	requestAnimationFrame(gameLoop);
	state();
	renderer.render(stage);
}

/**********************************************************************************************************
State Functions
**********************************************************************************************************/

function introduction() {}

function game() {}

/**********************************************************************************************************
Handlers
**********************************************************************************************************/
	
	/*******************************************************************************************************
	Game Handler
	*******************************************************************************************************/
	function gameHandler(e){
		introScene.visible = false;
		state = game;
		gameScene.visible = true;
		// selectSound.play();
	}
	
	/*******************************************************************************************************
	How to Play/Instructions Handler
	*******************************************************************************************************/
	function instructHandler(e){
		introScene.visible = false;
		instructScene.visible = true;
		// selectSound.play();
		introScene.position.y = -800;
		
		createjs.Tween.get(instructScene.position).to({x: 0, y: 0}, 1000, createjs.Ease.bounceOut);
	
	}
	
	/*******************************************************************************************************
	Credits Handler
	*******************************************************************************************************/
	function creditHandler(e){
		introScene.visible = false;
		creditScene.visible = true;
		// selectSound.play();
		introScene.position.y = -800;
		createjs.Tween.get(creditScene.position).to({x: 0, y: 0}, 1000, createjs.Ease.bounceOut);
	}
	
	/*******************************************************************************************************
	General Back Handler
	*******************************************************************************************************/
	// Going back in the main menu
	function generalBackHandler(e){
		introScene.visible = true;
		instructScene.visible = false;
		creditScene.visible = false;
		// backSound.play();
		instructScene.position.x = 800;
		creditScene.position.x = -800;
		
		createjs.Tween.get(introScene.position).to({x: 0, y: 0}, 1000, createjs.Ease.bounceOut);
		
	}
/**********************************************************************************************************
Helper Functions
**********************************************************************************************************/

	/**********************************************************************************************************
	Keyboard Function
	**********************************************************************************************************/
	
	// Keyboard function to support general Ascii Key Codes function creation
	function keyboard(keyCode) {
		// Empty Key Object
		var key = {};
		// Code:keyCode
		key.code = keyCode;
		
		// Default Settings for button positions
		key.isDown = false;
		key.isUp = true;
		key.press = undefined;
		key.release = undefined;
	  
		// When the key is pressed, call the downHandler
		key.downHandler = function(event) {
			// Verify the keyCode parameter matches the object code
			if (event.keyCode === key.code) {
				// If the key is up then key press
				if (key.isUp && key.press) key.press();
				
				// Settings for button positions
				key.isDown = true;
				key.isUp = false;
			}
			// Cancels the event
			event.preventDefault();
		};

		//The is released, call the upHandler
		key.upHandler = function(event) {
			// Verify the keyCode parameter matches the object code
			if (event.keyCode === key.code) {
				// If the key is down and released then release
				if (key.isDown && key.release) key.release();
				
				// Setting for button positions
				key.isDown = false;
				key.isUp = true;
			}
		// Cancels the event
		event.preventDefault();
		};

	  //Attach event listeners
	  window.addEventListener(
		"keydown", key.downHandler.bind(key), false
	  );
	  window.addEventListener(
		"keyup", key.upHandler.bind(key), false
	  );
	  return key;
	}
