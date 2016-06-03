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
	.add("audio/Arrow Tower.mp3")
	.add("audio/Back.mp3")
	.add("audio/Defeat.mp3")
	.add("audio/Life Lost.mp3")
	.add("audio/Long Shot.mp3")
	.add("audio/Quick Tower.mp3")
	.add("audio/Select.mp3")
	.add("audio/Small Tower.mp3")
	.load(setup);
	
/**********************************************************************************************************
Global Variables
**********************************************************************************************************/
var towers = [];	// all towers
var bullets = [];	// all bullets
var money = 300; 	// Money Variable, and starter money
var mousePosition = renderer.plugins.interaction.mouse.global;	// Current Mouse Position	
var enemies = [];	// Total enemies
var addedLife = 0; // Used to increment difficulty
var defeated = 0;	// Counter for defeated enemies
var addEnemyTimer = 100;	// Timer for enemies
var selectedTower;	// Selected Tower
var lives = 10;		// Life Count

// Rectangle to check if enemies pass
var enemyPass = new PIXI.Rectangle(800,302,100,40);

// Text Variables
var defeatedText = new Text('Defeated: ' + defeated, {font : '24px Impact'});
var moneyText = new Text('Gold: ' + money, {font : '24px Impact'});
var livesText = new Text('Lives: '+ lives, {font : '24px Impact'} );
var towerInformationText = new Text(' ', {font : '24px Impact'});
			
