var bullets = []; 

// Need to create a bullet that goes to the intended target
// and deal damage.
function bulletSetup(x,y,target,damage) {
	var bullet = new Sprite(id["Bullet Sprite.png"])
	bullet.x = x;
	bullet.y = y;
	bullet.target = target;
	bullet.damage = damage.
	bullet.speed = 10;		// Can change at a later time
	
	// Intended effect is that the bullet goes for the center of the enemy,
	// not the corners or edges.
	bullet.move = function() {
		var xDistance = bullet.target.x + bullet.width/2 - bullet.x;
		var yDistance = bullet.target.y + bullet.height/2 - bullet.y;
		var dist = Math.sqrt(xDistance*xDistance + yDistance*yDistance);
		bullet.x = bullet.x + bullet.speed*xDistance/dist;
		bullet.y = bullet.y + bullet.speed*yDistance/dist;
	};
	
	// Tween to the target?
	
	// Check for collision to do damage or just have a quick timer?
}