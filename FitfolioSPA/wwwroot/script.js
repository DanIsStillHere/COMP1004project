$(document).ready(function () {
    // Load files from local storage // 
    var storedRoutines = localStorage.getItem("routines");
    var allRoutines = storedRoutines ? JSON.parse(storedRoutines) : [];
    var storedInitRoutines = localStorage.getItem("initRoutines");
    var initialRoutines = storedInitRoutines ? JSON.parse(storedInitRoutines) : [];
    var storedMeals = localStorage.getItem("meals");
    var meals = storedMeals ? JSON.parse(storedMeals) : [];
    var storedWeights = localStorage.getItem("weights");
    var weights = storedWeights ? JSON.parse(storedWeights) : { startingWeight: 0, currentWeight: 0 };


    // Load dietary goals //
    var storedGoals = localStorage.getItem("goals");
    if (!storedGoals) {
        storedGoals = {
            calories: 0,
            protein: 0,
            fat: 0,
            carbohydrates: 0
        };
    } else {
        storedGoals = JSON.parse(storedGoals);
    }

    // Initialise consistency streak //
    var streak = localStorage.getItem("conStreak");
    streak = streak ? parseInt(streak) : 0;

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
            <p>Below you can create, update, compare, and delete a routine by utilising the buttons. You can also keep track of your consistency by using the streak counter on the right!</p>
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
            <button id="edit-routine">Update</button>
            <button id="compare-routines">Compare</button>
        </div>
        <div class="streak">
                <h3>Consistency Streak:  <span id="streak-counter">${streak}</span></h3>
                <button id="increase-score">Increase</button>
                <button id="reset-score">Reset</button>
        </div>
    `;

    // Diet page content HTML //
    var dietContent = `
        <div class="content">
            <h2>Welcome to the Diet Section!</h2>
            <p>Here you can set your daily calorie and macronutrient goals, log the nutritional information of your favourite meals, and view the progress you have made with your weight!</p>
            <div id="goals">
                <h3>Daily Goals:</h3>
                <label for="calories">Calories:</label>
                <input type="number" id="calories" value="2000">
                <label for="protein">Protein (g):</label>
                <input type="number" id="protein" value="50">
                <label for="fat">Fat (g):</label>
                <input type="number" id="fat" value="70">
                <label for="carbs">Carbohydrates (g):</label>
                <input type="number" id="carbs" value="250">
                <button id="save-goals">Save Goals</button>
            </div>
            <h3>Log Your Meals:</h3>
            <form id="add-meal">
                <label for="meal-name">Meal Name:</label>
                <input type="text" id="meal-name" required>
                <button type="submit" id="search-meal">Search</button>
                <button type="submit" id="create-meal">Create</button>
                <button type ="submit" id="edit-meal">Edit</button>
                <button type ="submit" id="delete-meal">Delete</button>
            </form>
            <ul id="meal-list">
                <!-- Meal list will be displayed here -->
            </ul>
            <h3>Track Your Weight:</h3>
            <label for="starting-weight">Starting Weight (kg):</label>
            <input type="number" id="starting-weight">
            <label for="current-weight">Current Weight (kg):</label>
            <input type="number" id="current-weight">
            <button type="submit" id="save-weights">Save Weights</button>
            <button type="submit" id="display-graph">Display Graph</button>
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
            setupExerciseContent();
        } else if (menuItem === "Diet") {
            $(".content").html(dietContent);
            setupDietContent();
        } else if (menuItem === "Readings") {
            $(".content").html(readingsContent);
        }
    });

    // Exercise class creation //
    class Exercise {
        constructor(name, setRange, repRange, weight) {
            this.name = name;
            this.setRange = setRange;
            this.repRange = repRange;
            this.weight = weight;
        }
    }

    // Meal class creation //
    class Meal {
        constructor(name, calories, protein, fat, carbohydrates) {
            this.name = name;
            this.calories = calories;
            this.protein = protein;
            this.fat = fat;
            this.carbohydrates = carbohydrates;
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
                var exerciseWeight = prompt("Enter the weight for exercise " + (i + 1));

                // Create an instance of Exercise class //
                var exercise = new Exercise(exerciseName, exerciseSetRange, exerciseRepRange, exerciseWeight);

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
                    var exerciseWeight = prompt("Enter the weight for exercise " + (i + 1));
                    var exercise = new Exercise(exerciseName, exerciseSetRange, exerciseRepRange, exerciseWeight);
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

            // Check if routine exists in 'routines' and 'initRoutines' files //
            var existingRoutineIndex = allRoutines.findIndex(routine => routine.name === routineName);
            var initialRoutineIndex = initialRoutines.findIndex(routine => routine.name === routineName);

            if (existingRoutineIndex !== -1 && initialRoutineIndex !== -1) {
                // Routine found //
                var existingRoutine = allRoutines[existingRoutineIndex];
                var initialRoutine = initialRoutines[initialRoutineIndex];
                displayComparisonExercises(initialRoutine.exercises, existingRoutine.exercises);
            } else {
                // Routine not found //
                alert("No routine with the name '" + routineName + "' found.");
            }
        });

        // Add event listener for the 'Increase' button //
        $("#increase-score").on("click", function () {
            streak++;
            $("#streak-counter").text(streak);
            localStorage.setItem("conStreak", streak);
        });

        // Add event listener for the 'Reset' button //
        $("#reset-score").on("click", function () {
            streak = 0;
            $("#streak-counter").text(streak);
            localStorage.setItem("conStreak", streak);
        });

    }

    // Function to setup the diet page content //
    function setupDietContent() {

        // Add event listener for 'Search' meal button //
        $("#search-meal").on("click", function (e) {
            e.preventDefault();
            var mealName = $("#meal-name").val();

            // Check if the meal name exists in the meals array
            var foundMeal = meals.find(meal => meal.name === mealName);
            if (foundMeal) {
                displayMeal(foundMeal);
            } else {
                alert("No meal with the name '" + mealName + "' is saved.");
            }
        });

        // Add event listener for the 'Save Goals' button //
        $("#save-goals").on("click", function () {
            // Extract values from input fields //
            var calories = parseInt($("#calories").val());
            var protein = parseInt($("#protein").val());
            var fat = parseInt($("#fat").val());
            var carbohydrates = parseInt($("#carbs").val());

            // Create goals object //
            var goals = {
                calories: calories,
                protein: protein,
                fat: fat,
                carbohydrates: carbohydrates
            };

            // Save goals to local storage //
            localStorage.setItem("goals", JSON.stringify(goals));

            // Alert user that goals have been saved //
            alert("Daily goals have been saved.");
        });

        // Add event listener for 'Create' meal button //
        $("#add-meal").on("submit", function (e) {
            e.preventDefault();
            var mealName = $("#meal-name").val();

            // Prevent user from using a pre-existing meal's name //
            var existingMeal = meals.find(meal => meal.name === mealName);
            if (existingMeal) {
                alert("A meal with the name '" + mealName + "' already exists. Please choose a different name.");
                return; 
            }

            var calories = parseInt(prompt("Enter the calorie count (kcal) for the meal:"));
            var protein = parseInt(prompt("Enter the protein content (g) for the meal:"));
            var fat = parseInt(prompt("Enter the fat content (g) for the meal:"));
            var carbohydrates = parseInt(prompt("Enter the carbohydrate content (g) for the meal:"));

            var newMeal = new Meal(mealName, calories, protein, fat, carbohydrates);
            displayMeal(newMeal);
            meals.push(newMeal);
            localStorage.setItem("meals", JSON.stringify(meals));
        });

        // Add event listener for 'Edit' meal button //
        $("#edit-meal").on("click", function (e) {
            e.preventDefault();
            var mealName = $("#meal-name").val();

            // Check if the meal name exists in the meals array
            var foundMealIndex = meals.findIndex(meal => meal.name === mealName);
            if (foundMealIndex !== -1) {
                var foundMeal = meals[foundMealIndex];

                // Prompt user to enter new values for each attribute
                var newCalories = parseInt(prompt("Enter the new calorie count (kcal) for the meal:", foundMeal.calories));
                var newProtein = parseInt(prompt("Enter the new protein content (g) for the meal:", foundMeal.protein));
                var newFat = parseInt(prompt("Enter the new fat content (g) for the meal:", foundMeal.fat));
                var newCarbohydrates = parseInt(prompt("Enter the new carbohydrate content (g) for the meal:", foundMeal.carbohydrates));

                // Update meal attributes
                meals[foundMealIndex].calories = newCalories;
                meals[foundMealIndex].protein = newProtein;
                meals[foundMealIndex].fat = newFat;
                meals[foundMealIndex].carbohydrates = newCarbohydrates;

                // Save updated meals to localStorage
                localStorage.setItem("meals", JSON.stringify(meals));
                displayMeal(meals[foundMealIndex]);
                alert("Meal '" + mealName + "' has been updated.");
            } else {
                alert("No meal with the name '" + mealName + "' is saved.");
            }
        });

        // Add event listener for 'Delete' meal button //
        $("#delete-meal").on("click", function (e) {
            e.preventDefault();
            var mealName = $("#meal-name").val();

            // Check if the meal name exists in the meals array
            var foundMealIndex = meals.findIndex(meal => meal.name === mealName);
            if (foundMealIndex !== -1) {
                // Remove the meal from the array
                meals.splice(foundMealIndex, 1);
                // Update localStorage
                localStorage.setItem("meals", JSON.stringify(meals));
                alert("Meal '" + mealName + "' has been deleted.");
            } else {
                alert("No meal with the name '" + mealName + "' is saved.");
            }
        });

        // Set starting weight and current weight input values //
        $("#starting-weight").val(weights.startingWeight);
        $("#current-weight").val(weights.currentWeight);

        // Add event listener for 'Save Weights' button //
        $("#save-weights").on("click", function () {
            // Extract values from input fields //
            var startingWeight = parseInt($("#starting-weight").val());
            var currentWeight = parseInt($("#current-weight").val());

            // Create weights object //
            var weights = {
                startingWeight: startingWeight,
                currentWeight: currentWeight
            };

            // Save weights to local storage //
            localStorage.setItem("weights", JSON.stringify(weights));

            // Alert user that weights have been saved //
            alert("Weights have been saved.");
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
            var li = $("<li>").text(`Exercise: ${exercise.name}, Set Range: ${exercise.setRange}, Rep Range: ${exercise.repRange}, Weight: ${exercise.weight}`);
            ul.append(li);
        });

        // Append the list to the exerciseList div //
        exerciseList.append(ul);
    }

    // Function to display exercises from two routines for comparison //
    function displayComparisonExercises(initRoutine, currentRoutine) {
        var exerciseList = $("#exercise-list");
        // Clear previous list //
        exerciseList.empty();

        // Create and append list items for each exercise from initRoutine //
        var ul1 = $("<ul>");
        $("<h3>").text("Initial Routine:").appendTo(exerciseList);
        initRoutine.forEach(function (exercise) {
            var li = $("<li>").text(`Exercise: ${exercise.name}, Set Range: ${exercise.setRange}, Rep Range: ${exercise.repRange}, Weight: ${exercise.weight}`);
            ul1.append(li);
        });
        exerciseList.append(ul1);

        // Create and append list items for each exercise from currentRoutine //
        var ul2 = $("<ul>");
        $("<h3>").text("Updated Routine:").appendTo(exerciseList);
        currentRoutine.forEach(function (exercise) {
            var li = $("<li>").text(`Exercise: ${exercise.name}, Set Range: ${exercise.setRange}, Rep Range: ${exercise.repRange}, Weight: ${exercise.weight}`);
            ul2.append(li);
        });
        exerciseList.append(ul2);
    }

    // Function to display meal information
    function displayMeal(meal) {
        var mealList = $("#meal-list");

        // Clear previous content //
        mealList.empty();

        // Create a new list item to display the meal information
        var li = $("<li>").html(`
        <strong>Name:</strong> ${meal.name}<br>
        <strong>Calories:</strong> ${meal.calories}kcal<br>
        <strong>Protein:</strong> ${meal.protein}g<br>
        <strong>Fat:</strong> ${meal.fat}g<br>
        <strong>Carbohydrates:</strong> ${meal.carbohydrates}g
    `);

        // Append the list item to the meal list
        mealList.append(li);
    }

});