// Music Variables
var arrowTowerSound,
	backSound,
	defeatSound,
	lifeLostSound,
	longTowerSound,
	quickTowerSound,
	selectSound,
	smallTowerSound;

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
	// Music Variables assigned music files	
	arrowTowerSound = PIXI.audioManager.getAudio("audio/Arrow Tower.mp3");
	backSound = PIXI.audioManager.getAudio("audio/Back.mp3");
	defeatSound = PIXI.audioManager.getAudio("audio/Defeat.mp3");
	lifeLostSound = PIXI.audioManager.getAudio("audio/Life Lost.mp3");
	longTowerSound = PIXI.audioManager.getAudio("audio/Long Shot.mp3");
	quickTowerSound = PIXI.audioManager.getAudio("audio/Quick Tower.mp3");
	selectSound = PIXI.audioManager.getAudio("audio/Select.mp3");
	smallTowerSound = PIXI.audioManager.getAudio("audio/Small Tower.mp3");
	
	// Lowering Volume because it gets repetitive. important noises are louder.
	arrowTowerSound.volume = 0.1;
	defeatSound.volume = 0.2;
	lifeLostSound.volume = 0.4;
	longTowerSound.volume = 0.1;
	quickTowerSound.volume = 0.1;
	smallTowerSound.volume = 0.1;
	
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
	// Timeout interactivity so the user doesn't click on anything while tweening by accident.
	setTimeout(function(){
		playBut.interactive = true;
		instructBut.interactive = true;
		creditsBut.interactive = true;
		}, 2000);
	
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
		playBut.interactive = false;
		playBut.on('mousedown', gameHandler)	
		
		// Instruction Button
		introMenuButtons.addChild(instructBut);
		instructBut.anchor.x = 0.5;
		instructBut.anchor.y = 0.5;
		instructBut.position.x = -550;
		instructBut.position.y = 120;
		createjs.Tween.get(instructBut.position).wait(500).to({x: 50, y: 120}, 1000, createjs.Ease.bounceOut);
		instructBut.interactive = false;
		instructBut.on('mousedown',instructHandler);	
		
		// Credits button
		introMenuButtons.addChild(creditsBut);
		creditsBut.anchor.x = 0.5;
		creditsBut.anchor.y = 0.5;
		creditsBut.position.x = -550;
		creditsBut.position.y = 240;
		createjs.Tween.get(creditsBut.position).wait(1000).to({x: 100, y: 240}, 1000, createjs.Ease.bounceOut);
		creditsBut.interactive = false;
		creditsBut.on('mousedown', creditHandler);
	
	/*******************************************************************************************************
	Instructions Scene 
	*******************************************************************************************************/
	instructScreen = new Sprite(id["How to Play.png"]);
	instructScene.addChild(instructScreen);
	
		// Back Button
		instructBack = new Sprite(id["Back Button.png"]);
		instructScene.addChild(instructBack);
		instructBack.anchor.x = 0.5;
		instructBack.anchor.y = 0.5;
		instructBack.position.x = 650;		
		instructBack.position.y = 500;		
		instructBack.interactive = true;
		instructBack.on('mousedown', generalBackHandler);
	
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
	// Game Screen Composition
	// Made of several picture, grass, road, and interface.
	var gameScreen = new Container();
	gameScene.addChild(gameScreen);
	
	// Elements of the Game Screen
	grass = new Sprite(id["Grass.png"]);
	road = new Sprite(id["Road.png"]);
	gameInterface = new Sprite(id["Interface.png"]);	// Holds the Buttons, Tower Information, and Game Information
	
	// Grass is Positioned at the top coordinates
	// Grass is interactive at times when a tower is selected
	gameScreen.addChild(grass);
	grass.position.x = 0;
	grass.position.y = 0;
	
	// Road Positioned slightly down. Grass has a portion of the map missing for
	// grass.png. However in retrospect, it's not needed.
	gameScreen.addChild(road);
	road.position.x = 0;
	road.position.y = 40;
	road.interactive = false;
	
	// Interface is positioned at the bottom of the screen below the grass
	// Interface itself is not interactive
	gameScreen.addChild(gameInterface);
	gameInterface.position.x = 0;
	gameInterface.position.y = 446;
	gameInterface.interactive = false;
	
		// Tower Button Sprites
		arrowTowerBut = new Sprite(id["Arrow Tower Button.png"]);
		quickTowerBut = new Sprite(id["Quick Tower Button.png"]);
		longTowerBut = new Sprite(id["Long Tower Button.png"]);
		smallTowerBut = new Sprite(id["Small Tower Button.png"]);
	
		// Tower's Button Container
			/*
			Contains the buttons for the towers.
			Buttons will be inactive until the player has enough money 
			to purchase the tower.
			*/
			
		var towerButtons = new Container();
		towerButtons.position.x = 0;
		towerButtons.position.y = 110;
		gameInterface.addChild(towerButtons);
		
			// Arrow Tower Button
			towerButtons.addChild(arrowTowerBut);
			arrowTowerBut.anchor.x = 0.5;
			arrowTowerBut.anchor.y = 0.5;
			arrowTowerBut.position.x = 50;
			arrowTowerBut.position.y = 0;
			arrowTowerBut.interactive = true;
			arrowTowerBut.on('mousedown', arrowTowerButtonHandler);
			
			// Quick Tower Button
			towerButtons.addChild(quickTowerBut);
			quickTowerBut.anchor.x = 0.5;
			quickTowerBut.anchor.y = 0.5;
			quickTowerBut.position.x = 150;
			quickTowerBut.position.y = 0;
			quickTowerBut.interactive = true;
			quickTowerBut.on('mousedown', quickTowerButtonHandler);
			
			// Long Tower Button
			towerButtons.addChild(longTowerBut);
			longTowerBut.anchor.x = 0.5;
			longTowerBut.anchor.y = 0.5;
			longTowerBut.position.x = 250;
			longTowerBut.position.y = 0;
			longTowerBut.interactive = true;
			longTowerBut.on('mousedown', longTowerButtonHandler);
			
			// Small Tower Button
			towerButtons.addChild(smallTowerBut);
			smallTowerBut.anchor.x = 0.5;
			smallTowerBut.anchor.y = 0.5;
			smallTowerBut.position.x = 350;
			smallTowerBut.position.y = 0;
			smallTowerBut.interactive = true;
			smallTowerBut.on('mousedown', smallTowerButtonHandler);
		
		// Information Container
			/*
			Contains information regarding:
			1. Wave Number
			2. Credits / Gold
			3. Defeat
			Updated in game.
			*/
			
		var userInterfaceInfo = new Container();
		gameInterface.addChild(userInterfaceInfo);
		userInterfaceInfo.position.x = 655;
		userInterfaceInfo.position.y = 20;
				
			// Defeated Text
			userInterfaceInfo.addChild(defeatedText);
			defeatedText.position.x = 0;
			defeatedText.position.y = 0;
			
			// Money Text
			userInterfaceInfo.addChild(moneyText);
			moneyText.position.x = 0;
			moneyText.position.y = 40;
			
			// Lives Text
			userInterfaceInfo.addChild(livesText);
			livesText.position.x = 0;
			livesText.position.y = 80;
			
			
			
		// Tower Information Container
			/*
			Purpose is to provide information to the player on the following:
			1. Name of the Tower
			2. Damage
			3. Attack Rate
			4. Range
			Updated in game.
			*/
			
		var towerInformation = new Container();
		towerInformation.position.x = 455;
		towerInformation.position.y = 0;
		gameInterface.addChild(towerInformation);
		
			towerInformation.addChild(towerInformationText);
			towerInformationText.position.x = 0;
			towerInformationText.position.y = 20;
		
	
	
	/*******************************************************************************************************
	Game Over Scene 
	*******************************************************************************************************/
	var loseScreen = new Sprite(id["Lose Screen.png"]);
	gameOverScene.addChild(loseScreen);
	
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

