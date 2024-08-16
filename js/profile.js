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
document.querySelector('.navBox .Item a[href*=one]').classList.add('active')
let btns  = document.querySelectorAll('.navBox .Item')
btns.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        for(let i = 0 ; i< btns.length;i++){
            btns[i].classList.remove('active')
        }
      e.currentTarget.classList.add('active')
    })
})
let sections = document.querySelectorAll('.Sec')
window.addEventListener('scroll',(e)=>{
             // change active menu on scroll        
             let scrTop = window.scrollY  
             sections.forEach(sec =>{
                let top = scrTop;
                let offset = sec.offsetTop-200;
                let height= sec.offsetHeight;
                let id =sec.getAttribute('id')
                if(top>= offset && top < offset + height){
                btns.forEach(btn=>{         
                btn.querySelector('a').classList.remove('active');
               document.querySelector('.navBox .Item a[href*='+id + ']').classList.add('active')
             })
     
             }
        })
})