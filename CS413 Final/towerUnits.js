// Defense Towers

var towers = [];
// Tower dimensions aren't set in stone yet,
// however it will be a square
var TOWERDIMENSION = 50;

/*******************************************************************************************************
Tower Declaration
*******************************************************************************************************/

function arrowTowerSetup(x,y){
	var arrowTower = new Sprite(id["Arrow Tower.png"]);
	arrowTower.x = x;
	arrowTower.y = y;
	arrowTower.attackRate = 100;	
	arrowTower.damage = 20;
	arrowTower.cost = 50;
	arrowTower.range = 150;
	arrowTower.target = null;
}

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
		// Towerdimension is added to look at the center of the square.
		var dist = (enemies[i].x-arrowTower.x)*(enemies[i].x-arrowTower.x+TOWERDIMENSION)+
			(enemies[i].y-arrowTower.y)*(enemies[i].y-arrowTower.y+TOWERDIMENSION);
		if(dist < (arrowTower.range * arrowTower.range)) {
			arrowTower.target = enemies[i];
			return;
		}
	}
}