function game() {
	checkForDefeat();	// Checks for enemies that are defeated
	addEnemyTimer--;	// Timer counts down
	moneyText.text = 'Gold: ' + money;	
	livesText.text = 'Lives: ' + lives;
	defeatedText.text = 'Killed: ' + defeated;	// used killed instead to save space for larger numbers
	
	/*
	Simple if statement to check what tower is selected, depending on what tower is selected, display 
	the information of that tower. Values are hard coded so text doesn't screw up in any way. Additionally
	there is no 'tower' objects right away unless they are created.
	*/
	if(selectedTower == null){
		towerInformationText.text = (' ');
	}
	else if(selectedTower == "Arrow Tower"){
		towerInformationText.text = ('Arrow Tower \n' + 'Damage: 50 \n' + 'Attack Rate: x1\n' + 'Range: 100 \n');
	}
	else if(selectedTower == "Quick Tower"){
		towerInformationText.text = ('Quick Tower\n' + 'Damage: 75\n' + 'Attack Rate: x2\n' + 'Range: 80 \n');
	}
	else if(selectedTower == "Long Tower"){
		towerInformationText.text = ('Long Tower\n' + 'Damage: 75 \n' + 'Attack Rate: x3/4 \n' + 'Range: 200 \n');
	}
	else if(selectedTower == "Small Tower"){
		towerInformationText.text = ('Small Tower\n' + 'Damage: 50\n' + 'Attack Rate: x3/4 \n' + 'Range: 100\n');
	}
	else{
		towerInformationText.text = (' ');
	}
	
	// If the addEnemyTimer is below 1, create an enemy and reset
	if(addEnemyTimer < 1){
		addEnemy();
		addEnemyTimer = 100;
		
	}
	/*
	Moves all enemies in the enemy array, additionally it checks to see if an enemy
	crosses the goal line. If so, delete the enemy and tween. Tick the life counter 
	down and remove the enemy from the array.
	*/
	for(var i = 0, j = enemies.length; i < j; i++){
		enemies[i].move();
		if(enemyPass.contains(enemies[i].x - enemies[i].width ,enemies[i].y) == true){
			lifeLostSound.play();
			createjs.Tween.removeTweens(enemies[i]);
			gameScene.removeChild(enemies[i]);
			enemies.splice(i,1);
			lives--;
			i--;
			j--;
		}
	}
	// Lets all the towers find a target, get their vectors and fire.
	for(var i = 0, j = towers.length; i < j; i++){
		towers[i].findTarget();
		towers[i].findVector();
		towers[i].fire();
	}
	// Lets all of the bullets move and checks to see if they hit their target
	// If so, remove from the game (tween, sprite, and array value).
	for(var i = 0, j = bullets.length; i < j; i++){
		bullets[i].move();
		if(bullets[i].checkForHit()){
			createjs.Tween.removeTweens(bullets[i]);
			gameScene.removeChild(bullets[i]);
			bullets.splice(i,1);
			j--;
			i--;
		}
	}
	// If the player loses all of his/her lives, transit to the loss state.
	if(lives == 0)
	{
		state = loss;
	}
}

function loss(){
	gameScene.visible = false;
	gameOverScene.visible = true;
}


/**********************************************************************************************************
Menu Handlers
**********************************************************************************************************/
	
	/*******************************************************************************************************
	Game Handler
	*******************************************************************************************************/
	function gameHandler(e){
		introScene.visible = false;
		state = game;
		gameScene.visible = true;
		selectSound.play();
	}
	
	/*******************************************************************************************************
	How to Play/Instructions Handler
	*******************************************************************************************************/
	function instructHandler(e){
		introScene.visible = false;
		instructScene.visible = true;
		selectSound.play();
		introScene.position.y = -800;
		createjs.Tween.get(instructScene.position).to({x: 0, y: 0}, 1000, createjs.Ease.bounceOut);
	}
	
	/*******************************************************************************************************
	Credits Handler
	*******************************************************************************************************/
	function creditHandler(e){
		introScene.visible = false;
		creditScene.visible = true;
		selectSound.play();
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
		backSound.play();
		instructScene.position.x = 800;
		creditScene.position.x = -800;
		
		createjs.Tween.get(introScene.position).to({x: 0, y: 0}, 1000, createjs.Ease.bounceOut);
	}

/**********************************************************************************************************
Tower Button Handlers
**********************************************************************************************************/
function arrowTowerButtonHandler(){
	// If the player doesn't have enough money, leave the handler
	if (money < 100){
		grass.interactive = false;
		selectedTower = null;
		return null;
	}

	// Else, select the arrow tower, and make the grass interactive
	grass.interactive = true;
	selectedTower = "Arrow Tower";
	changeTower(selectedTower);
	selectSound.play();
}

function quickTowerButtonHandler(){
	// If the player doesn't have enough money, leave the handler.
	if (money < 125){
		grass.interactive = false;
		selectedTower = null;
		return null;
	}
	
	// Else, select the quick tower and make the grass interactive
	grass.interactive = true;
	selectedTower = "Quick Tower";
	changeTower(selectedTower);
	selectSound.play();
}

function longTowerButtonHandler(){
	// If the player doesn't have enough money, leave the handler
	if (money < 150){
		grass.interactive = false;
		selectedTower = null;
		return null;
	}
	
	// Else, select the long tower and make grass interactive
	grass.interactive = true;
	selectedTower = "Long Tower";
	changeTower(selectedTower);
	selectSound.play();
}

function smallTowerButtonHandler(){
	// If the player doesn't have enough money, leave the handler
	if(money < 100){
		grass.interactive = false;
		selectedTower = null;
		return null;
	}
	// Else, select the small tower, and make the grass interactive
	grass.interactive = true;
	selectedTower = "Small Tower";
	changeTower(selectedTower);
	selectSound.play();
}

