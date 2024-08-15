// BASKET POPUP
let basketBtn = document.querySelectorAll('.basketBTN')
let PopUp =document.querySelector('.Bascket-Popup')
let CloseP =document.querySelector('.Bascket-Popup .Close')
basketBtn.forEach(btn=>{
    btn.addEventListener('click',()=>{
    PopUp.classList.add('Open')
    })
})
CloseP.addEventListener('click',()=>{
    PopUp.classList.remove('Open')
})