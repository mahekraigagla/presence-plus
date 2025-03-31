// ...existing code...

function renderAttendanceFeed(students) {
    const container = document.getElementById('attendance-feed');
    container.innerHTML = ''; // Clear existing content

    students.forEach(student => {
        const studentRow = document.createElement('div');
        studentRow.className = 'student-row';

        const name = document.createElement('span');
        name.textContent = student.name;

        const statusButton = document.createElement('button');
        statusButton.textContent = student.isPresent ? 'Mark Absent' : 'Mark Present';
        statusButton.className = student.isPresent ? 'present' : 'absent';
        statusButton.onclick = () => toggleAttendance(student.id, !student.isPresent);

        studentRow.appendChild(name);
        studentRow.appendChild(statusButton);
        container.appendChild(studentRow);
    });
}

async function toggleAttendance(studentId, isPresent) {
    try {
        const response = await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, isPresent }),
        });

        if (response.ok) {
            const updatedStudents = await response.json();
            renderAttendanceFeed(updatedStudents); // Re-render the feed
        } else {
            console.error('Failed to update attendance');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example usage
const students = [
    { id: 1, name: 'John Doe', isPresent: true },
    { id: 2, name: 'Jane Smith', isPresent: false },
];
renderAttendanceFeed(students);