/*******************************************************************************************************
Tower Setup(s)
*******************************************************************************************************/
function longTowerSetup(x,y){
	// Properties of the Long Tower
	var longTower = new Sprite(id["Long Tower.png"]);	
	longTower.anchor.x = 0.5;
	longTower.anchor.y = 0.5;
	longTower.scale.x = 0.7;
	longTower.scale.y = 0.7;
	longTower.x = x;
	longTower.y = y;
	longTower.attackRate = 125;		// Higher Number, lower Attack Speed
	longTower.damage = 75;			// Damage dealt
	longTower.cost = 150;			// Cost
	longTower.range = 200;			// Range
	longTower.target = null;		// No target
	grass.addChild(longTower);		
	
	
	
// Lets the long tower find a target
longTower.findTarget = function() {
	// If there are no enemies, then there is no target
	if(enemies.length === 0) {
		longTower.target = null;
		return;
	}
	// If the target is defeated, then remove target
	if(longTower.target && longTower.target.life <= 0) {
		longTower.target = null;
	}
	// Find the first enemy within the range and target
	for(var i = 0, j = enemies.length; i < j; i++){
		var dist = (enemies[i].x-longTower.x)*(enemies[i].x-longTower.x)+
			(enemies[i].y-longTower.y)*(enemies[i].y-longTower.y);
		if(dist < (longTower.range * longTower.range)) {
			longTower.target = enemies[i];
			return;
		}
	}
}

// Lets the Long Tower Fire
longTower.fire = function() {
	longTower.attackRate--;
	if(longTower.target && longTower.attackRate <= 0) {
		bullets.push(bulletSetup(longTower.x, longTower.y, longTower.target, longTower.damage));
		longTower.attackRate = 125;
		longTowerSound.play();
	}
}

// Need to find Vector for bullets
longTower.findVector = function() {
	// If there is no target, then return false
	if (this.target == null)
		return false;
	var xDistance = longTower.target.x - longTower.x;
	var yDistance = longTower.target.y - longTower.y;
	var dist = Math.sqrt(xDistance * xDistance + yDistance*yDistance);	// a^2 + b^2 = c^2, solved for c
	longTower.xFire = longTower.x  * xDistance / dist;
	longTower.yFire = longTower.y  * yDistance / dist;
}

return longTower;
}

function quickTowerSetup(x,y){
	var quickTower = new Sprite(id["Quick Tower.png"]);
	quickTower.anchor.x = 0.5;
	quickTower.anchor.y = 0.5;
	quickTower.scale.x = 0.7;
	quickTower.scale.y = 0.7;
	quickTower.x = x;
	quickTower.y = y;
	quickTower.attackRate = 50;		// Higher Number, slower attack rate
	quickTower.damage = 75;			// Damage Dealt	
	quickTower.cost = 125;			// Cost of the Tower
	quickTower.range = 80;			// Range of the Tower
	quickTower.target = null;		// Target of the tower
	grass.addChild(quickTower);
		
// Lets the Quick Tower find a target
quickTower.findTarget = function() {
	// If there are no enemies, then there is no target
	if(enemies.length === 0) {
		quickTower.target = null;
		return;
	}
	// If the target is defeated, then remove target
	if(quickTower.target && quickTower.target.life <= 0) {
		quickTower.target = null;
	}
	// Find the first enemy within the range and target
	for(var i = 0, j = enemies.length; i < j; i++){
		
		var dist = (enemies[i].x-quickTower.x)*(enemies[i].x-quickTower.x)+
			(enemies[i].y-quickTower.y)*(enemies[i].y-quickTower.y);
		if(dist < (quickTower.range * quickTower.range)) {
			quickTower.target = enemies[i];
			return;
		}
	}
}

// Lets the Quick Tower Fire
quickTower.fire = function() {
	quickTower.attackRate--;
	if(quickTower.target && quickTower.attackRate <= 0) {
		bullets.push(bulletSetup(quickTower.x, quickTower.y, quickTower.target, quickTower.damage));
		quickTower.attackRate = 50;
		quickTowerSound.play();
	}
}
	
// Need to find Vector for bullets
quickTower.findVector = function() {
	// If there is no target, then return false
	if (this.target == null)
		return false;
	var xDistance = quickTower.target.x - quickTower.x;
	var yDistance = quickTower.target.y - quickTower.y;
	var dist = Math.sqrt(xDistance * xDistance + yDistance*yDistance);	// a^2 + b^2 = c^2, solved for c
	quickTower.xFire = quickTower.x  * xDistance / dist;
	quickTower.yFire = quickTower.y  * yDistance / dist;
}

return quickTower;
}

