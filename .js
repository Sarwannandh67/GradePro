// Function to toggle between calculators
function showCalculator(calculatorId) {
    document.getElementById("calculator1").style.display = "none";
    document.getElementById("calculator2").style.display = "none";
    document.getElementById(calculatorId).style.display = "block";
}

// Generic function to add row for both calculators
function addRow(tableId) {
    const tbody = document.getElementById(tableId);
    const rowCount = tbody.rows.length + 1;
    let row = '';

    if (tableId === 'cgpa-rows') {
        row = `
            <tr>
                <td>${rowCount}.</td>
                <td><input type="number" class="input-field" placeholder="0" min="0" name="credits" required></td>
                <td>
                    <select class="input-field grade-select" name="grade" required>
                        <option value="10">O</option>
                        <option value="9">A+</option>
                        <option value="8">A</option>
                        <option value="7">B+</option>
                        <option value="6">B</option>
                        <option value="5">C</option>
                        <option value="0">Fail</option>
                        <option value="0">Ab</option>
                    </select>
                </td>
                <td><button type="button" class="delete-btn" onclick="deleteRow(this, '${tableId}')">Delete</button></td>
            </tr>`;
    } else if (tableId === 'required-marks-rows') {
        row = `
            <tr>
                <td>${rowCount}.</td>
                <td><input type="number" class="input-field" placeholder="0" min="0" max="60" name="internalMarks" required></td>
                <td>
                    <select class="input-field grade-select" name="targetGrade" required>
                        <option value="10">O</option>
                        <option value="9">A+</option>
                        <option value="8">A</option>
                        <option value="7">B+</option>
                        <option value="6">B</option>
                        <option value="5">C</option>
                        <option value="0">Fail</option>
                    </select>
                </td>
                <td class="required-marks">-</td>
                <td><button type="button" class="delete-btn" onclick="deleteRow(this, '${tableId}')">Delete</button></td>
            </tr>`;
    }
    
    tbody.insertAdjacentHTML("beforeend", row);
}

// Generic function to delete row for both calculators
function deleteRow(button, tableId) {
    const row = button.closest("tr");
    row.remove();
    updateRowNumbers(tableId);
}

// Function to update row numbers after deletion
function updateRowNumbers(tableId) {
    const tbody = document.getElementById(tableId);
    const rows = tbody.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].textContent = (i + 1) + ".";
    }
}

// Calculate CGPA (Calculator 1)
function calculateCGPA() {
    const rows = document.querySelectorAll("#cgpa-rows tr");
    let totalCredits = 0;
    let weightedGrades = 0;

    rows.forEach((row) => {
        const credits = parseFloat(row.cells[1].querySelector("input").value) || 0;
        const grade = parseFloat(row.cells[2].querySelector("select").value) || 0;

        totalCredits += credits;
        weightedGrades += credits * grade;
    });

    const cgpa = totalCredits > 0 ? (weightedGrades / totalCredits).toFixed(2) : 0;
    document.querySelector(".cgpa-value").textContent = cgpa;
}

// Calculate Required Marks (Calculator 2)
function calculateRequiredMarks() {
    const rows = document.querySelectorAll("#required-marks-rows tr");
    
    rows.forEach((row) => {
        const internalMarks = parseInt(row.cells[1].querySelector("input").value) || 0;
        const selectedGrade = row.cells[2].querySelector("select").value;
        const requiredMarksCell = row.cells[3];

        if (internalMarks > 60) {
            requiredMarksCell.textContent = "Invalid Internal Marks";
            return;
        }

        const marksNeeded = calculateMarksNeeded(internalMarks, selectedGrade);
        requiredMarksCell.textContent = marksNeeded;
    });

    calculateOverallGrade();
}

// Calculate marks needed for selected grade
function calculateMarksNeeded(internalMarks, targetGrade) {
    const gradeRanges = {
        '10': { min: 91 },  // O
        '9': { min: 81 },   // A+
        '8': { min: 71 },   // A
        '7': { min: 61 },   // B+
        '6': { min: 56 },   // B
        '5': { min: 50 },   // C
        '0': { min: 0 }     // Fail
    };

    const minTotal = gradeRanges[targetGrade].min;
    const externalNeeded = minTotal - internalMarks;

    if (externalNeeded > 40) {
        return "Not Possible";
    } else if (externalNeeded < 0) {
        return "Already Achieved";
    } else {
        return `Need ${externalNeeded} marks`;
    }
}

// Calculate overall grade based on selected grades
function calculateOverallGrade() {
    const rows = document.querySelectorAll("#required-marks-rows tr");
    let totalGrade = 0;
    let count = 0;

    rows.forEach((row) => {
        const selectedGrade = parseInt(row.cells[2].querySelector("select").value) || 0;
        if (selectedGrade > 0) {
            totalGrade += selectedGrade;
            count++;
        }
    });

    const averageGrade = count > 0 ? (totalGrade / count).toFixed(2) : "-";
    const gradeText = getGradeText(averageGrade);
    document.getElementById("overall-grade").textContent = `${gradeText}`;
}

// Convert numeric grade to letter grade
function getGradeText(averageGrade) {
    const grade = parseFloat(averageGrade);
    if (grade >= 9.5) return 'O';
    if (grade >= 8.5) return 'A+';
    if (grade >= 7.5) return 'A';
    if (grade >= 6.5) return 'B+';
    if (grade >= 5.5) return 'B';
    if (grade >= 5.0) return 'C';
    return 'F';
}
