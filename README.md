
# Hearthle

Hearthle is a Wordle-inspired game featuring cards from the popular game Hearthstone. This repository contains the static files for the website. You can play the live version of the game [here](https://hearthle.com).

## How to Play
- Pick a mode to play: Guess based on Set, Art or Voicelines
-   Guess the correct Hearthstone card in a limited number of attempts.
    
-   After each guess, you'll receive feedback indicating how close your guess is to the correct card based on specific attributes (such as mana cost, card type, or set).
    
-   Use the hints to refine your guesses and solve the puzzle within the given attempts.
    

## Data

The card data used in this game comes from both the Hearthstone API and the Hearthstone Wiki. You can find the full dataset [here](https://github.com/Foulgaze/HearthstoneCardArchive).

## Installation & Running Locally

If you’d like to run Hearthle locally, follow these steps:

1.  **Clone the repository**
	```
	git clone https://github.com/Foulgaze/Hearthle.git
	cd hearthle
	```
2. **Open the index file**  
Since this is a static site, you can simply open `index.html` in a browser or serve it with a lightweight HTTP server:
	```
	python -m http.server 8000
	```
	Then, visit `http://localhost:8000` in your browser.
## Contributing

Contributions are welcome! If you’d like to suggest improvements or fix issues, follow these steps:

1.  Fork the repository
    
2.  Create a new branch for your changes
    
3.  Submit a pull request
## Credits

-   Hearthstone API and Hearthstone Wiki for card data
    
-   Hearthstone and all related assets are © Blizzard Entertainment
