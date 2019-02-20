var iohook = require("iohook");
var request = require("request");
var path = require("path");

var stockfish = require("stockfish");
var engine = stockfish(path.join(__dirname, "./node_modules/stockfish/src/stockfish.wasm"));

var selenium = require("selenium-webdriver");
var Builder = selenium.Builder;
var By = selenium.By;
var Key = selenium.Key;
var until = selenium.until;
var Condition = selenium.Condition;
var driver = new Builder().forBrowser("chrome").build();

driver.get("http://www.lichess.org/");

function startBot() {
	function yourTurnHandler(message) {
		if(message === "success") {
			playMove();
			
			driver.wait(
				new Condition("Timedout while waiting for their turn.", function(driver) {
					return driver.findElements(By.css(".clock_top")).then(function(elements) {
						return elements[0].getAttribute("class").then(function(classes) {
							return classes.indexOf("running") >= 0;
						});
					});
				}),
				60000
			).catch(function(error) {
				console.log(error);
			}).then(function(success) {
				if(success) {
					yourTurn(yourTurnHandler);
				}
			});
		} else if (message === "Not in game") {
			return;
		}
	}

	yourTurn(yourTurnHandler);
}

function yourTurn(callback) {
	// waits for 1 min
	driver.wait(
		new Condition("Timed out while waiting for our turn.", function(driver) {
			return driver.findElements(By.css(".clock_bottom")).then(function(elements) {
				if(elements.length === 0) {
					console.log("Not in a game.");
					return "Not in game";
				}
				return elements[0].getAttribute("class").then(function(classes) {
					if(classes.indexOf("running") >= 0) {
						return "success"
					}
				});
			});
		}),
		60000
	).catch(function(error) {
		console.log(error);
	}).then(callback);
}

function playMove() {
	console.log("Finding best move.");
	getBestMove(function(bestMove) {
		driver.executeScript(function(bestMove) {
			window.lichess.socket.send("move", {
				u: bestMove,
				b: 1
			});
		}, bestMove);
	});
}

function getBestMove(callback) {
	var bestMove;

	getFen(function(fen) {
		engine.postMessage("position fen " + fen);
		engine.postMessage("go movetime 100");
	});

	engine.onmessage = function(message) {
		if(message.indexOf("bestmove") === 0) {
			bestMove = message.split(" ")[1];
			callback(bestMove);
		}
	};
}

function getFen(callback) {
	driver.getCurrentUrl().then(function(url) {
		request.get(url, {}, function(err, res, body) {
			var split1 = body.split('"fen":"');
			var fen = split1[split1.length-1].split('"}')[0];
			callback(fen);
		});
	});
}


// Listens for alt + s
var id = iohook.registerShortcut([56, 31], function(keys) {
	startBot();
});

iohook.start();