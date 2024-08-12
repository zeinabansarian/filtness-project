//type
//<div>
// <video>
//<playbtn>
//</div>


// STYLE
// .pause {
//   opacity: 1;
// }

// .play {
//   opacity: 0;
//   display: none;
// }

let playBtn = document.querySelectorAll(".playbtn");
playBtn.forEach((element) => {
  element.addEventListener("click", function (params) {
    console.log();
    let videoCtrl = element.previousElementSibling;
    videoCtrl.play();
    element.classList.remove("pause");
    element.classList.add("play");
    videoCtrl.addEventListener("click", () => {
      videoCtrl.pause();
      element.classList.remove("play");
      element.classList.add("pause");
    });
  });
});
