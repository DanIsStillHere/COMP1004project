$(document).ready(function () {
    // Homepage content HTML //
    var homeContent = `
        <div class="content">
            <h2>Welcome to Fitfolio!</h2>
            <p>Fitfolio was designed to provide you, the user, with an easily usable platform to monitor your fitness journey. Here you can create and update workout routines, meals and their nutritonal information, and further educate yourself on physical health.</p>
            <p>You can access any of these features by using the menu on the left for navigation. 'Exercises' will allow you to track your workout routines, 'Diet' will allow you to track your meals, and 'Readings' will provide you with links to various literature on physical health.</p>
            <p>We hope that this application provides you with the motivation necessary to begin or continue your fitness journey!</p>
            <img src="img/blackHeart.jpg" alt="Heart Background" width="400" height="300" />
        </div>
    `;

    // Exercise page content HTML //
    var exerciseContent = `
        <div class="content">
            <h2>Welcome to the Exercise Section!</h2>
            <form id="add-routine-form">
                <label for="routine-name">Routine Name:</label>
                <input type="text" id="routine-name" required>
                <button type="submit">Search</button>
                <button type="submit" id="create-routine">Create</button>
            </form>
            <div id="exercise-list">
                <!-- Exercise list will be displayed here -->
            </div>
            <button id="save-routine">Save</button>
        </div>
    `;

    // Diet page content HTML //
    var dietContent = `
        <div class="content">
            <h2>Welcome to the Diet Section!</h2>
            <p>This is the diet section.</p>
        </div>
    `;

    // Readings page content HTML //
    var readingsContent = `
        <div class="content">
            <h2>Welcome to the Readings Section!</h2>
            <p>This is the readings section.</p>
        </div>
    `;

    // Array to store routines //
    var allRoutines = [];

    // Function to handle navigation clicks using event delegation //
    $(document).on("click", ".nav-link", function (e) {
        // Prevent default behavior of link //
        e.preventDefault();

        // Remove active class from all links //
        $(".nav-link").removeClass("active");

        // Add active class to clicked link //
        $(this).addClass("active");

        var menuItem = $(this).text();

        // Check if the clicked link is the "Home" link //
        if (menuItem === "Home") {
            $(".content").html(homeContent);
        } else if (menuItem === "Exercise") {
            $(".content").html(exerciseContent);
            // Call function to set up exercise page content //
            setupExerciseContent();
        } else if (menuItem === "Diet") {
            $(".content").html(dietContent);
        } else if (menuItem === "Readings") {
            $(".content").html(readingsContent);
        }
    });

    // Exercise class creation //
    class Exercise {
        constructor(name, setRange, repRange) {
            this.name = name;
            this.setRange = setRange;
            this.repRange = repRange;
        }
    }

    // Function to set up exercise content //
    function setupExerciseContent() {
        var routine = []; // Define routine outside the event listeners to maintain its scope //

        // Add event listener for the "Create" button //
        $("#add-routine-form").on("submit", function (e) {
            // Prevent form submission //
            e.preventDefault();

            // Extract routine name from the form input //
            var routineName = $("#routine-name").val();

            // Prompt the user to input the number of exercises //
            var numExercises = parseInt(prompt("How many exercises do you wish to add?"));

            // Clear routine before adding new exercises //
            routine = [];

            // Loop to input exercises //
            for (var i = 0; i < numExercises; i++) {
                var exerciseName = prompt("Enter the name of exercise " + (i + 1));
                var exerciseSetRange = prompt("Enter the set range for exercise " + (i + 1));
                var exerciseRepRange = prompt("Enter the rep range for exercise " + (i + 1));

                // Create an instance of Exercise class //
                var exercise = new Exercise(exerciseName, exerciseSetRange, exerciseRepRange);

                // Add exercise to the list //
                routine.push(exercise);
            }

            // Display the exercises on the page //
            displayExercises(routine);

            // Enable the save button //
            $("#save-routine").prop("disabled", false);
        });

        // Add event listener for the "Save" button //
        $("#save-routine").on("click", function () {
            // Extract routine name from the form input //
            var routineName = $("#routine-name").val();
            alert("Routine '" + routineName + "' and its contents have been saved.");

            // Create JSON object for the current routine //
            var routineObject = {
                name: routineName,
                exercises: routine
            };

            // Add the current routine to the array of all routines //
            allRoutines.push(routineObject);

            // Convert the array of all routines to JSON string //
            var jsonString = allRoutines.map(routine => JSON.stringify(routine)).join("\n");

            // Create a blob with the JSON string //
            var blob = new Blob([jsonString], { type: "application/json" });

            // Create a link element to download the JSON file //
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "routines.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    // Function to display exercises on the page //
    function displayExercises(routine) {
        var exerciseList = $("#exercise-list");
        // Clear previous list //
        exerciseList.empty();

        // Create and append list items for each exercise //
        var ul = $("<ul>");
        routine.forEach(function (exercise) {
            var li = $("<li>").text(`Exercise: ${exercise.name}, Set Range: ${exercise.setRange}, Rep Range: ${exercise.repRange}`);
            ul.append(li);
        });

        // Append the list to the exerciseList div //
        exerciseList.append(ul);
    }
});
