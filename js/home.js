if (window.innerWidth > 800) {
  const text = new SplitType("#target", { types: "lines" });
}
let answers = document.querySelectorAll(".section7 .card .answer");
let cards = document.querySelectorAll(".section7 .card");
let numbers = document.querySelectorAll(".section7 .card .number span");
let imgList = document.querySelectorAll(".imgList .imgS");
let inList = document.querySelectorAll(".inList ul li");
let inList1 = document.querySelectorAll(".list section");

cards[0].classList.add("activeFq");
answers[0].style.display = "block";

numbers.forEach((element, index) => {
  if (index < 9) {
    element.innerHTML = `0${index + 1}`;
  } else {
    element.innerHTML = `${index + 1}`;
  }
});
imgList.forEach((element, index) => {
  element.style.top = `${(index / inList1.length) * 3 + inList1.length}em`;
});

inList.forEach((element, index) => {
  element.addEventListener("mouseenter", function (params) {
    $(".goal").css("opacity", "0");
    $(".peri").css("opacity", "0");

    $(".goal").css("display", "none");
    $(".peri").css("display", "none");

    element.querySelector(".goal").style.display = "block";
    element.querySelector(".peri").style.display = "block";
    setTimeout(() => {
      element.querySelector(".goal").style.opacity = "1";
      element.querySelector(".peri").style.opacity = "1";
    }, 220);

    if (window.innerWidth > 650) {
      $(".inList ul li .inner").removeClass("activeList");
      element.querySelector(".inner").classList.add("activeList");
      $(".imgList .imgS").css("transform", "translateX(-3em)");
      $(".imgList .imgS").css("opacity", "0");
      imgList[index].style.opacity = "1";
      imgList[index].style.transform = "translateX(0)";
    }
  });
  element.addEventListener("mouseleave", function (params) {
    // setTimeout(() => {

    $(".goal").css("opacity", "0");
    $(".peri").css("opacity", "0");

    $(".goal").css("display", "none");
    // }, 220);
    $(".peri").css("display", "none");

    $(".inList ul li .inner").removeClass("activeList");
    $(".imgList .imgS").css("transform", "translateX(-3em)");
    $(".imgList .imgS").css("opacity", "0");
  });
});

cards.forEach((element) => {
  element.addEventListener("click", function (params) {
    // console.log(element.getAttribute("data-open"));
    let flag = element.classList.contains("activeFq");
    if (flag) {
      console.log("true");
      element.classList.remove("activeFq");
      setTimeout(() => {
        element.querySelector(".answer").style.display = "none";
      }, 500);
    } else {
      console.log("false");

      element.querySelector(".answer").style.display = "block";
      setTimeout(() => {
        element.classList.add("activeFq");
      }, 100);
    }
  });
});

let circles = document.querySelectorAll(".circle");
circles.forEach((element) => {
  gsap.to(element.querySelector(".back"), {
    scrollTrigger: {
      trigger: element,
      start: "top 70%",
      end: "top 50%",
    },
    scale: 1,
  });
  gsap.to(element.querySelector("span"), {
    scrollTrigger: {
      trigger: element,
      start: "top 70%",
      end: "top 50%",
      onEnter: () => (element.querySelector("span").style.opacity = "1"),
      onLeaveBack: () => (element.querySelector("span").style.opacity = "0"),
    },
  });
});
