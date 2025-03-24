import {getCookie, setCookie, deleteCookie} from "../cookies.js"

export class GuessController 
{
    GuessResults = {
        CORRECT: "correct",
        WRONG: "wrong",
        PARTIAL: "partial",
        HIGHER: "higher",
        LOWER: "lower"
    }
    Rarities = ["Free","Common", "Rare", "Epic", "Legendary"]
    nameToData = {}
    guessedCards = []
    shareMessage = ""
    cardData = null
    targetCard = null

    constructor(cardNamesPath, callback,searchHeaders, gridParent, col, row, onGuessCallback, onWinCallback, cookiePath, shareMessageHeader) 
	{
        this.searchBar = document.getElementById("searchBar")
        this.gridParent = gridParent
        this.colCount = col
        this.rowCount = row
        this.cookiePath = cookiePath
        this.searchHeaders = searchHeaders
        this.onGuessCallback = onGuessCallback
        this.onWinCallback = onWinCallback
        this.shareBtn = document.getElementById("shareBtn")
        this.shareMessageHeader = shareMessageHeader
        this.beginFetchingCardData(cardNamesPath, callback)
    }

    checkForPriorGuesses()
    {
        let rawPriorGuesses = getCookie("priorGuesses")
        if(rawPriorGuesses == null)
        {
            return
        }
        const priorGuesses = rawPriorGuesses.split(",")
        priorGuesses.forEach(guess =>{this.cardHasBeenGuessed(guess, false)})
    }
    beginFetchingCardData(cardNamesPath, callback) 
	{
        Promise.all([
            fetch('../Assets/CardData/all_cards.json').then(response => response.json()),
            fetch(cardNamesPath).then(response => response.text())
        ]).then(([cardData, secondFileContent]) => {
            const cardNameOrder = secondFileContent.split('\n').map(line => line.trim()).filter(line => line !== '')
            this.cardDataIsLoaded(cardData, cardNameOrder, callback)
        }).catch(error => this.dataHasErrored(error))
    }

    getCardForSession(cardNames) 
	{
        const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
        const listIndex = daysSinceEpoch % cardNames.length
        return cardNames[listIndex]
    }

    cardDataIsLoaded(data, cardNames, callback) 
	{
        this.cardData = data
        this.targetCard = this.cardData[this.getCardForSession(cardNames)]
        this.checkForPriorGuesses();
        if(getCookie("wonToday") != "true")
        {
            this.searchBar.disabled = false
        }
		callback()
    }

    findOverlappingElements(arr1, arr2) 
    {
        return arr1.filter(element => arr2.includes(element))
    }

    getGuessResults(guessedCard)
    {
        let guessResults = []
        this.searchHeaders.forEach(header => 
        {
            const headerValue = guessedCard[header]
            let result = "";
            if(headerValue == null || this.targetCard[header] == null)
            {
                result = headerValue == this.targetCard[header] ? this.GuessResults.CORRECT : this.GuessResults.WRONG;
            }
            else if (headerValue.constructor === Array)
            {
                let overlap = this.findOverlappingElements(headerValue, this.targetCard[header])
                result = overlap.length == Math.max(headerValue.length, this.targetCard[header].length) ? this.GuessResults.CORRECT : overlap > 0 ? this.GuessResults.PARTIAL : this.GuessResults.WRONG
            }
            else
            {
                if(header == "rarity")
                {
                    let rarityDiff = this.Rarities.indexOf(headerValue) - this.Rarities.indexOf(this.targetCard[header])
                    result = rarityDiff == 0 ? this.GuessResults.CORRECT : rarityDiff > 0 ? this.GuessResults.LOWER : this.GuessResults.HIGHER
                }
                else if (typeof headerValue != "number")
                {
                    result = headerValue == this.targetCard[header] ? this.GuessResults.CORRECT : this.GuessResults.WRONG;
                }
                else
                {
                    let diff = headerValue - this.targetCard[header]
                    result = diff == 0 ? this.GuessResults.CORRECT : diff > 0 ? this.GuessResults.LOWER : this.GuessResults.HIGHER
                }
            }
            guessResults.push(result)
        })
        return guessResults
    }

