/*  
	app.js
	Sam Swarr (sswarr)
*/

// globals
var app;
var game;

// App class
function App(){
	this.game_loop;
	this.start();
}

// create the Game and start the loop
App.prototype.start = function(){
	game = new Game();
	if(game.init()){
		// Set up game loop to display new frames at a fixed rate
		this.game_loop = setInterval(function(){
			// Logically separating updating and drawing
			game.update();
			game.draw();
		}, 1000 / 60);
	}else{
		alert('You lack a browser able to run HTML5');
	}
}

// the "main" method
$(document).ready(function(){
	app = new App();
});