function arrowTowerSetup(x,y){
	var arrowTower = new Sprite(id["Arrow Tower.png"]);
	arrowTower.anchor.x = 0.5;
	arrowTower.anchor.y = 0.5;
	arrowTower.scale.x = 0.7;
	arrowTower.scale.y = 0.7;
	arrowTower.x = x;
	arrowTower.y = y;
	arrowTower.attackRate = 100;		// Higher the number, slower attack rate
	arrowTower.damage = 50;				// Damage dealt
	arrowTower.cost = 50;				// Cost of the Turret
	arrowTower.range = 100;				// Range of Turret
	arrowTower.target = null;			// Target of the Turret
	grass.addChild(arrowTower);
	

// Lets the Arrow Tower find a target
arrowTower.findTarget = function() {
	// If there are no enemies, then there is no target
	if(enemies.length === 0) {
		arrowTower.target = null;
		return;
	}
	// If the target is defeated, then remove target
	if(arrowTower.target && arrowTower.target.life <= 0) {
		arrowTower.target = null;
	}
	// Find the first enemy within the range and target
	for(var i = 0, j = enemies.length; i < j; i++){
		
		var dist = (enemies[i].x-arrowTower.x)*(enemies[i].x-arrowTower.x)+
			(enemies[i].y-arrowTower.y)*(enemies[i].y-arrowTower.y);
		if(dist < (arrowTower.range * arrowTower.range)) {
			arrowTower.target = enemies[i];
			return;
		}
	}
}

// Lets the Arrow Tower Fire
arrowTower.fire = function() {
	arrowTower.attackRate--;
	if(arrowTower.target && arrowTower.attackRate <= 0) {
		bullets.push(bulletSetup(arrowTower.x, arrowTower.y, arrowTower.target, arrowTower.damage));
		arrowTower.attackRate = 100;
		arrowTowerSound.play();
	}
}
	
// Need to find Vector for bullets
arrowTower.findVector = function() {
	// If there is no target, then return false
	if (this.target == null)
		return false;
	var xDistance = arrowTower.target.x - arrowTower.x;
	var yDistance = arrowTower.target.y - arrowTower.y;
	var dist = Math.sqrt(xDistance * xDistance + yDistance*yDistance);	// a^2 + b^2 = c^2, solved for c
	arrowTower.xFire = arrowTower.x * xDistance / dist;
	arrowTower.yFire = arrowTower.y * yDistance / dist;
}

return arrowTower;
}

function smallTowerSetup(x,y){
	var smallTower = new Sprite(id["Small Tower.png"]);
	smallTower.anchor.x = 0.5;
	smallTower.anchor.y = 0.5;
	smallTower.scale.x = 0.7;
	smallTower.scale.y = 0.7;
	smallTower.x = x;
	smallTower.y = y;
	smallTower.attackRate = 100;	// Attack Rate of the Turret
	smallTower.damage = 50;			// Damage Dealt
	smallTower.cost = 100;			// Cost of
	smallTower.range = 100;			// Range of
	smallTower.target = null;		// Target of
	grass.addChild(smallTower);
	
// Targeting function
smallTower.findTarget = function() {
	// If there are no enemies, then there is no target
	if(enemies.length === 0) {
		smallTower.target = null;
		return;
	}
	// If the target is defeated, then remove target
	if(smallTower.target && smallTower.target.life <= 0) {
		smallTower.target = null;
	}
	// Find the first enemy within the range and target
	for(var i = 0, j = enemies.length; i < j; i++){
		
		var dist = (enemies[i].x-smallTower.x)*(enemies[i].x-smallTower.x)+
			(enemies[i].y-smallTower.y)*(enemies[i].y-smallTower.y);
		if(dist < (smallTower.range * smallTower.range)) {
			smallTower.target = enemies[i];
			return;
		}
	}
}

smallTower.fire = function() {
	smallTower.attackRate--;
	if(smallTower.target && smallTower.attackRate <= 0) {
		bullets.push(bulletSetup(smallTower.x, smallTower.y, smallTower.target, smallTower.damage));
		smallTower.attackRate = 100;
		smallTowerSound.play();
	}
}
	
// Need to find Vector for bullets
smallTower.findVector = function() {
	// If there is no target, then return false
	if (this.target == null)
		return false;
	var xDistance = smallTower.target.x - smallTower.x;
	var yDistance = smallTower.target.y - smallTower.y;
	var dist = Math.sqrt(xDistance * xDistance + yDistance*yDistance);	// a^2 + b^2 = c^2, solved for c
	smallTower.xFire = smallTower.x * xDistance / dist;
	smallTower.yFire = smallTower.y * yDistance / dist;
}

return smallTower;
}

/*******************************************************************************************************
Tower Placing and Helper Functions
*******************************************************************************************************/
// Change Tower Type
function changeTower(n) {
	currentTower = n;
	grass.interactive = true; // Makes sure grass is interactive
	grass.on('mousedown', placeTower);
}

