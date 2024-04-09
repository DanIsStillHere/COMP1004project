$(document).ready(function () {
    // Store the content of the home section
    var homeContent = `
        <div class="content">
            <h2>Welcome to Fitfolio!</h2>
            <p>Fitfolio was designed to provide you, the user, with an easily usable platform to monitor your fitness journey. Here you can create and update workout routines, meals and their nutritonal information, and further educate yourself on physical health.</p>
            <p>You can access any of these features by using the menu on the left for navigation. 'Exercises' will allow you to track your workout routines, 'Diet' will allow you to track your meals, and 'Readings' will provide you with links to various literature on physical health.</p>
            <p>We hope that this application provides you with the motivation necessary to begin or continue your fitness journey!</p>
            <img src="img/blackHeart.jpg" alt="Heart Background" width="400" height="300" />
        </div>
    `;

    // Function to handle navigation clicks
    $(".nav-link").click(function (e) {
        e.preventDefault(); // Prevent default behavior of link

        // Remove active class from all links
        $(".nav-link").removeClass("active");

        // Add active class to clicked link
        $(this).addClass("active");

        // Check if the clicked link is the "Home" link
        if ($(this).text() === "Home") {
            // Load the content of the home section
            $(".content").html(homeContent);
        }
        // Add additional else if conditions for other menu options if needed
    });
});
