
import { GuessController } from '../guessingGrid/guessController.js'
import { setupDropdown } from '../dropdown/dropdown.js'
var zoomLevels = [1500, 1000, 750, 500, 300, 250, 175, 100, 100]
var currentZoomLevel = 0

function setupCardArt(randomCard)
{
	if(randomCard)
	{
		document.getElementById("imageHolder").style.display = "block"
		document.getElementById("zoomPercentageHolder").style.display = "flex"
		while (guessController.gridParent.firstChild) 
		{
			guessController.gridParent.removeChild(guessController.gridParent.lastChild);
		}
		initGrid()
		currentZoomLevel = 0
	}
	let fullArt = document.getElementById("fullArt")
	let zoomPercentage = document.getElementById("zoomPercentage")
	let zoomLevel = zoomLevels[currentZoomLevel++]
	fullArt.src = window.guessController.targetCard['fullArt']
	fullArt.style.transform = `scale(${zoomLevel}%)`;
	zoomPercentage.innerHTML = `${zoomLevel}%<br>Zoom`
	if(!randomCard)
	{
		setupDropdown(function(name){window.guessController.cardHasBeenGuessed(name)},window.guessController.searchBar)
	}
}

function onWin()
{
	document.getElementById("imageHolder").style.display = "none"
	document.getElementById("zoomPercentageHolder").style.display = "none"
}

function onGuess()
{
	let fullArt = document.getElementById("fullArt")
	let zoomPercentage = document.getElementById("zoomPercentage")
	let zoomLevel = zoomLevels[currentZoomLevel++]
	fullArt.style.transform = `scale(${zoomLevel}%)`;
	zoomPercentage.innerHTML = `${zoomLevel}%<br>Zoom`

}


function init(randomCard = false)
{
	setupCardArt(randomCard)
}
function main()
{
	const cardNameFilePath = "../Assets/CardData/art.txt"
	const searchHeaders = ["name", "manaCost", "rarity", "classes", "power", "toughness", "minionType"]
	const col = 7
	const row = 8
	const cookiePath = "ArtGuessPage"
	const shareMessageHeader = "I solved today's Hearthle (Based on Art) in "
	window.guessController = new GuessController(cardNameFilePath, init, searchHeaders, grid, col, row, onGuess,onWin,cookiePath, shareMessageHeader)
}
main()
