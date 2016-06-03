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
var towers = [];
var bullets = [];
var money = 1000; // Testing Purposes
var mousePosition = renderer.plugins.interaction.mouse.global;
var enemies = [];
var addedLife = 0; // Used to increment difficulty
var defeated = 0;
var addEnemyTimer = 100;
var selectedTower;
var lives = 10;

var enemyPass = new PIXI.Rectangle(800,302,100,40);

// Text Variables
			var defeatedText = new Text('Defeated: ' + defeated, {font : '24px Impact'});
			var moneyText = new Text('Gold: ' + money, {font : '24px Impact'});
			var livesText = new Text('Lives: '+ lives, {font : '24px Impact'} );
			var towerInformationText = new Text(' ', {font : '24px Impact'});
			
		
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
		//playSound.play();
		playBut.interactive = false;
		playBut.on('mousedown', gameHandler)	
		
		// Instruction Button
		introMenuButtons.addChild(instructBut);
		instructBut.anchor.x = 0.5;
		instructBut.anchor.y = 0.5;
		instructBut.position.x = -550;
		instructBut.position.y = 120;
		createjs.Tween.get(instructBut.position).wait(500).to({x: 50, y: 120}, 1000, createjs.Ease.bounceOut);
		//	setTimeout(function(){instructSound.play();}, 750);
		instructBut.interactive = false;
		instructBut.on('mousedown',instructHandler);	
		
		// Credits button
		introMenuButtons.addChild(creditsBut);
		creditsBut.anchor.x = 0.5;
		creditsBut.anchor.y = 0.5;
		creditsBut.position.x = -550;
		creditsBut.position.y = 240;
		createjs.Tween.get(creditsBut.position).wait(1000).to({x: 100, y: 240}, 1000, createjs.Ease.bounceOut);
		//	setTimeout(function(){creditsTweenSound.play();}, 1250);
		creditsBut.interactive = false;
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
	// Game Screen Composition
	// Made of several picture, grass, road, and interface.
	var gameScreen = new Container();
	gameScene.addChild(gameScreen);
	
	// Elements of the Game Screen
	grass = new Sprite(id["Grass.png"]);
	road = new Sprite(id["Road.png"]);
	gameInterface = new Sprite(id["Interface.png"]);	// Holds the Buttons, Tower Information, and Game Information
	
	// Grass is Positioned at the top level
	gameScreen.addChild(grass);
	grass.position.x = 0;
	grass.position.y = 0;
	
	// Road Positioned slightly down. Fits in road slot
	// in grass.png
	gameScreen.addChild(road);
	road.position.x = 0;
	road.position.y = 40;
	road.interactive = false;
	
	// Interface is positioned at the bottom of the screen below the grass
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
			Updated in game.
			*/
			
		var userInterfaceInfo = new Container();
		gameInterface.addChild(userInterfaceInfo);
		userInterfaceInfo.position.x = 655;
		userInterfaceInfo.position.y = 0;
				
			// Wave Number Text
			userInterfaceInfo.addChild(defeatedText);
			defeatedText.position.x = 0;
			defeatedText.position.y = 0;
			
			// Money Text
			userInterfaceInfo.addChild(moneyText);
			moneyText.position.x = 0;
			moneyText.position.y = 20;
			
			// Lives Text
			userInterfaceInfo.addChild(livesText);
			livesText.position.x = 0;
			livesText.position.y = 40;
			
			
			
		// Tower Information Container
			/*
			Purpose is to provide information to the player on the following:
			1. Name of the Tower
			4. Damage
			5. Attack Rate
			Updated in game.
			*/
			
		var towerInformation = new Container();
		towerInformation.position.x = 455;
		towerInformation.position.y = 0;
		gameInterface.addChild(towerInformation);
		
			towerInformation.addChild(towerInformationText);
			towerInformationText.position.x = 0;
			towerInformationText.position.y = 0;
		
	
	
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

