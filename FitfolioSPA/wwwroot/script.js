document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const content = document.querySelector(".content");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const section = this.textContent.toLowerCase();
            content.innerHTML = `<h2>${section}</h2><p>This is the ${section} section. You can add your specific content here.</p>`;
        });
    });
});