function placeTower() {
	/*
	This function handles placing the tower down. It checks what the selected tower is and creates a new
	object tower. Creating an object tower is done for the towerAllowed() function. If the tower is in an 
	appropriate position. It will place the turret. If not it is removed. No need to remove from the array 
	because it's only being pushed in the else statement. It is important to leave in the removeChild because
	in the tower setup(s), they handle the act of placing the turret on the grass. This verifies if it is 
	allowed and if not, remove. If it is allowed, subtract the cost of the tower from the players money pool. 
	*/
	
	if(selectedTower == "Arrow Tower"){
		var NewArrowTower = arrowTowerSetup(mousePosition.x,mousePosition.y);
		if (towerAllowed(mousePosition.x, mousePosition.y, NewArrowTower) == true){
			
			money -= NewArrowTower.cost;
			towers.push(NewArrowTower);
		}
		else{
			grass.removeChild(NewArrowTower);
		}
	}
	if(selectedTower == "Quick Tower"){
		var NewQuickTower = quickTowerSetup(mousePosition.x,mousePosition.y);
		
		if (towerAllowed(mousePosition.x, mousePosition.y, NewQuickTower) == true){
			
			money -= NewQuickTower.cost;
			towers.push(NewQuickTower);
		}
		else{
			grass.removeChild(NewQuickTower);
		}
	}
	if(selectedTower == "Long Tower"){
		var NewLongTower = longTowerSetup(mousePosition.x,mousePosition.y);
		
		if (towerAllowed(mousePosition.x, mousePosition.y, NewLongTower) == true){
			
			money -= NewLongTower.cost;
			towers.push(NewLongTower);
		}
		else{
			grass.removeChild(NewLongTower);
		}
	}
	if(selectedTower == "Small Tower"){
		var NewSmallTower = smallTowerSetup(mousePosition.x,mousePosition.y);
		
		if (towerAllowed(mousePosition.x, mousePosition.y, NewSmallTower) == true){
			
			money -= NewSmallTower.cost;
			towers.push(NewSmallTower);
		}
		else{
			grass.removeChild(NewSmallTower);
		}
	}
	selectedTower = null;
	grass.interactive = false;
}