function game() {
	checkForDefeat();
	addEnemyTimer--;
	moneyText.text = 'Gold: ' + money;
	livesText.text = 'Lives: ' + lives;
	
		
	
	if(selectedTower == null){
		towerInformationText.text = (' ');
	}
	else if(selectedTower == "Arrow Tower"){
		towerInformationText.text = ('Arrow Tower \n' + 'Damage: \n' + 'Attack Rate: \n' + 'Range \n');
	}
	else if(selectedTower == "Quick Tower"){
		towerInformationText.text = ('Quick Tower\n' + 'Damage: \n' + 'Attack Rate: \n' + 'Range \n');
	}
	else if(selectedTower == "Long Tower"){
		towerInformationText.text = ('Long Tower\n' + 'Damage: \n' + 'Attack Rate: \n' + 'Range \n');
	}
	else if(selectedTower == "Small Tower"){
		towerInformationText.text = ('Long Tower\n' + 'Damage: \n' + 'Attack Rate: \n' + 'Range \n');
	}
	else{
		towerInformationText.text = (' ');
	}
		
	if(addEnemyTimer < 1){
		addEnemy();
		addEnemyTimer = 100;
		
	}
	// (800,302)-(800,400) 
	for(var i = 0, j = enemies.length; i < j; i++){
		enemies[i].move();
		if(enemyPass.contains(enemies[i].x - enemies[i].width ,enemies[i].y) == true){
			console.log("Enemy Pass");
			createjs.Tween.removeTweens(enemies[i]);
			gameScene.removeChild(enemies[i]);
			enemies.splice(i,1);
			lives--;
			i--;
			j--;
		}
	}
	for(var i = 0, j = towers.length; i < j; i++){
		towers[i].findTarget();
		towers[i].findVector();
		towers[i].fire();
	}
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
	
	if(lives == 0)
	{
		state = loss;
	}

	
}

/*
	NOTE TO SELF:
		1. Add setTimeout on buttons when tweening so user's don't click on them early
		
		ex:
		setTimeout(function(){
			playBut.interactive = true;
			instructBut.interactive = true;
			creditsBut.interactive = true;
		}, 2000);
*/

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
	/*
	function getMousePos(mouseData){
		console.log("X = "+mouseData.data.originalEvent.movementX);  
		console.log("Y = "+mouseData.data.originalEvent.movementY);
	}*/
	
/**********************************************************************************************************
Game Handlers
**********************************************************************************************************/
function arrowTowerButtonHandler(){
	if (money < 50){
		grass.interactive = false;
		selectedTower = null;
		return null;
	}
	
	grass.interactive = true;
	selectedTower = "Arrow Tower";
	changeTower(selectedTower);
}

function quickTowerButtonHandler(){
	if (money < 75){
		grass.interactive = false;
		selectedTower = null;
		return null;
	}
	
	grass.interactive = true;
	selectedTower = "Quick Tower";
	changeTower(selectedTower);
}

function longTowerButtonHandler(){
	if (money < 125){
		grass.interactive = false;
		selectedTower = null;
		return null;
	}
	
	grass.interactive = true;
	selectedTower = "Long Tower";
	changeTower(selectedTower);
}

function smallTowerButtonHandler(){
	if(money < 75){
		grass.interactive = false;
		selectedTower = null;
		return null;
	}
	grass.interactive = true;
	selectedTower = "Small Tower";
	changeTower(selectedTower);
}
/**********************************************************************************************************
Helper Functions
**********************************************************************************************************/
	
/*******************************************************************************************************
Tower Stuff
*******************************************************************************************************/

