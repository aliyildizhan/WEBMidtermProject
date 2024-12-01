//Saving courses and students
const courses = [];
const students = [];

//Getting elements
const courseForm = document.getElementById("course-form");
const studentForm = document.getElementById("student-form");
const courseSelect = document.getElementById("course-select");
const courseResultsSelect = document.getElementById("course-results-select");
const resultsTableBody = document.querySelector("#results-table tbody");
const courseDelete = document.getElementById("course-delete-button");
const viewStats = document.getElementById("view-stats-button");

//Adding event listeners
courseForm.addEventListener("submit", addCourse);
studentForm.addEventListener("submit", addStudent);
courseDelete.addEventListener("click", deleteCourse);
courseResultsSelect.addEventListener("change", displayResults);
viewStats.addEventListener("click", viewCourseStatistics);

//Function for adding courses
function addCourse(event) {

    const courseName = document.getElementById("course-name").value;
    const gradingScale = document.getElementById("grading-scale").value;

    event.preventDefault();

    if (courseName && gradingScale) {
        courses.push({ name: courseName, gradingScale });
        updateCourseSelects();
        courseForm.reset();
        alert("Course " + courseName + " added");
        console.log(courses)
    }
}

//Function for updating value of course select forms
function updateCourseSelects() {
    courseSelect.innerHTML = "<option value=''>Select a Course</option>";
    courseResultsSelect.innerHTML = "<option value=''>Select a Course</option>";

    courses.forEach((course, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = course.name;
        courseSelect.appendChild(option);
        courseResultsSelect.appendChild(option.cloneNode(true));
    });
}

//Function for adding student into a course
function addStudent(event) {
    event.preventDefault();

    const courseIndex = courseSelect.value;
    const studentId = document.getElementById("student-id").value;
    const studentName = document.getElementById("student-name").value;
    const studentSurname = document.getElementById("student-surname").value;
    const midtermScore = parseFloat(document.getElementById("midterm-score").value);
    const finalScore = parseFloat(document.getElementById("final-score").value);
    const scale = document.getElementById("grading-scale").value;

    if (courseIndex && studentId && studentName && studentSurname && !isNaN(midtermScore) && !isNaN(finalScore)) {
        const grade = calculateGrade(midtermScore, finalScore);
        const letterGrade = calculateLetterGrade(grade, scale)
        students.push({
            courseIndex: parseInt(courseIndex),
            studentId,
            studentName,
            studentSurname,
            midtermScore,
            finalScore,
            grade,
            letterGrade,
        });
        studentForm.reset();
        alert("Student " + studentName + " " + studentSurname + " added");
        console.log(students)
        if (parseInt(courseResultsSelect.value) == parseInt(courseIndex)) {
            displayResults();
        }
    }
}

//Function for calculating grade
function calculateGrade(midterm, final) {
    return Math.round(midterm * 0.4 + final * 0.6);
}

//Function for calculating letter grade
function calculateLetterGrade(grade, scale) {

    if (scale == "10") {
        if (grade >= 90) {
            return "A";
        }
        if (grade >= 80) {
            return "B";
        }
        if (grade >= 70) {
            return "C";
        }
        if (grade >= 60) {
            return "D";
        }
        else {
            return "F";
        }
    }

    if (scale == "7") {
        if (grade >= 93) {
            return "A";
        }
        if (grade >= 85) {
            return "B";
        }
        if (grade >= 77) {
            return "C";
        }
        if (grade >= 70) {
            return "D";
        }
        else {
            return "F";
        }
    }
}

