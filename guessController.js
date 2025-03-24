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
    cardData = null
    targetCard = null

    constructor(cardNamesPath, searchBar, callback,searchHeaders, gridParent, col, row) 
	{
        this.searchBar = searchBar
        this.gridParent = gridParent
        this.colCount = col
        this.rowCount = row
        this.searchHeaders = searchHeaders
        this.beginFetchingCardData(cardNamesPath, callback)
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
        this.searchBar.disabled = false
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

    cardHasBeenGuessed(name, timeout = true)
    {
        const guessedCard = this.cardData[name]
        if(this.guessedCards.includes(name) || guessedCard == undefined)
        {
            console.log(`${name} was either reguessed or not found`)
            return
        }
        let startIndex = this.colCount * this.guessedCards.length
        let currentIndex = 0;
        this.guessedCards.push(name)
        let guessResults = this.getGuessResults(guessedCard)
        let timeoutValue = 425
        this.searchHeaders.forEach(header => 
        {
            let cell = this.gridParent.children[startIndex + currentIndex]
            let innerHTML = ""
            if(guessedCard[header] == null)
            {
                innerHTML = "None"
            }
            else if(guessedCard[header].constructor == Array)
            {
                innerHTML = guessedCard[header].join('\n')
            }
            else
            {
                innerHTML = guessedCard[header]
            }
            let result = guessResults[currentIndex]
            let setInnerText = function(){cell.innerHTML = innerHTML}
            if (timeout)
            {
                setTimeout(() => {setInnerText(); cell.classList.add(result)}, timeoutValue * currentIndex);
            }
            else
            {
                setInnerText()
                cell.classList.add(result)
            }
            currentIndex += 1
        })
        if(this.guessedCards.length == this.rowCount || guessedCard == this.targetCard)
        {
            this.endGuessing()
        }
        
    }
    endGuessing()
    {
        this.searchBar.disabled = true

    }

    dataHasErrored(error) 
	{
        console.error("Error loading card data:", error)
    }
}