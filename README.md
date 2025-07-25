# minesweeper-game
Minesweeper - JavaScript Practice Project
A classic Minesweeper game built with vanilla JavaScript, HTML, and CSS as a beginner-friendly practice project. This project focuses on implementing core game logic, DOM manipulation, and event handling while creating a functional and interactive game.
Features

Three Difficulty Levels: Beginner (9x9, 10 mines), Intermediate (16x16, 40 mines), and Expert (16x30, 99 mines).
Interactive Gameplay: Left-click to reveal cells, right-click to flag mines, and toggle flag mode with a dedicated button.
Dynamic UI: Timer, mine counter, and a reset button (smiley face) to restart the game.
Custom Styling: Centered flag button, no gap between status bar and board, and a modern gray-themed status bar (#A8A8A8).
Game Over Message: Displays "Congratulations! You won!" or "Game Over! You hit a mine!" in the DOM.
Responsive Design: Works on desktop and touch devices (with ongoing reset button fix for touch).

Learning Objectives

JavaScript: Game state management, event listeners (click, contextmenu, pointerdown), recursive cell revealing, and timer implementation.
DOM Manipulation: Dynamically rendering the game board, updating UI elements, and handling user interactions.
CSS: Flexbox for layout (e.g., centered flag button), grid for the board, and minimalistic styling.
HTML: Semantic structure with accessibility considerations (e.g., aria-labelledby).

How to Play

Open index.html in a browser.
Select a difficulty (Beginner, Intermediate, Expert).
Left-click to reveal cells, right-click to flag suspected mines, or use the flag button to toggle flag mode.
Avoid mines to win by revealing all non-mine cells.
Click the smiley face to reset the game.

Installation

Clone the repository: git clone https://github.com/your-username/minesweeper-js.git
Open index.html in a browser to play.

Future Improvements

Ensure the first click is mine-free.
Add a high score system to track best times.
Enhance touch support with long-press flagging.
Include animations for cell reveals or game over.

License
MIT License - feel free to use, modify, and share this project.
