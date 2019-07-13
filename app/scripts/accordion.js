module.exports = () => {
  document.querySelectorAll('ol .icon')
    .forEach((row) => {
      row.addEventListener('click', () => {
        row.parentNode.parentNode.classList.toggle('open')
      }, false)
    })
}
