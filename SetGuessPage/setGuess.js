
import { GuessController } from '../guessingGrid/guessController.js'
import { setupDropdown } from '../dropdown/dropdown.js'

function setupCardSet()
{
	const cardSet = window.guessController.targetCard.set.replaceAll(" ", "_")
	const symbol_path = `../Assets/SetGuess/SetIcons/${cardSet}.svg`
	document.getElementById("setSymbol").src = symbol_path
	document.getElementById("setTitle").innerHTML = window.guessController.targetCard.set
	setupDropdown(function(name){window.guessController.cardHasBeenGuessed(name)},window.guessController.searchBar)
}

function onWin()
{
	document.getElementById("setSymbolHolder").style.display = "none"
}

function init()
{
	// setCardSetSymbol()
	setupCardSet()
	console.log(guessController.targetCard)
}
function main()
{
	const cardNameFilePath = "../Assets/CardData/set.txt"
	const searchHeaders = ["name", "manaCost", "rarity", "classes", "power", "toughness", "minionType"]
	const gridParent = document.getElementById('grid')
	const col = 7
	const row = 8
	const cookiePath = "SetGuessPage"
	const shareMessageHeader = "I solved today's Hearthle (Based on Set) in "
	window.guessController = new GuessController(cardNameFilePath, init, searchHeaders, grid, col, row, function(){},onWin,cookiePath, shareMessageHeader)
}
main()