function towerAllowed(x,y, tower){
	/*
	This variable checks to see if the tower is allowed. This function does/checks:
		1. The tower is colliding with the game edges.
		2. The tower is colliding with any point on the road.
		3. The tower is colliding with another tower. (Can't stack towers).
		4. Takes in a tower parameter. This allows the sprite height and width to 
		   be used as well. Allows towers of multiple sizes.
	This function works by using the PIXI.Rectangle provided. In this rectangle it
	can check to see if an X and Y coordinate exist in the rectangle (contains()).
	An issue with the mousePosition variable is that it doesn't take into account
	of the tower height and width, so they are added onto it as well.

	checkGame is always checked first and encompases the entire game. If the player 
	clicks on the edges and their tower goes over the game border or into the 
	interface, the tower is rejected.
	
	The other checks are very similar, however are rectangles that encompases all 
	of the grass tiles. These tiles do not check the game border edges because the
	checkGame rectangle does this. If a tower lands in a rectangle, it checks the 
	edges of all RELEVANT locations. The issue that I had was that if you check 
	every edge no matter what, you're going to get a collision error. Relevant edges 
	is specific to where the road is positioned to the rectangle block. 
	
	For Reference:
	Grass Check
	[name] (x,y)-(width,height) - pointsToCheck
	
	check1 (0,0)-(759,40) - Bottom
	check2 (759,0)-(41,211)  - Left Corner
	check3 (759,211)-(41,91) - Left
	check4 (0,80)-(36,91) - Top, Right Corner
	check5 (36,80)-(720,91) - Top, Bottom, Right
	check6 (0,171)-(36,171) - Right
	check7 (76,211)-(683,91) - Top, Left, Bottom
	check8 (0,342)-(36,104) - Top Right
	check9 (36,342)-(764, 104) - Top
	checkGame (0,0)- 800,446) - All, no need for corners, it gets caught
	*/
	
	var checkGame = new PIXI.Rectangle(0,0,800,446);
	var checkOne = new PIXI.Rectangle(0,0,759,40);
	var checkTwo = new PIXI.Rectangle(759,0,41,211);
	var checkThree = new PIXI.Rectangle(759,211,41,91);
	var checkFour = new PIXI.Rectangle(0,80,36,91);
	var checkFive = new PIXI.Rectangle(36,80,720,91);
	var checkSix = new PIXI.Rectangle(0,171,36,171);
	var checkSeven = new PIXI.Rectangle(76,211,683,91);
	var checkEight = new PIXI.Rectangle(0,342,36,104);
	var checkNine = new PIXI.Rectangle(36,342,764,104);

	// Variables with the width and height of the tower. 
	var width = tower.width/2;
	var height = tower.height/2;

	if(checkGame.contains(x,y) == true){
		// Left
		if(checkGame.contains((x - width) ,y) == false){			
			return false;
		}
		// Right
		if(checkGame.contains((x + width), y) == false){
			return false;
		}
		// Bottom
		if(checkGame.contains(x, (y + height)) == false) {
			return false;
		}
		// Top
		if(checkGame.contains(x, (y - height)) == false){
			return false;
		}
		
		for(var i = 0, j = towers.length; i<j; i++){
			if(Math.abs(x-towers[i].x) < towers[i].width && Math.abs(towers[i].y-y) < towers[i].height){
				return false;
			}
		}
	}
	// checkOne
	if (checkOne.contains(x,y) == true){
		// Bottom
		if(checkOne.contains(x, y + height) == false) {
			return false;
		}
		// Towers
		for(var i = 0, j = towers.length; i<j; i++){
			if(Math.abs(x-towers[i].x) < towers[i].width && Math.abs(towers[i].y-y) < towers[i].height){
				return false;
			}
		}
		return true;
	}
	// checkTwo
	if (checkTwo.contains(x,y) == true){
		// Left Corner
		if(checkTwo.contains(x - width ,y + height) == false){
			return false;
		}
		// Towers
		for(var i = 0, j = towers.length; i<j; i++){
			if(Math.abs(x-towers[i].x) < towers[i].width && Math.abs(towers[i].y-y) < towers[i].height){
				return false;
			}
		}
		return true;
	}
	// checkThree
	if (checkThree.contains(x,y) == true){
		// Left
		if(checkThree.contains(x - width ,y) == false){
			return false;
		}
		// Towers
		for(var i = 0, j = towers.length; i<j; i++){
			if(Math.abs(x-towers[i].x) < towers[i].width && Math.abs(towers[i].y-y) < towers[i].height){
				return false;
			}
		}
		return true;
	}
	// checkFour
	if (checkFour.contains(x,y) == true){
		// Right Corner
		if(checkFour.contains(x + width, y - width) == false){
			return false;
		}
		// Top
		if(checkFour.contains(x, y - height) == false){
			return false;
		}
		// Towers
		for(var i = 0, j = towers.length; i<j; i++){
			if(Math.abs(x-towers[i].x) < towers[i].width && Math.abs(towers[i].y-y) < towers[i].height){
				return false;
			}
		}
		return true;
	}
	// checkFive
	if (checkFive.contains(x,y) == true){
		// Right
		if(checkFive.contains(x + width, y) == false){

			return false;
		}
		// Bottom
		if(checkFive.contains(x , y + height) == false) {
			return false;
		}
		// Top
		if(checkFive.contains(x, y - height) == false){
			return false;
		}
		// Towers
		for(var i = 0, j = towers.length; i<j; i++){
			if(Math.abs(x-towers[i].x) < towers[i].width && Math.abs(towers[i].y-y) < towers[i].height){
				return false;
			}
		}
		return true;
	}
	// checkSix
	if (checkSix.contains(x,y) == true){
		// Right
		if(checkSix.contains(x + width, y) == false){
			return false;
		}
		// Towers
		for(var i = 0, j = towers.length; i<j; i++){
			if(Math.abs(x-towers[i].x) < towers[i].width && Math.abs(towers[i].y-y) < towers[i].height){
				return false;
			}
		}
		return true;
	}
	// checkSeven
	if (checkSeven.contains(x,y) == true){
		// Left
		if(checkSeven.contains(x - width ,y) == false){
			return false;
		}
		// Bottom
		if(checkSeven.contains(x , y + height) == false) {
			return false;
		}
		// Top
		if(checkSeven.contains(x, y - height) == false){
			return false;
		}
		// Towers
		for(var i = 0, j = towers.length; i<j; i++){
			if(Math.abs(x-towers[i].x) < towers[i].width && Math.abs(towers[i].y-y) < towers[i].height){
				return false;
			}
		}
		return true;
	}
	// checkEight
	if(checkEight.contains(x,y) == true){
		// Top Right
		if(checkEight.contains(x + height, y - height) == false){
			return false;
		}
		// Towers
		for(var i = 0, j = towers.length; i<j; i++){
			if(Math.abs(x-towers[i].x) < towers[i].width && Math.abs(towers[i].y-y) < towers[i].height){
				return false;
			}
		}
		return true;
	}
	// checkNine
	if (checkNine.contains(x,y) == true){
		// Top
		if(checkNine.contains(x, y - height) == false){
			return false;
		}
		// Towers
		for(var i = 0, j = towers.length; i<j; i++){
			if(Math.abs(x-towers[i].x) < towers[i].width && Math.abs(towers[i].y-y) < towers[i].height){
				return false;
			}
		}
		return true;
	}
	// Default
	return false;
}

/*******************************************************************************************************
Bullet Setup
*******************************************************************************************************/
// Create a bullet that goes to the intended target
// and deal damage.
function bulletSetup(x,y,target,damage) {
	var bullet = new Sprite(id["Bullet Sprite.png"]);
	bullet.x = x;
	bullet.y = y;
	bullet.anchor.x = 0.5;
	bullet.anchor.y = 0.5;
	bullet.scale.x = 0.5;	// Shrunk to look more pleasing
	bullet.scale.y = 0.5;	// " "
	bullet.target = target; // Damage to deal and to whom
	bullet.damage = damage;
	bullet.speed = 3;	// General speed of bullet along 
	bullet.xDistance = 0;
	bullet.yDistance = 0;
	bullet.dist = null;
	bullets.push(bullet);	// Push the bullet to the bullets array + add it to the gameScene
	gameScene.addChild(bullet);
	
	// Intended effect is that the bullet goes for the center of the enemy,
	// not the corners or edges.
	bullet.move = function() {
		bullet.xDistance = bullet.target.x + bullet.width/2 - bullet.x;
		bullet.yDistance = bullet.target.y + bullet.height/2 - bullet.y;
		bullet.dist = Math.sqrt(bullet.xDistance * bullet.xDistance + bullet.yDistance * bullet.yDistance);
		bullet.x = bullet.x + bullet.speed * bullet.xDistance / bullet.dist;
		bullet.y = bullet.y + bullet.speed * bullet.yDistance / bullet.dist
	}
	// Check for a collision with the target
	bullet.checkForHit = function() {
		if(bullet.x < bullet.target.x + bullet.target.width && bullet.y < bullet.target.y + bullet.target.height){
			bullet.target.life -= bullet.damage;
			return true;
		}
	}
	return bullet;
}

