
import { GuessController } from '../guessingGrid/guessController.js'
import { setupDropdown } from '../dropdown/dropdown.js'
import { setCookie, getCookie } from '../cookies.js'

const cookiePath = "SoundGuessPage"
const volumeCookie = "volume"

function setupCardAudio(randomCard)
{
	if(randomCard)
	{
		let voicelineHolder = document.getElementById("voicelineHolder")
		let volumeChanger = document.getElementById("volumeSliderHolder")
		voicelineHolder.style.display = "grid"
		volumeChanger.style.display = "block"
		while (guessController.gridParent.firstChild) 
		{
			guessController.gridParent.removeChild(guessController.gridParent.lastChild);
		}
		initGrid()
	}
	let playSound = document.getElementById("playSound")
	let attackSound = document.getElementById("attackSound")
	let deathSound = document.getElementById("deathSound")
	window.playAudio = new Audio(window.guessController.targetCard['voicelines']['Play'])
	window.attackAudio = new Audio(window.guessController.targetCard['voicelines']['Attack'])
	window.deathAudio = new Audio(window.guessController.targetCard['voicelines']['Death'])
	window.inputRange = document.querySelector('.custom-input')
	
	playSound.addEventListener("click", () => {pauseAudios();playAudio.play()})
	attackSound.addEventListener("click", () => {pauseAudios();attackAudio.play()})
	deathSound.addEventListener("click", () => {pauseAudios();deathAudio.play()})
	document.querySelector('.custom-input').addEventListener('input', () => updateAudio())
	setAudio();
	if(!randomCard)
	{
		setupDropdown(function(name){window.guessController.cardHasBeenGuessed(name)},window.guessController.searchBar)
	}
}

function pauseAudios()
{
	playAudio.pause()
	attackAudio.pause()
	deathAudio.pause()
	playAudio.currentTime = 0
	attackAudio.currentTime = 0
	deathAudio.currentTime = 0
}

function setAudio()
{
	let priorVolume = getCookie(volumeCookie)
	if(priorVolume != null)
	{
		let parsedVolume = parseFloat(priorVolume)
		if(parsedVolume != NaN)
		{
			inputRange.value = parsedVolume
			updateAudio()
		}
	}
}
function updateAudio()
{
	let volume = inputRange.value
	playAudio.volume = volume
	attackAudio.volume = volume
	deathAudio.volume = volume
	setCookie(volumeCookie, `${volume}`,365, cookiePath)
}


function onWin()
{
	let voicelineHolder = document.getElementById("voicelineHolder")
	let volumeChanger = document.getElementById("volumeSliderHolder")
	voicelineHolder.style.display = "none"
	volumeChanger.style.display = "none"
}

function init(randomCard = false)
{
	setupCardAudio(randomCard)
}
function main()
{
	const cardNameFilePath = "../Assets/CardData/voice.txt"
	const searchHeaders = ["name", "manaCost", "rarity", "classes", "power", "toughness", "minionType"]
	const gridParent = document.getElementById('grid')
	const col = 7
	const row = 8
	const shareMessageHeader = "I solved today's Hearthle (Based on Voicelines) in "
	window.guessController = new GuessController(cardNameFilePath, init, searchHeaders, grid, col, row, function(){},onWin,cookiePath, shareMessageHeader)
}
main()