//Function for displaying table
function displayResults() {
    const courseIndex = parseInt(courseResultsSelect.value);
    resultsTableBody.innerHTML = "";

    if (!isNaN(courseIndex)) {
        students
            .filter(student => student.courseIndex === courseIndex)
            .forEach(student => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${student.studentId}</td>
                    <td>${student.studentName}</td>
                    <td>${student.studentSurname}</td>
                    <td>${student.midtermScore}</td>
                    <td>${student.finalScore}</td>
                    <td>${student.grade}</td>
                    <td>${student.letterGrade}</td>
                    <td><button onclick="updateStudent('${student.studentId}')">Update</button></td>
                    <td><button onclick="deleteStudent('${student.studentId}')">Delete</button></td>
                `;

                resultsTableBody.appendChild(row);
            });
    }
}

//Function for deleting students
function deleteStudent(studentId) {
    const studentIndex = students.findIndex(student => student.studentId == studentId);
    if (studentIndex != -1) {
        const courseIndex = students[studentIndex].courseIndex;
        students.splice(studentIndex, 1);
        alert("Student with ID " + studentId + " removed.");
        if (parseInt(courseResultsSelect.value) == courseIndex) {
            displayResults();
        }
    }
}

//Function for updating students information
function updateStudent(studentId) {
    const student = students.find(s => s.studentId === studentId);
    if (!student) {
        alert("Student not found!");
        return;
    }

    const updatedName = prompt("Enter new name:", student.studentName);
    const updatedSurname = prompt("Enter new surname:", student.studentSurname);
    const updatedMidtermScore = parseFloat(prompt("Enter new midterm score:", student.midtermScore));
    const updatedFinalScore = parseFloat(prompt("Enter new final score:", student.finalScore));

    if (
        updatedName === null ||
        updatedSurname === null ||
        isNaN(updatedMidtermScore) ||
        isNaN(updatedFinalScore)
    ) {
        alert("Update canceled or invalid input!");
        return;
    }

    student.studentName = updatedName;
    student.studentSurname = updatedSurname;
    student.midtermScore = updatedMidtermScore;
    student.finalScore = updatedFinalScore;

    student.grade = calculateGrade(updatedMidtermScore, updatedFinalScore);
    student.letterGrade = calculateLetterGrade(student.grade, courses[student.courseIndex].gradingScale);

    displayResults();

    alert("Student details updated successfully!");
}

//Function for deleting selected course
function deleteCourse() {
    const courseIndex = parseInt(courseResultsSelect.value);

    if (!isNaN(courseIndex)) {
        const courseName = courses[courseIndex].name;

        courses.splice(courseIndex, 1);

        students.forEach(student => {
            if (student.courseIndex === courseIndex) {
                delete student.courseIndex;
            } else if (student.courseIndex > courseIndex) {
                student.courseIndex -= 1;
            }
        });

        if (parseInt(courseResultsSelect.value) === courseIndex) {
            resultsTableBody.innerHTML = "";
        }

        alert("Course " + courseName + " has been deleted.");
    } else {
        alert("Please select a course to delete.");
    }
    updateCourseSelects();
}

//Function for searching student in the course
function searchStudents() {
    const input = document.getElementById("search-input").value.toLowerCase();
    const table = document.getElementById("results-table");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const nameCell = rows[i].getElementsByTagName("td")[1];
        const surnameCell = rows[i].getElementsByTagName("td")[2];
        if (nameCell || surnameCell) {
            const nameText = nameCell.textContent.toLowerCase();
            const surnameText = surnameCell.textContent.toLowerCase();
            rows[i].style.display = nameText.includes(input) || surnameText.includes(input) ? "" : "none";
        }
    }
}

//Function for viewing the statistic of course
function viewCourseStatistics() {
    const courseIndex = parseInt(courseResultsSelect.value);
    const pointScale = document.getElementById("grading-scale").value;
    let numPassed = 0;
    let numFailed = 0;
    let meanScore = 0;

    if (isNaN(courseIndex)) {
        alert("Please select a course to view statistics.");
        return;
    }

    const courseStudents = students.filter(student => student.courseIndex === courseIndex);

    if (courseStudents.length === 0) {
        alert("No students are enrolled in this course.");
        return;
    }

    if (pointScale == 10) {
        numPassed = courseStudents.filter(student => student.grade >= 60).length;
        numFailed = courseStudents.length - numPassed;
        meanScore = courseStudents.reduce((total, student) => total + student.grade, 0) / courseStudents.length;
    }

    if (pointScale == 7) {
        numPassed = courseStudents.filter(student => student.grade >= 70).length;
        numFailed = courseStudents.length - numPassed;
        meanScore = courseStudents.reduce((total, student) => total + student.grade, 0) / courseStudents.length;
    }
    alert(
        "Passed Students: " + numPassed + "\n" +
        "Failed Students: " + numFailed + "\n" +
        "Mean Score: " + meanScore
    )
}

//Function for sorting table by table head
let currentSortDirection = 'asc';
function sortTable(columnIndex) {
    const table = document.getElementById("results-table");
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    let isNumeric = true;

    if (columnIndex === 0 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        isNumeric = true;
    } else {
        isNumeric = false;
    }

    rows.sort((rowA, rowB) => {
        const cellA = rowA.children[columnIndex].textContent.trim();
        const cellB = rowB.children[columnIndex].textContent.trim();

        if (isNumeric) {
            return currentSortDirection === 'asc' ? 
                parseFloat(cellA) - parseFloat(cellB) : 
                parseFloat(cellB) - parseFloat(cellA);
        } else {
            return currentSortDirection === 'asc' ? 
                cellA.localeCompare(cellB) : 
                cellB.localeCompare(cellA);
        }
    });

    const tbody = table.querySelector("tbody");
    rows.forEach(row => tbody.appendChild(row));

    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
}


