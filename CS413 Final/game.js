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
var money = 100; // Testing Purposes
var mousePosition = renderer.plugins.interaction.mouse.global;
var enemies = [];
var addedLife = 0; // Used to increment difficulty
var defeated = 0;
var addEnemyTimer = 100;



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
	// Screen 
	gameScreen = new Sprite(id["Game Screen.png"]);
	gameScene.addChild(gameScreen);
	gameScreen.interactive = true;
	//  gameScreen.on('mousedown', placeTower)
	//gameScreen.on('mousemove', getMousePos);
	
		// Tower Button Sprites
		arrowTowerBut = new Sprite(id["Arrow Tower Button.png"]);
	
		// Tower's Button Container
			/*
			Contains the buttons for the towers.
			Buttons will be inactive until the player has enough money 
			to purchase the tower.
			*/
			
		var towerButtons = new Container();
		towerButtons.position.x = 0;
		towerButtons.position.y = 555;
		gameScene.addChild(towerButtons);
		
			// Arrow Tower Button
			towerButtons.addChild(arrowTowerBut);
			arrowTowerBut.anchor.x = 0.5;
			arrowTowerBut.anchor.y = 0.5;
			arrowTowerBut.position.x = 50;
			arrowTowerBut.position.y = 0;
			arrowTowerBut.interactive = true;
			arrowTowerBut.on('mousedown', arrowTowerButtonHandler);
			// More Towers to be added
		
		
		
		// Information Container
			/*
			Contains information regarding:
			1. Wave Number
			2. Credits / Gold
			Updated in game.
			*/
			
		var userInterfaceInfo = new Container();
		userInterfaceInfo.position.x = 700;
		userInterfaceInfo.y = 555;
		gameScene.addChild(userInterfaceInfo);
			
		// Tower Information Container
			/*
			Purpose is to provide information to the player on the following:
			1. Name of the Tower
			2. Tower level or upgrade level
			3. Cost to upgrade
			4. Damage
			5. Attack Rate
			Updated in game.
			*/
			
		var towerInformation = new Container();
		towerInformation.position.x = 500;
		towerInformation.position.y = 555;
		gameScene.addChild(towerInformation);
	
	
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
	if(addEnemyTimer < 1){
		addEnemy();
		addEnemyTimer = 100;
		console.log(addedLife);
	}
	for(var i = 0, j = enemies.length; i < j; i++){
		enemies[i].move();
	}
	for(var i = 0, j = towers.length; i < j; i++){
		towers[i].findTarget();
		towers[i].findVector();
		towers[i].fire();
	}
	for(var i = 0, j = bullets.length; i < j; i++){
		bullets[i].tween();
		if(bullets[i].checkForHit()){
			createjs.Tween.removeTweens(bullets[i]);
			gameScreen.removeChild(bullets[i]);
			bullets.splice(i,1);
			j--;
			i--;
		}
	}
	
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
		gameScene.interactive = false;
		console.log("Arrow Tower Handler: False")
		selectedTower = null;
		return null;
	}
	money -= 50;
	gameScene.interactive = true;
	// Subtract money when placed.
	console.log("Total Money is: ");
	console.log(money);
	console.log("Arrow Tower Handler: True");
	// Draw circle on mouse
	// Allow player to place a tower
	changeTower();
}

/**********************************************************************************************************
Helper Functions
**********************************************************************************************************/
	
/*******************************************************************************************************
Tower Stuff
*******************************************************************************************************/


