$(document).ready(function () {
    // Load routines from local storage if available
    var storedRoutines = localStorage.getItem("routines");
    var allRoutines = storedRoutines ? JSON.parse(storedRoutines) : [];
    var storedInitRoutines = localStorage.getItem("initRoutines");
    var initialRoutines = storedInitRoutines ? JSON.parse(storedInitRoutines) : [];

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
                <button type="button" id="search-routine">Search</button>
                <button type="button" id="create-routine">Create</button>
            </form>
            <div id="exercise-list">
                <!-- Exercise list will be displayed here -->
            </div>
            <button id="save-routine">Save</button>
            <button id="delete-routine">Delete</button>
            <button id="edit-routine">Edit</button>
            <button id="compare-routines">Compare</button>
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
        $("#create-routine").on("click", function (e) {
            // Prevent form submission //
            e.preventDefault();

            // Extract routine name from the form input //
            var routineName = $("#routine-name").val();

            // Clear routine before adding new exercises //
            routine = [];

            // Prompt the user to input the number of exercises //
            var numExercises = parseInt(prompt("How many exercises do you wish to add?"));

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

        // Add event listener for the "Search" button //
        $("#search-routine").on("click", function (e) {
            // Prevent form submission //
            e.preventDefault();

            // Extract routine name from the form input //
            var routineName = $("#routine-name").val();

            // Search for the routine in the stored routines //
            var foundRoutine = allRoutines.find(routine => routine.name === routineName);

            if (foundRoutine) {
                // Display the exercises of the found routine //
                displayExercises(foundRoutine.exercises);
            } else {
                // Alert the user if the routine couldn't be found //
                alert("Routine '" + routineName + "' not found.");
            }
        });

        // Add event listener for the "Save" button //
        $("#save-routine").on("click", function () {
            // Extract routine name from the form input //
            var routineName = $("#routine-name").val();

            // Check if a routine with the same name already exists //
            var existingRoutine = allRoutines.find(routine => routine.name === routineName);

            if (existingRoutine) {
                // Alert the user if a routine with the same name already exists //
                alert("A routine with the name '" + routineName + "' already exists. Please choose a different name.");
            } else {
                // Proceed to save the routine //

                // Create JSON object for the current routine //
                var routineObject = {
                    name: routineName,
                    exercises: routine
                };

                // Add the current routine to the arrays for all and initial routines //
                allRoutines.push(routineObject);
                initialRoutines.push(routineObject);

                // Save the updated routines to local storage //
                localStorage.setItem("routines", JSON.stringify(allRoutines));
                localStorage.setItem("initRoutines", JSON.stringify(initialRoutines));

                // Alert the user that the routine has been saved //
                alert("Routine '" + routineName + "' and its contents have been saved.");
            }
        });

        // Add event listener for the "Delete" button //
        $("#delete-routine").on("click", function () {
            // Extract routine name from the form input //
            var routineName = $("#routine-name").val();

            // Search for the routine in the 'routines' and 'initRoutines' files //
            var foundIndex = allRoutines.findIndex(routine => routine.name === routineName);
            var initFoundIndex = initialRoutines.findIndex(routine => routine.name === routineName);

            if (foundIndex !== -1 && initFoundIndex !== -1) {
                // Ask the user if they want to delete the routine //
                var confirmDelete = confirm("Are you sure you want to delete the routine '" + routineName + "'?");

                if (confirmDelete) {
                    // Delete the routine //
                    allRoutines.splice(foundIndex, 1);
                    initialRoutines.splice(initFoundIndex, 1);

                    // Save the updated routines to local storage //
                    localStorage.setItem("routines", JSON.stringify(allRoutines));
                    localStorage.setItem("initRoutines", JSON.stringify(initialRoutines));

                    // Alert the user that the routine has been deleted //
                    alert("Routine '" + routineName + "' has been deleted.");
                }
            } else {
                // Alert the user if no routine with that name is found //
                alert("No routine with the name '" + routineName + "' is saved.");
            }
        });

        // Add event listener for the "Edit" button //
        $("#edit-routine").on("click", function () {
            // Extract routine name from the form input //
            var routineName = $("#routine-name").val();

            // Check if the routine exists in 'routines' file //
            var existingRoutineIndex = allRoutines.findIndex(routine => routine.name === routineName);
            if (existingRoutineIndex !== -1) {
                // Routine found, prompt user to update information //
                var updatedRoutine = [];
                var numExercises = parseInt(prompt("How many exercises do you wish to update?"));
                for (var i = 0; i < numExercises; i++) {
                    var exerciseName = prompt("Enter the name of exercise " + (i + 1));
                    var exerciseSetRange = prompt("Enter the set range for exercise " + (i + 1));
                    var exerciseRepRange = prompt("Enter the rep range for exercise " + (i + 1));
                    var exercise = new Exercise(exerciseName, exerciseSetRange, exerciseRepRange);
                    updatedRoutine.push(exercise);
                }

                // Update routine in 'routines' file //
                allRoutines[existingRoutineIndex].exercises = updatedRoutine;

                // Display updated exercises on the page //
                displayExercises(updatedRoutine);

                // Save updated routines to local storage //
                localStorage.setItem("routines", JSON.stringify(allRoutines));
            } else {
                // Routine not found //
                alert("No routine with the name '" + routineName + "' found.");
            }
        });

        // Add event listener for the 'Compare' button //
        $("#compare-routines").on("click", function () {
            // Extract routine name from the form input //
            var routineName = $("#routine-name").val();

            // Check if routine exists in 'routines' file //
            var existingRoutineIndex = allRoutines.findIndex(routine => routine.name === routineName);
            if (existingRoutineIndex !== -1) {
                // Routine found in 'routines' file //
                var existingRoutine = allRoutines[existingRoutineIndex];
                displayExercises(existingRoutine.exercises);
            } else {
                // Check if routine exists in 'initialRoutines' file //
                var initialRoutineIndex = initialRoutines.findIndex(routine => routine.name === routineName);
                if (initialRoutineIndex !== -1) {
                    // Routine found in 'initialRoutines' file //
                    var initialRoutine = initialRoutines[initialRoutineIndex];
                    displayExercises(initialRoutine.exercises);
                } else {
                    // Routine not found //
                    alert("No routine with the name '" + routineName + "' found.");
                }
            }
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
