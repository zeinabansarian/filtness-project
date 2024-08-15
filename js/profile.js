let skillBars = document.querySelectorAll('.skills-bar .bar')
skillBars.forEach(bar=>{
    let skilsCounts =parseInt(bar.querySelector('.skill').innerHTML)
    let prog = bar.querySelector('.progress-line span')
    prog.style.width= `${skilsCounts}%`
})

// SELECTBOX
let defOP = document.querySelectorAll('.default_option')
defOP.forEach((d)=>{
    d.addEventListener('click',(e)=>{
   e.currentTarget.parentElement.classList.toggle("active")
   let lis =e.currentTarget.nextElementSibling.querySelectorAll('.select_ul li')
   lis.forEach(l=>{
    l.addEventListener('click',(e1)=>{
        let currentele = e1.currentTarget.querySelector('p').innerHTML
        console.log(e1.currentTarget);
        e1.currentTarget.parentElement.previousElementSibling.querySelector('p').innerHTML = currentele;
        e1.currentTarget.classList.add("active")
        e1.currentTarget.parentElement.parentElement.classList.remove("active")
       })
   })
})
})

let btns  = document.querySelectorAll('.navBox .Item')
btns.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        for(let i = 0 ; i< btns.length;i++){
            btns[i].classList.remove('active')
        }
      e.currentTarget.classList.add('active')
    })
})