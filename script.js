// Math.random();
// Math.random()*max; //от 0 до max;
// Math.random()*(max - min) + min; //от min до max


const canvas = document.querySelector('#can3');
const ctx = canvas.getContext("2d");

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let particlesArray;

//mouse position
let mouse = {
	x: null,
	y: null,
	radius: ((canvas.height/100)*(canvas.width/100))
}

window.addEventListener('mousemove',
	function(event){
		mouse.x = event.x;
		mouse.y = event.y;
	}
);

//create particle
class Particle{
	constructor(x,y,directionX,directionY,size,color){
		this.x = x;
		this.y = y;
		this.directionX = directionX;
		this.directionY = directionY;
		this.size = size;
		this.color = color;
	}

	//method to draw individual particle
	draw(){
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.size,0,Math.PI*2,false);
		ctx.fillStyle = this.color;
		ctx.strokeStyle = '#333';
		ctx.fill();
		ctx.stroke();
	}

	//check particle position, check mouse position, 
	//move the particle, draw the particle
	update(){
		if(this.x > canvas.width || this.x < 0){
			this.directionX = -this.directionX;
		}
		if(this.y > canvas.height || this.y < 0){
			this.directionY = -this.directionY;
		}

		//check collision detection - mouse position / particle position
		let dx = mouse.x - this.x; //расст-е от мыши до частицы по х
		let dy = mouse.y - this.y; //расст-е от мыши до частицы по y
		let distance = Math.sqrt(dx*dx + dy*dy); //теорема Пифагора
		if(distance < mouse.radius + this.size){
			if(mouse.x < this.x && this.x < canvas.width - this.size*10){
				this.x += 10;
			}
			if(mouse.x > this.x && this.x > this.size*10){
				this.x -= 10;
			}
			if(mouse.y < this.y && this.y < canvas.height - this.size*10){
				this.y += 10;
			}
			if(mouse.y > this.y && this.y > this.size*10){
				this.y -= 10;
			}
		}

		//move particle
		this.x += this.directionX;
		this.y += this.directionY;
		//draw particle
		this.draw();
	}
}

//create particle array
function init(){
	particlesArray = [];
	//кол-во пикселей в поле / 9000 (почему 9000, а хер знает)
	let numOfParticles = (canvas.height * canvas.width)/6000; 
	for (let i = 0; i < numOfParticles; i++) {
		let size = (Math.random()*5)+1; //от 1 до 5.
		let x = (Math.random()*((canvas.width - size*2)-(size*2))+size*2);
		let y = (Math.random()*((canvas.height - size*2)-(size*2))+size*2);
		let directionX = (Math.random()*3) - 1; //от -2.5 до 2.5
		let directionY = (Math.random()*3) - 1;
		let color = '#fff';

		particlesArray.push(new Particle(x,y,directionX,directionY,size,color));
	}
}

//check if the particles are close enought to draw line between them
function connect(){
	let opacityValue = 8;
	for (let i = 0; i < particlesArray.length; i++) {
		for (let j = i; j < particlesArray.length; j++) {
			let distance = ((particlesArray[i].x - particlesArray[j].x)*(particlesArray[i].x - particlesArray[j].x)) 
			+ ((particlesArray[i].y - particlesArray[j].y)*(particlesArray[i].y - particlesArray[j].y));
			if(distance < (canvas.width/7)*(canvas.height/7)){
				opacityValue = 1 - (distance/20000);
				ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue +0+')';
				ctx.lineWidth = 0.7;
				ctx.beginPath();
				ctx.moveTo(particlesArray[i].x,particlesArray[i].y);
				ctx.lineTo(particlesArray[j].x,particlesArray[j].y);
				ctx.stroke();
			}
		}
	}
}

//animation loop
function animate(){
	requestAnimationFrame(animate);
	ctx.clearRect(0,0,canvas.width, canvas.height);
	for (let i = 0; i < particlesArray.length; i++) {
		particlesArray[i].update();
	}
	connect();
}

window.addEventListener('resize', function(){
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	mouse.radius = ((canvas.height/100)*(canvas.width/100));
});

window.addEventListener('mouseout',
	function(){
		mouse.x = 'underfined';
		mouse.x = 'underfined';
	}
);
init();
animate();
