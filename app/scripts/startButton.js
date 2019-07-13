module.exports = wrapperWidth => {
	let entry = document.querySelector('#entry')
	let width = window.innerWidth - 15
	let rightOffset = width - wrapperWidth > 200 ? (width - wrapperWidth) / 2 : 100

	entry.style.right = `${rightOffset}px`
}
