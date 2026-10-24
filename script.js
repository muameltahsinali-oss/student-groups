const URL_GET = 'get.php';
const URL_JOIN = 'join.php';
const URL_LEAVE = 'leave.php';

let currentTeamToJoin = null;

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    fetchTeams();
    checkUserStatus();

    // Leave button event
    document.getElementById('leave-btn').addEventListener('click', leaveTeam);
}

function checkUserStatus() {
    const savedName = localStorage.getItem('student_name');
    const savedTeam = localStorage.getItem('student_team');

    const statusContainer = document.getElementById('status-container');
    const welcomeContainer = document.getElementById('welcome-container');
    const teamNameSpan = document.getElementById('user-team-name');
    const joinButtons = document.querySelectorAll('.btn-join');

    if (savedName && savedTeam) {
        // User is already in a team
        statusContainer.classList.remove('hidden');
        welcomeContainer.classList.add('hidden');
        teamNameSpan.textContent = `فريق ${savedTeam}`;

        // Disable all join buttons
        joinButtons.forEach(btn => {
            btn.disabled = true;
            btn.textContent = 'أنت منضم بالفعل';
        });
    } else {
        // User not in a team
        statusContainer.classList.add('hidden');
        welcomeContainer.classList.remove('hidden');

        // Enable all join buttons
        joinButtons.forEach(btn => {
            btn.disabled = false;
            btn.textContent = 'انضم للفريق';
        });
    }
}

async function fetchTeams() {
    try {
        const response = await fetch(URL_GET);
        const data = await response.json();
        
        for (const [teamName, members] of Object.entries(data)) {
            const listEl = document.getElementById(`list-${teamName}`);
            if (listEl) {
                listEl.innerHTML = ''; // Clear current list
                if (members.length === 0) {
                    listEl.innerHTML = '<li class="empty-state">لا توجد أعضاء بعد</li>';
                } else {
                    members.forEach(member => {
                        const li = document.createElement('li');
                        li.textContent = member;
                        listEl.appendChild(li);
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
}

function joinTeam(teamName) {
    // Cannot open modal if already in a team
    if (localStorage.getItem('student_team')) return;

    currentTeamToJoin = teamName;
    document.getElementById('modal-team-name').textContent = `الانضمام إلى فريق ${teamName}`;
    document.getElementById('student-name').value = '';
    document.getElementById('join-modal').classList.remove('hidden');
    document.getElementById('student-name').focus();
}

function closeModal() {
    document.getElementById('join-modal').classList.add('hidden');
    currentTeamToJoin = null;
}

async function confirmJoin() {
    const studentName = document.getElementById('student-name').value.trim();
    
    if (!studentName) {
        alert('الرجاء إدخال اسمك.');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('name', studentName);
        formData.append('team', currentTeamToJoin);

        const response = await fetch(URL_JOIN, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('student_name', studentName);
            localStorage.setItem('student_team', currentTeamToJoin);
            closeModal();
            fetchTeams();
            checkUserStatus();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error joining team:', error);
        alert('حدث خطأ أثناء الانضمام.');
    }
}

async function leaveTeam() {
    const studentName = localStorage.getItem('student_name');
    
    if (!studentName) return;

    if (!confirm('هل أنت متأكد أنك تريد مغادرة الفريق؟')) {
        return;
    }

    try {
        const formData = new FormData();
        formData.append('name', studentName);

        const response = await fetch(URL_LEAVE, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            localStorage.removeItem('student_name');
            localStorage.removeItem('student_team');
            fetchTeams();
            checkUserStatus();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error leaving team:', error);
        alert('حدث خطأ أثناء المغادرة.');
    }
}

// Allow Enter key to submit
document.getElementById('student-name').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        confirmJoin();
    }
});
