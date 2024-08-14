    
$(document).ready(function () {
    let secs = document.querySelectorAll('.Video')
    let videos = document.querySelectorAll('.Video video')
    console.log(videos);
    videos.forEach(s=>{
    s.setAttribute('data-IS',false)
  })
  videos.forEach(v=>{
    v.addEventListener('click',function (event) {
      let Is = event.currentTarget.getAttribute('data-IS')
      console.log(Is);
      if(Is==='false'){
          $(event.currentTarget.parentElement).toggleClass('toggle');
          
          event.currentTarget.play()
          event.currentTarget.setAttribute('data-IS',true)
      }
      else{
        console.log('umm');
          $(event.currentTarget.parentElement).toggleClass('toggle');
          event.currentTarget.pause()
          event.currentTarget.setAttribute('data-IS',false)
      }
  });
  })
  
// Drop nav
  $('.DropMenu').slideUp();
  let navBtns = document.querySelectorAll('.Service .nav .Titlee')
  navBtns.forEach(nav=>{
      let IsOpen = false;
  nav.addEventListener('click',(e)=>{
      if(!IsOpen){
       console.log( e.currentTarget.parentElement.children[2]);
       e.currentTarget.parentElement.parentElement.classList.add('active')
          $(e.currentTarget.parentElement.children[2]).slideDown();
          IsOpen =true;
      }
      else{
        console.log('off',e.currentTarget);
        e.currentTarget.parentElement.parentElement.classList.remove('active')
          $(e.currentTarget.parentElement.children[2]).slideUp();
          IsOpen = false;
      } 
      })
  })
  })

//   RELATED COURSE SLIDER
let swiperCourse= new Swiper(".swiper-course", {
    speed: 1500,
    slidesPerView:1.7,
    spaceBetween: 30,
    centeredSlides: true,
    loop:true,
    grabCursor:true,

  }); 