/*******************************************************************************************************
Attacker Setup
*******************************************************************************************************/
// Generic Enemy
// Not slow or fast and has average amount of health.
function genericMookSetup(x,y) {
	enemy = new Sprite (id["Generic Enemy.png"]);
	// Starting Location
	enemy.x = x;
	enemy.y = y;
	enemy.anchor.x = 0.5;
	enemy.anchor.y = 0.5;
	enemy.life = 100 + addedLife;

	
	enemy.move = function() {
		// Contain within the enemy walk path
		var move = enemy.speed;		
		createjs.Tween.get(enemy)
			.to({x:740}, 10000)
			.to({y:194}, 5000)
			.to({x:54}, 10000)
			.to({y:324}, 5000)
			.to({x:900}, 10000);
	}
	gameScene.addChild(enemy);
	return enemy;
}

// Strong Enemy
// Slower, but takes many more shots
function strongMookSetup(x,y) {
	enemy = new Sprite (id["Strong Enemy.png"]);
	// Starting Location
	enemy.x = x;
	enemy.y = y;
	enemy.anchor.x = 0.5;
	enemy.anchor.y = 0.5;
	enemy.life = 400 + addedLife*10;
	
	enemy.move = function() {
		// Contain within the enemy walk path
		var move = enemy.speed;		
		createjs.Tween.get(enemy)
			.to({x:740}, 10000)
			.to({y:194}, 10000)
			.to({x:54}, 10000)
			.to({y:324}, 10000)
			.to({x:900}, 10000);
	}
	gameScene.addChild(enemy);
	return enemy;
}
// Fast Enemy
// Faster, but fragile
function fastMookSetup(x,y) {
	enemy = new Sprite (id["Fast Enemy.png"]); 
	// Starting Location
	enemy.x = x;
	enemy.y = y;
	enemy.anchor.x = 0.5;
	enemy.anchor.y = 0.5;
	enemy.life = 40 + addedLife*2;
	
	enemy.move = function() {
		// Contain within the enemy walk path
		var move = enemy.speed;		
		createjs.Tween.get(enemy)
			.to({x:740}, 4000)
			.to({y:194}, 2000)
			.to({x:54}, 4000)
			.to({y:324}, 2000)
			.to({x:900}, 4000);
	}
	gameScene.addChild(enemy);
	return enemy;
}

/*******************************************************************************************************
Attacker Helper Functions
*******************************************************************************************************/
function checkForDefeat() {
	for(var i = 0, j = enemies.length; i < j; i++) {
		// Check enemies array if any has been brought to less than or equal
		// to 0 life
		if(enemies[i].life <= 0) {
			addedLife += 3; // Slowly increase maximum life
			defeatSound.play();	
			money += 10;	// Increase Money
			defeated += 1;	// Increment 
			createjs.Tween.removeTweens(enemies[i]);	// Remove Tween
			gameScene.removeChild(enemies[i]);		//Remove Child
			enemies.splice(i,1);	// Splice
			i--;	// Decrement
			j--;	// Decrement
		}
	}
}

function addEnemy() {
	var enemy, randomNumber;
	/*
	When adding in an enemy, it checks to see if the player has defeated a certain number of enemies
	if so, progress to that part of the if-else clause. A random number from 1-100 is generated and
	depending on the value that is generated, it will cause a random Mook to spawn. Some enemies are
	more preferred than others.
	*/
	
	if (60 > defeated && defeated > 20){
		randomNumber = randomInt(1,100);
		if(randomNumber < 85 ){
			// Generic Mook
			enemy = genericMookSetup(-100, 60);
		}
		else{
			// Strong Mook
			enemy = strongMookSetup(-100, 60);
		}
	}
	else if (defeated > 60){
		randomNumber = randomInt(1,100);
		if(randomNumber < 50 ){
			// Generic Mook
			enemy = genericMookSetup(-100, 60);
		}
		else if(randomNumber < 80){
			// Strong Mook
			enemy = strongMookSetup(-100, 60);
		}
		else{
			// Fast Mook
			enemy = fastMookSetup(-100, 60);
		}
	}
	else{
		enemy = genericMookSetup(-100, 60);
	}		
	enemies.push(enemy);
}

// Random generates a number from [0,1). Min and max reachable.
function randomInt(min, max){
	
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

