
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

$(".seeMore").css('visibility', 'hidden');
$(".seeMore").css('visibility', 'hidden');
if ($(".CourseLists .Course").length >8 ) {
     $(".seeMore").css('visibility', 'visible');
 }
$(document).ready(function() {
  $(".CourseLists .Course").slice(0, 8).show();
$('.seeMore').on('click', function (e) {
e.preventDefault();
$(".CourseLists .Course:hidden").slice(0, ).slideDown();
if ($(".CourseLists .Course:hidden").length == 0) {
  $(".seeMore").css('visibility', 'hidden');
  $(".seeMore").css('visibility', 'hidden');

}

});
})