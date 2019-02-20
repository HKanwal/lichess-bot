## About
This is a bot for the chess site lichess.org. It runs on Nodejs using selenium for web automation. It uses stockfish level 20 to find the best moves.

## Installation
[First clone the GitHub repository.](https://github.com/HKanwal/lichess-bot)

[Navigate to this page and download the correct chromedriver for your system.](http://chromedriver.storage.googleapis.com/index.html?path=2.46/) This will be required by selenium to run chrome.

Make sure that your computer already has chrome installed and it is located in the default install location.

Extract the chromedriver you downloaded and place it in a file somewhere. Then add the the path to the file it is located in to the PATH environment variable.

If you are on Windows, run Command Prompt as administrator and the increase number of dynamic ports by typing:
```
netsh int ipv4 set dynamicport tcp start=10000 num=55535
```

## Usage

After ensuring Nodejs in installed, navigate to the cloned directory and run.
```
node main.js
```

Start a game, play the first move, then press ALT+S to start the bot. On windows, ALT+S corresponds to the key codes 56+31. If you are on a different OS, 56+31 may correpond to a different key combination.

## TODO
- Add variable stockfish skill level, currently always set to max
- Make occasional mistakes to look less suspicious
- Add variable time taken to find move, currently always 100 ms
- Make time taken to find move depend as a function on time left on clock

## Help
If you need any help or have any questions or suggestions, contact me at hsk532991@hotmail.com.

## License
MIT