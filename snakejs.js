//Get canvas & context
const canvas = document.getElementById('gamecanvas');
const context = canvas.getContext('2d');

//Scale every pixel to be 20x20
//Canvas is now 20x20 as 400/20 = 20
context.scale(20,20);

//Player object
//x: Player x
//y: Player y;
//tail: Players tail
//length: Tail length 
//dir: Player direction [-1 left, 1 right, 2 up -2 down]
const player = {
	x: 5,
	y: 5,
	tail: [],
	length:3,
	dir: -1,
	score: 0,
};

const apple = {x: 10, y: 10};

//Bool to check if dead
let lost = false;

//Update, run every animation frame
let lastTime = 0;
let moveCounter = 0;
function update(time = 0)
{
	//Set deltaTime (timing variables)
	const deltaTime = time-lastTime;
	lastTime = time;
	//Update counter to time movement
	moveCounter += deltaTime;
	//If counter is full, move and reset counter
	if(moveCounter > 150 && !lost)
	{
		moveCounter = 0;
		movePlayer();

	}
	//Draw game;
	draw();
	//Request animation frame for this update
	requestAnimationFrame(update);
}

function draw()
{
	//Clear screen
	context.fillStyle=colors[0];
	context.fillRect(0,0,canvas.width,canvas.height);
	//Main drawing
	//Draw tail (includes head)
	//Appropriate color selection (1 for alive, 3 for dead)
	context.fillStyle = lost? colors[3] : colors[1];
	player.tail.forEach(value => {
		//Draw tail pixels
		context.fillRect(value.x,value.y,1,1);
	});
	//Draw apple
	context.fillStyle = colors[2];
	context.fillRect(apple.x,apple.y,1,1);
}

function movePlayer()
{
	//Left
	if(player.dir  === -1)
	{
		player.x--;
	}
	//Right
	else if (player.dir  === 1)
	{
		player.x++;
	}
	//Up
	else if (player.dir  === 2)
	{
		player.y--;
	}
	//Down
	else if (player.dir  === -2)
	{
		player.y++;
	}
	//Check wall collision
	checkWalls();
	//Check self collision
	checkSelf()
	//Check apple collision (and eat it if collision)
	checkApple();
	//Update tail
	updateTail();
}

function updateTail()
{
	let x = player.x;
	let y = player.y;
	if(player.tail.length < player.length)
	{
		player.tail[player.tail.length] = { x, y };
	} 
	else
	{
		player.tail[player.tail.length] = { x, y };
		player.tail.shift();
	}
}

function checkApple()
{
	//check if head is in apple
	//if yes add 1 to score and randomize apple position
	if(player.x === apple.x && player.y === apple.y)
	{
		//add length & score
		player.length++;
		player.score++;
		//Update score display
		updateScore();
		//Randomize apple
		apple.x = (20 * Math.random() | 0);
		apple.y = (20 * Math.random() | 0);
	}
}

function checkWalls()
{
	//If player goes over canvas limits, die
	if(player.x > 20 || player.x < 0 || player.y > 20 || player.y < 0)
	{
		lost = true;
	}
}
function checkSelf()
{
	//For each tail part (Excluding head) check if same as head
	//If yes, die
	player.tail.forEach((value, i) => {
		if(value.x === player.x && value.y === player.y)
		{
			lost = true;
		}
	});
}

function updateScore()
{
	document.getElementById('score').innerText = player.score;
}

//Key event listeners (keyboard controls)
document.addEventListener('keydown', event => {
	//Debug log keycode
	console.log(event.keyCode);
	//Change movement direction
	//Left dir
	if(event.keyCode === 37)
	{
		player.dir = -1;
	}
	//Right dir
	else if (event.keyCode === 39)
	{
		player.dir = 1;
	}
	//Up dir
	else if (event.keyCode === 38)
	{
		player.dir = 2;
	}
	//Down dir
	else if (event.keyCode === 40)
	{
		player.dir = -2;
	}	
});

//Game colors (for easy modification)
const colors = [
	'#000000',      //black for bg
	'#10FF00',      //green for snake
	'#FF0000',      //red for apples
	'#AAAAAA',      //stone gray for dead snake;
];
update();