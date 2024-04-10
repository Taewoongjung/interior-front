const toggleBtn = document.querySelector(".toggleBtn");
const menu = document.querySelector(".navbar_menu");
const contact = document.querySelector(".navbar_contact");

function click () {
    menu.classList.toggle("activeBtn");
    contact.classList.toggle("activeBtn");
}

toggleBtn.addEventListener("click",click);