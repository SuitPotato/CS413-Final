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