function longTowerSetup(x,y){
	var longTower = new Sprite(id["Long Tower.png"]);
	longTower.anchor.x = 0.5;
	longTower.anchor.y = 0.5;
	longTower.scale.x = 0.7;
	longTower.scale.y = 0.7;
	longTower.x = x;
	longTower.y = y;
	longTower.attackRate = 125;	
	longTower.damage = 75;
	longTower.cost = 125;
	longTower.range = 200;
	longTower.target = null;
	grass.addChild(longTower);
	
	
	
// Lets the arrow tower find a target
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

// Lets the Arrow Tower Fire
longTower.fire = function() {
	longTower.attackRate--;
	if(longTower.target && longTower.attackRate <= 0) {
		bullets.push(bulletSetup(longTower.x, longTower.y, longTower.target, longTower.damage));
		longTower.attackRate = 125;
		//console.log("FIRE!")
		// Reset attack rate
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
	quickTower.attackRate = 50;	
	quickTower.damage = 75;
	quickTower.cost = 75;
	quickTower.range = 100;
	quickTower.target = null;
	grass.addChild(quickTower);
	
	/*
	console.log("Arrow Tower Properites: ");
	console.log(quickTower);
	console.log(quickTower.x);
	console.log(quickTower.y);
	console.log(quickTower.findTarget);
	*/
	
// Lets the arrow tower find a target
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

// Lets the Arrow Tower Fire
quickTower.fire = function() {
	quickTower.attackRate--;
	if(quickTower.target && quickTower.attackRate <= 0) {
		bullets.push(bulletSetup(quickTower.x, quickTower.y, quickTower.target, quickTower.damage));
		quickTower.attackRate = 50;
		//console.log("FIRE!")
		// Reset attack rate
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
	arrowTower.attackRate = 100;	
	arrowTower.damage = 100;
	arrowTower.cost = 50;
	arrowTower.range = 150;
	arrowTower.target = null;
	grass.addChild(arrowTower);
	
	/*
	console.log("Arrow Tower Properites: ");
	console.log(arrowTower);
	console.log(arrowTower.x);
	console.log(arrowTower.y);
	console.log(arrowTower.findTarget);
	*/
	
// Lets the arrow tower find a target
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
		//console.log("FIRE!")
		// Reset attack rate
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
	var smallTower = new Sprite(id["Arrow Tower.png"]);
	smallTower.anchor.x = 0.5;
	smallTower.anchor.y = 0.5;
	smallTower.scale.x = 0.7;
	smallTower.scale.y = 0.7;
	smallTower.x = x;
	smallTower.y = y;
	smallTower.attackRate = 100;	
	smallTower.damage = 50;
	smallTower.cost = 75;
	smallTower.range = 100;
	smallTower.target = null;
	grass.addChild(smallTower);
	

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
Tower Placing
*******************************************************************************************************/
// Change Tower Type
function changeTower(n) {
	currentTower = n;
	grass.interactive = true;
	grass.on('mousedown', placeTower);
}
function placeTower() {
	
	if(selectedTower == "Arrow Tower"){
		var NewArrowTower = arrowTowerSetup(mousePosition.x,mousePosition.y);
		if (towerAllowed(mousePosition.x, mousePosition.y, NewArrowTower) == true){
			// console.log("Created.");
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
			// console.log("Created.");
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
			// console.log("Created.");
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
			// console.log("Created.");
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

/*
Grass Contain: Check
(0,0)-(759,40) 1 - Bottom
(759,0)-(41,211) 2 - Left Corner
(759,211)-(41,91) 3 - Left
(0,80)-(36,91) 4 - Top, Right Corner
(36,80)-(720,91) 5 - Top, Bottom, Right
(0,171)-(36,171) 6 - Right
(76,211)-(683,91) 7 - Top, Left, Bottom
(0,342)-(36,104) 8 - Top Right
(36,342)-(764, 104) 9 - Top

(0,0) - (800,446) - Game
*/
function towerAllowed(x,y, tower){
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
	console.log(x);
	console.log(y);

	var width = tower.width/2;
	var height = tower.height/2;
	
	// Checks Mouse Click, not entire tower, so I'm checking tower edges
	// Could be more specific, but I want to have the tower's dimensions be 
	// flexible so I can change it later if I want.
	if(checkGame.contains(x,y) == true){
		
		console.log("checkGame");
				
		// Left
		if(checkGame.contains((x - width) ,y) == false){
			
			console.log("Left");
			return false;
		}
		// Right
		if(checkGame.contains((x + width), y) == false){
			console.log("Right");
			return false;
		}
		// Bottom
		if(checkGame.contains(x, (y + height)) == false) {
			console.log("Bottom");
			console.log(x);
			console.log(y);
			console.log(y + height);
			return false;
		}
		// Top
		if(checkGame.contains(x, (y - height)) == false){
			console.log("Top");
			return false;
		}
		
		for(var i = 0, j = towers.length; i<j; i++){
			if(Math.abs(x-towers[i].x) < towers[i].width && Math.abs(towers[i].y-y) < towers[i].height){
				console.log("Tower");
				return false;
			}
		}
		
	}
	// checkOne
	if (checkOne.contains(x,y) == true){
		console.log("checkOne");
		// Bottom
		if(checkOne.contains(x, y + height) == false) {
			console.log("Bottom");
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
		console.log("checkTwo");
		// Left Corner
		if(checkTwo.contains(x - width ,y + height) == false){
			console.log("Left Corner");
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
		console.log("checkThree");
		// Left
		if(checkThree.contains(x - width ,y) == false){
			console.log("Left");
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
		console.log("checkFour");
		// Right Corner
		if(checkFour.contains(x + width, y - width) == false){
			console.log("Right Corner");
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
		console.log("checkFive");
		// Right
		if(checkFive.contains(x + width, y) == false){
			console.log("Right");
			return false;
		}
		// Bottom
		if(checkFive.contains(x , y + height) == false) {
			console.log("Bottom");
			return false;
		}
		// Top
		if(checkFive.contains(x, y - height) == false){
			console.log("Top");
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
		console.log("checkSix");
		// Right
		if(checkSix.contains(x + width, y) == false){
			console.log("Right");
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
		console.log("checkSeven");
		// Left
		if(checkSeven.contains(x - width ,y) == false){
			console.log("Left");
			return false;
		}
		// Bottom
		if(checkSeven.contains(x , y + height) == false) {
			console.log("Bottom");
			return false;
		}
		// Top
		if(checkSeven.contains(x, y - height) == false){
			console.log("Top");
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
		console.log("checkEight");
		// Top Right
		if(checkEight.contains(x + height, y - height) == false){
			console.log("Top Right");
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
		console.log("checkNine");
		// Top
		if(checkNine.contains(x, y - height) == false){
			console.log("Top");
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
Bullets
*******************************************************************************************************/
// Create a bullet that goes to the intended target
// and deal damage.
function bulletSetup(x,y,target,damage) {
	var bullet = new Sprite(id["Bullet Sprite.png"]);
	// Starting Location
	bullet.x = x;
	bullet.y = y;
	bullet.anchor.x = 0.5;
	bullet.anchor.y = 0.5;
	bullet.scale.x = 0.5;
	bullet.scale.y = 0.5;
	// Damage to deal and to whom
	bullet.target = target;
	bullet.damage = damage;
	// General speed of bullet along with empty values to be filled in
	bullet.speed = 3;
	bullet.xDistance = 0;
	bullet.yDistance = 0;
	bullet.dist = null;
	// Push the bullet to the bullets array + add it to the gameScene
	bullets.push(bullet);
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
Attackers
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
	enemy.speed = 10;
	enemy.life = 40 + addedLife;
	
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
	enemy.speed = 10;
	enemy.life = 200 + addedLife*5;
	
	enemy.move = function() {
		// Contain within the enemy walk path
		var move = enemy.speed;		
		createjs.Tween.get(enemy)
			.to({x:740}, 20000)
			.to({y:194}, 10000)
			.to({x:54}, 20000)
			.to({y:324}, 10000)
			.to({x:900}, 20000);
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
	enemy.speed = 10;
	enemy.life = 40 + addedLife/2;
	
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

function checkForDefeat() {
	for(var i = 0, j = enemies.length; i < j; i++) {
		if(enemies[i].life <= 0) {
			console.log(defeated);
			addedLife += 2; // Slowly increase maximum life
			
			money += 10;
			defeated += 1;
			createjs.Tween.removeTweens(enemies[i]);
			gameScene.removeChild(enemies[i]);
			enemies.splice(i,1);
			i--;	// Decrement
			j--;	// Decrement
		}
	}
}

function addEnemy() {
	var enemy, randomNumber;
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

/*******************************************************************************************************
Random Integer Function 
*******************************************************************************************************/
// Random generates a number from [0,1). Min and max reachable.
function randomInt(min, max){
	
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

