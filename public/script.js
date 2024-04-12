const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];
const subBtn = document.getElementsByClassName("sub-btn");
const succesAlert = document.getElementsByClassName('success');
// ----- Modal -----
function openModal(id) {
  var modal = document.getElementById('myModal' + id);
  modal.style.display = 'block';
}
// span.onclick = function() {
//   modal.style.display = "none";
// }
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// ----- Modal -----

// Navbar
const navBar = document.querySelector("nav"),
       menuBtns = document.querySelectorAll(".menu-icon"),
       overlay = document.querySelector(".overlay");

     menuBtns.forEach((menuBtn) => {
       menuBtn.addEventListener("click", () => {
         navBar.classList.toggle("open");
       });
     });

     overlay.addEventListener("click", () => {
       navBar.classList.remove("open");
     });