
import { GuessController } from '../guessingGrid/guessController.js'
import { setupDropdown } from '../dropdown/dropdown.js'

function setupCardSet(randomCard)
{
	if(randomCard)
	{
		document.getElementById("setSymbolHolder").style.display = "block"
		while (guessController.gridParent.firstChild) 
		{
			guessController.gridParent.removeChild(guessController.gridParent.lastChild);
		}
		initGrid()
	}
	const cardSet = window.guessController.targetCard.set.replaceAll(" ", "_")
	const symbol_path = `../Assets/SetGuess/SetIcons/${cardSet}.svg`
	document.getElementById("setSymbol").src = symbol_path
	document.getElementById("setTitle").innerHTML = window.guessController.targetCard.set
	if(!randomCard)
	{
		setupDropdown(function(name){window.guessController.cardHasBeenGuessed(name)},window.guessController.searchBar)
	}
}

function onWin()
{
	document.getElementById("setSymbolHolder").style.display = "none"
}
function init(randomCard = false)
{
	setupCardSet(randomCard)

}
function main()
{
	const cardNameFilePath = "../Assets/CardData/set.txt"
	const searchHeaders = ["name", "manaCost", "rarity", "classes", "power", "toughness", "minionType"]
	const grid = document.getElementById('grid')
	const col = 7
	const row = 8
	const cookiePath = "SetGuessPage"
	const shareMessageHeader = "I solved today's Hearthle (Based on Set) in "
	window.guessController = new GuessController(cardNameFilePath, init, searchHeaders, grid, col, row, function(){},onWin,cookiePath, shareMessageHeader)
}
main()
