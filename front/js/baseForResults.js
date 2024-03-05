function showHideFullText() {
	let parent = this.parentElement
	let parentTextElement = parent.querySelector(".eventText")
	if (parentTextElement.classList.contains('textClamp')) {
		parentTextElement.classList.remove('textClamp')
	} else {
		parentTextElement.classList.add('textClamp')
	}
}




//добавляем ивенты на кнопки
document.querySelectorAll(".click").forEach(item => (item.addEventListener("click",showHideFullText)))