select(3)
function select(k){
    let button=document.getElementsByClassName('focusbutton')
    let display = document.getElementsByClassName('dash')
    for (i = 0; i < display.length; i++) {
        if (i == k) {
            display[i].style.display = 'block';
            button[i].style.backgroundColor='white'

        } else {
            display[i].style.display = 'none'
            button[i].style.backgroundColor = 'rgb(210, 209, 209)'
        }
    }
}
