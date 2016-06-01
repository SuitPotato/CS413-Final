var mousePosition = renderer.interaction.mouse.global;

// Screen 
gameScreen = new Sprite(id["Game Screen.png"]);
gameScreen.interactive = true;

/*

.on('mousedown', onDragStart)	--placeTower
.on('mousemove', onDragMove) 	--getMousePos


*/

// Change Tower Type
function changeTower(n) {
	currentTower = n;
}


// add a tower
// On Mouse Down
function placeTower() {
	if(towerAllowed)
}



function towerAllowed(x,y){
	if (money < towerClasses[currentTower].cost)	// Money required
		return false;
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