    addEmojiLine(guessResults)
    {
        let guessToEmojiMap = ""
        guessResults.forEach(result => 
        {
            if (result == this.GuessResults.PARTIAL)
            {
                guessToEmojiMap += "🟧"
            }
            else if (result == this.GuessResults.CORRECT)
            {
                guessToEmojiMap += "🟩"
            }
            else
            {
                guessToEmojiMap += "🟥"
            }
        })
        this.shareMessage += `\n${guessToEmojiMap}`
    }
    isElementInViewport (el) 
    {    
        var rect = el.getBoundingClientRect();
    
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    cardHasBeenGuessed(name, revealAttributesSlowly = true) 
    {
        const guessedCard = this.cardData[name]
           
        if (this.guessedCards.includes(name) || !guessedCard) 
        {
            console.log(`${name} was either reguessed or not found`)
            return
        }
        const guessIsCorrect =  guessedCard === this.targetCard
        const startIndex = this.colCount * this.guessedCards.length
        const guessResults = this.getGuessResults(guessedCard)
        this.addEmojiLine(guessResults)

        this.guessedCards.push(name)

        if(revealAttributesSlowly)
        {
            setCookie("priorGuesses", this.guessedCards.join(","),undefined,this.cookiePath)
        }

        if (this.guessedCards.length >= this.rowCount || guessIsCorrect) 
        {
            this.searchBar.disabled = true
        }
    
        if (revealAttributesSlowly && !this.isElementInViewport(this.gridParent.children[startIndex])) 
        {
            this.gridParent.children[startIndex].scrollIntoView()
        }
    
        this.searchHeaders.forEach((header, currentIndex) => 
        {
            const cell = this.gridParent.children[startIndex + currentIndex]
            const cellValue = this.formatCellValue(guessedCard[header])
            const result = guessResults[currentIndex]
    
            const updateCell = () => {
                cell.innerHTML = cellValue
                cell.classList.add(result)
            };
    
            revealAttributesSlowly 
                ? setTimeout(updateCell, 425 * currentIndex)
                : updateCell()
        });
        this.onGuessCallback();
        if(guessIsCorrect && revealAttributesSlowly)
        {
            setCookie("wonToday", true, undefined, this.cookiePath)
        }
        if (this.guessedCards.length === this.rowCount || guessIsCorrect) 
        {
            revealAttributesSlowly
                ? setTimeout(() => this.endGuessing(), 425 * this.searchHeaders.length)
                : this.endGuessing()
        }
    
    }
    
    formatCellValue(value) 
    {
        if (value === null) return 'None'
        return Array.isArray(value) ? value.join('\n') : value
    }

    async setupShareBtn()
    {
        this.shareMessage = this.shareMessageHeader + this.shareMessage + `\nhttps://hearthle.com/`
        document.getElementById("victoryShare").style.display = "block"
        this.shareBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(this.shareMessage).then(() => {})
            .catch(err => {
                console.error("Failed to copy text: ", err);
            });
        });
    }
    endGuessing()
    {
        this.searchBar.disabled = true
        let finishedGuessing = document.getElementById("guessingFinished")
        finishedGuessing.style.display = "block"
        let beatGame = this.cardData[this.guessedCards[this.guessedCards.length - 1]] == this.targetCard 
        let headerMessage = ""
        if (beatGame)
        {
            headerMessage = `Won in ${this.guessedCards.length} guess`
            this.shareMessageHeader += `${this.guessedCards.length} guess`
            if(this.guessedCards.length > 1)
            {
                headerMessage += "es"
                this.shareMessageHeader += "es"
            }
            this.setupShareBtn();
        }
        else
        {
            headerMessage = "Game Over!"
        }
        finishedGuessing.children[0].innerHTML = headerMessage
        finishedGuessing.children[1].src = this.targetCard.image
        this.onWinCallback();
        document.body.scrollTo({ top: 0 })

    }

    dataHasErrored(error) 
	{
        console.error("Error loading card data:", error)
    }
}