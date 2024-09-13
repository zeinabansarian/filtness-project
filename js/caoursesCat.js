$('.coursesCat').imagesLoaded( function() {

setTimeout(() => {
  
  let progresBarContainer = document.querySelector(".progresBarContainer")
  let sliders = document.querySelectorAll(".swiper-slide")
  for (let i = 1; i < sliders.length; i++) {
    const element = sliders[i];
    let newprogressBar = document.createElement("div")
    newprogressBar.classList.add("progresBar")
    let newSpan = document.createElement("span")
    
    newprogressBar.appendChild(newSpan)
    progresBarContainer.appendChild(newprogressBar)
  }
  
  
  const slider = document.getElementById("js-cta-slider");
  let progresBar = document.querySelectorAll(".progresBar");
  const interleaveOffset = 0.75;
  let progressList = document.querySelectorAll(".progressContainer ul li")
  progressList[0].classList.add("activeBar")
  let lastIndex = 0;
  const mySwiper = new Swiper(slider, {
    loop: false,
    direction: "vertical",
    autoplay: true,
    speed: 1000,
    grabCursor: false,
    watchSlidesProgress: true,
    mousewheelControl: true,
    mousewheel: true,
  
    on: {
      progress: function () {
        let swiper = this;
  
        for (let i = 0; i < swiper.slides.length; i++) {
          let slideProgress = swiper.slides[i].progress;
          let innerOffset = swiper.height * interleaveOffset;
          let innerTranslate = slideProgress * innerOffset;
  
          //TweenMax.set(swiper.slides[i], {
          //skewY: `${innerTranslate*0.025}deg`,
          //});
          TweenMax.set(swiper.slides[i].querySelector(".slide-inner"), {
            y: innerTranslate,
          });
        }
      },
      touchStart: function () {
        let swiper = this;
        for (let i = 0; i < swiper.slides.length; i++) {
          swiper.slides[i].style.transition = "";
        }
      },
      setTransition: function (speed) {
        let swiper = this;
        for (let i = 0; i < swiper.slides.length; i++) {
          swiper.slides[i].style.transition = speed + "ms";
          swiper.slides[i].querySelector(".slide-inner").style.transition =
            speed + "ms";
        }
      },
  
      slideChangeTransitionStart: function () {
        if (this.activeIndex>lastIndex) {
          progresBar[this.activeIndex-1].classList.add("activeBar");
         lastIndex= this.activeIndex;
         
        }else{
          progresBar[this.activeIndex].classList.remove("activeBar");
          lastIndex= this.activeIndex
  
        }
        // let count = 1 / (this.slides.length - 1);
        $(".progressContainer ul li").removeClass("activeBar")
        progressList[this.activeIndex].classList.add("activeBar")
        
        if (this.activeIndex == 0) {
  
        } else {
          progresBar[this.activeIndex-1].classList.add("activeBar");
        }
      },
    },
  });
  
  $(".progressContainer ul li").click(function () {
    mySwiper.slideTo($(this).index());
    $(".progressContainer ul li").removeClass("activeBar");
    $(this).addClass("activeBar");
  });
}, 1000);

  
});

