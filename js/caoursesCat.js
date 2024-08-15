const slider = document.getElementById("js-cta-slider");
let progresBar = document.querySelector(".progresBar span");
const interleaveOffset = 0.75;
let progressList = document.querySelectorAll(".progressContainer ul li")
progressList[0].classList.add("activeBar")
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
      let count = 1 / (this.slides.length - 1);
      $(".progressContainer ul li").removeClass("activeBar")
      progressList[this.activeIndex].classList.add("activeBar")
      if (this.activeIndex == 0) {
        progresBar.style.transform = `scaleY(${0})`;
      } else {
        progresBar.style.transform = `scaleY(${this.activeIndex * count})`;
      }
    },
  },
});

$(".progressContainer ul li").click(function () {
  mySwiper.slideTo($(this).index());
  $(".progressContainer ul li").removeClass("activeBar");
  $(this).addClass("activeBar");
});
