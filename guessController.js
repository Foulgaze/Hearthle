class GuessController
{
	nameToData = new Object();
	function getDailyCard()
	{

	}
	function beginFetchingCardData(seedOffset)
	{
		fetch('../Assets/CardData/all_cards.json').then
		(response => response.json()).then
		(data => {cardDataIsLoaded(data, seedOffset)}).catch
		(error => dataHasErrored(error));
	}

	function cardDataIsLoaded(data, seedOffset)
	{
		window.cardData = data;
			

	}
	constructor(seedOffset)
	{
		beginFetchingCardData(seedOffset)
	}
}