function arrowTowerSetup(x,y){
	var arrowTower = new Sprite(id["Arrow Tower.png"]);
	arrowTower.anchor.x = 0.5;
	arrowTower.anchor.y = 0.5;
	arrowTower.x = x;
	arrowTower.y = y;
	arrowTower.attackRate = 100;	
	arrowTower.damage = 1000;
	arrowTower.cost = 50;
	arrowTower.range = 150;
	arrowTower.target = null;
	gameScreen.addChild(arrowTower);
	
	console.log("Arrow Tower Properites: ");
	console.log(arrowTower);
	console.log(arrowTower.x);
	console.log(arrowTower.y);
	console.log(arrowTower.findTarget);

	
// Lets the arrow tower find a target
arrowTower.findTarget = function() {
	// If there are no enemies, then there is no target
	if(enemies.length === 0) {
		arrowTower.target = null;
		return;
	}
	
	// If the target is defeated, then remove target
	if(arrowTower.target && arrowTower.target.ife <= 0) {
		arrowTower.target = null;
	}
	
	// Find the first enemy within the range and target
	for(var i = 0, j = enemies.length; i < j; i++){
		// 60 is added to look at the center of the square.
		var dist = (enemies[i].x-arrowTower.x)*(enemies[i].x-arrowTower.x+60)+
			(enemies[i].y-arrowTower.y)*(enemies[i].y-arrowTower.y+60);
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
		console.log("FIRE!")
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
	arrowTower.xFire = arrowTower.x + 60 * xDistance / dist;
	arrowTower.yFire = arrowTower.y + 60 * yDistance / dist;
}

return arrowTower;
}

/*******************************************************************************************************
Tower Placing
*******************************************************************************************************/
// Change Tower Type
function changeTower(n) {
	currentTower = n;
	console.log("Mouse Position");
	console.log(mousePosition);
	console.log("Change Tower");
	gameScreen.interactive = true;
	gameScreen.on('mousedown', placeTower);
}

// add a tower
// On Mouse Down

// Dimensions of Pathway
/*
1. Top Path 
(0,40) Start - (760, 40)
2. Connecting to Middle
(720,80) Start - (40, 91)
3. Middle Path
(36, 171) Start - (724, 40)
4. Connecting to Bottom
(36, 211) Start - (40, 91)
5. Bottom Path
(36, 302) Start - (764, 40)

*/
function placeTower() {
	var topPath = {x:0, y:0, width:760, height: 40};
	var topToMiddle = {x:720, y:80, width:40, height:91};
	var middlePath = {x:36, y:171, width:724, height:40};
	var midToBot = {x:36, y: 211, width:40, height:91};
	var bottomPath = {x:36, y:302, width:764, height:40};
	
	
	var NewArrowTower = arrowTowerSetup(mousePosition.x,mousePosition.y);
	towers.push(NewArrowTower);
	
	console.log("Placed the turret down.");
	console.log("Towers: ");
	console.log(towers);
	addEnemy();
	gameScreen.interactive = false;

}

function towerAllowed(x,y){
	
	// Contain in map and not in the path 
	// Make sure it isn't to close to any other towers	
}

function drawMouse(){
	// If the mouse isn't on the game screen 
	if(!mouse)
		return;
	var graphics = new PIXI.Graphics();
	var range = towerClasses[currentTower].range;
	// if tower is allowed, transparent yellow
	// else tower is not allowed, transparent red
}

/*******************************************************************************************************
Bullets
*******************************************************************************************************/
// Need to create a bullet that goes to the intended target
// and deal damage.
function bulletSetup(x,y,target,damage) {
	var bullet = new Sprite(id["Bullet Sprite.png"]);
	bullet.x = x;
	bullet.y = y;
	bullet.anchor.x = 0.5;
	bullet.anchor.y = 0.5;
	bullet.target = target;
	bullet.damage = damage;
	bullet.xDistance = 0;
	bullet.yDistance = 0;
	bullet.dist = null;
	bullets.push(bullet);
	gameScreen.addChild(bullet);
	// bullet.tween();
	
	
	// Intended effect is that the bullet goes for the center of the enemy,
	// not the corners or edges.
	bullet.move = function() {
		bullet.xDistance = bullet.target.x + bullet.width/2 - bullet.x;
		bullet.yDistance = bullet.target.y + bullet.height/2 - bullet.y;
		// var dist = Math.sqrt(xDistance*xDistance + yDistance*yDistance);
		// bullet.x = bullet.x + bullet.speed*xDistance/dist;
		// bullet.y = bullet.y + bullet.speed*yDistance/dist;
	}
	
	// Tween to the target?
	bullet.tween = function() {
		bullet.move();	
		//console.log("xDistance: ");
		//console.log(bullet.xDistance);
		//console.log("yDistance: ");
		//console.log(bullet.yDistance);
		createjs.Tween.get(bullet.position)
			.to({x:bullet.xDistance, y:bullet.yDistance}, 1000); 
		
	}
	
	bullet.checkForHit = function() {
		if(bullet.x < bullet.target.x + bullet.target.width && bullet.y < bullet.target.y + bullet.target.height){
			bullet.target.life -= bullet.damage;
			return true;
		}
	}
	// Check for collision to do damage or just have a quick timer?
	
	return bullet;
}

/*******************************************************************************************************
Attackers
*******************************************************************************************************/
function enemySetup(x,y) {
	enemy = new Sprite (id["Generic Enemy.png"]);
	enemy.x = x;
	enemy.y = y;
	enemy.vx = 0;
	enemy.vy = 0;
	enemy.anchor.x = 0.5;
	enemy.anchor.y = 0.5;
	enemy.speed = 10;
	enemy.life = 40 + addedLife;
	
	enemy.move = function() {
		// Contain within the enemy walk path
		var move = enemy.speed;
		// (-100,60) - (740,60)
		// (740,60) - (740,194)
		// (740,194) - (54, 194)
		// (54,194) - (54, 324)
		// (54,324) - (900,324) - Go a bit beyond 
		
		createjs.Tween.get(enemy)
			.to({x:740}, 5000)
			.to({y:194}, 5000)
			.to({x:54}, 5000)
			.to({y:324}, 5000)
			.to({x:900}, 5000);
	}
	gameScreen.addChild(enemy);
	return enemy;
}

function checkForDefeat() {
	for(var i = 0, j = enemies.length; i < j; i++) {
		if(enemies[i].life <= 0) {
			console.log("Defeat!");
			addedLife += 2; // Slowly increase maximum life
			//removeTweens(enemies[i]);
			// Increase money income
			defeated += 1;
			gameScreen.removeChild(enemies[i]);
			enemies.splice(i,1);
			i--;	// Decrement
			j--;	// Decrement
		}
	}
}

function addEnemy() {
	var enemy;						// Easy to add different types of enemies
	enemy = enemySetup(-100, 60);		// Change when I figure out spawning location
	console.log("Created an Enemy.");
	enemies.push(enemy);
}

function contain(sprite, container) {
	
	// Undef until collision, displays the collision location when a collision occurs
	var collision = undefined;
	
	// Left Side
	if (sprite.x < container.y){
		sprite.x = container.x;
		collision = 'left';
	}
	
	// Top Side
	if (sprite.y < container.y){
		sprite.y = container.y;
		collision = 'top';
	}
	
	// Right Side
	if (sprite.x + sprite.width > container.width){
		sprite.x = container.width - sprite.width;
		collision = 'right';
	}
	
	// Bottom Side
	if (sprite.y + sprite.height > container.height){
		sprite.y = container.height - sprite.height;
		collision = 'bottom';
	}
	
	return collision
}