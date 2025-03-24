const dropdownElements = [];
function filterFunction(inputField) 
{
	const cardData = window.guessController.cardData
	const guessedCards = window.guessController.guessedCards
	if(inputField == null)
	{
		return
	}
	dropdownElements.forEach(element => element.classList.remove("show"))
	dropdownList.style.display = "none"
    const input = inputField.value.toUpperCase()
	if(input == "")
	{
		return
	}
	let currentDropdownSize = 0
	let dropdownSize = dropdownElements.length
	let backupOptions = []
	for(var key in cardData)
	{
		let inputIndex = key.indexOf(input)
		if(inputIndex != -1 && !guessedCards.includes(key))
		{
			if(inputIndex != 0)
			{
				backupOptions.push(cardData[key]["name"])
				continue;
			}
			let currentElement = dropdownElements[currentDropdownSize++]
			currentElement.innerHTML = cardData[key]["name"]
			currentElement.classList.add("show")
			if(currentDropdownSize >= dropdownSize)
			{
				break
			}
		}
	}
	let backupIndex = 0
	while(currentDropdownSize < dropdownSize && backupIndex < backupOptions.length)
	{
		let currentElement = dropdownElements[currentDropdownSize++]
		currentElement.innerHTML = backupOptions[backupIndex++]
		currentElement.classList.add("show")
	}
	if(currentDropdownSize != 0)
	{
		window.dropdownList.style.display = ""
	}
}

function enableDropdown(inputField)
{
	if(dropdownList.childElementCount == 0)
	{
		return
	}
	window.dropdownList.style.display = "block"
	filterFunction(inputField)
}

function disableDropdown()
{
	const hovered_elements = document.querySelectorAll( ":hover" )
	if(hovered_elements.length == 0)
	{
		dropdownList.style.display = "none"
		return;
	}
	const last_element = hovered_elements[hovered_elements.length - 1]

	if (!last_element.classList.contains("show")) 
	{
		dropdownList.style.display = "none"
	} 
}


export function setupDropdown(onClickfunction, inputField)
{
	window.dropdownList = document.getElementById("dropdown-content")
	let dropdownSize = 10;
	createButtons(dropdownSize, dropdownList, onClickfunction,inputField )
	inputField.onclick = function(){enableDropdown(inputField)}
	inputField.onblur = disableDropdown
	inputField.oninput = function(){filterFunction(inputField)}

}

function createButtons(count, dropdown, onClickfunction, inputField) 
{

    dropdown.innerHTML = ''

    for (let i = 0; i < count; ++i) 
	{
        const link = document.createElement("button")
		link.onclick = function()
		{
			dropdownList.style.display = "none"
			inputField.value = ""
			onClickfunction(link.innerHTML.toUpperCase())
		}
        dropdown.appendChild(link)
		dropdownElements.push(link)
    }
}