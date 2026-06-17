// ========================================================
// THE ATTENDANCE MANAGEMENT SYSTEM DATA CONTROLLER
// ========================================================
const AttendanceSystem = {
    STORAGE_KEY: "attendance_roster_vault",
    roster: [],

    // 1. App Startup Core Loader Routine Initialization Loop
    init() {
        // Hydrate the array dataset structures with cached files or load default mock values
        this.roster = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [
            { id: "att_1", name: "Bruce Banner", status: "Present" },
            { id: "att_2", name: "Tony Stark", status: "Late" },
            { id: "att_3", name: "Natasha Romanoff", status: "Absent" }
        ];

        this.syncSystemState();
    },

    // 2. Add New Individual Entry Item into Matrix
    addIndividual(name) {
        const newPerson = {
            id: "att_" + Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            status: "Present" // Baseline default fallback tracking value state parameter
        };

        this.roster.push(newPerson);
        this.syncSystemState();
    },

    // 3. Mutate Active Roll Call Status Value parameters
    updateStatus(id, newStatus) {
        const individual = this.roster.find(person => person.id === id);
        if (individual) {
            individual.status = newStatus;
            this.syncSystemState();
        }
    },

    // 4. Purge Selected Row from Roll Register Logs
    purgeIndividual(id) {
        this.vault = this.roster = this.roster.filter(person => person.id !== id);
        this.syncSystemState();
    },

    syncSystemState() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.roster));
        this.calculateMetrics();
        this.renderLedgerUI();
    },

    // 5. System Analytics Engine Calculations
    calculateMetrics() {
        const total = this.roster.length;
        const present = this.roster.filter(p => p.status === "Present").length;
        const absent = this.roster.filter(p => p.status === "Absent").length;
        const late = this.roster.filter(p => p.status === "Late").length;

        // Attendance rate treats "Present" and "Late" as physically present on premises
        const presentCountFactor = present + late;
        const ratePercentage = total > 0 ? Math.round((presentCountFactor / total) * 100) : 0;

        // Push evaluations out to map metrics card panel view text items
        document.getElementById('totalCount').textContent = total;
        document.getElementById('presentCount').textContent = present;
        document.getElementById('absentCount').textContent = absent;
        document.getElementById('rateCount').textContent = `${ratePercentage}%`;
    },

    // 6. Dynamic Attendance Roster Table Layout Rendering
    renderLedgerUI() {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = ""; // Wipe active workspace clean for drawing cycle reflows

        if (this.roster.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#64748b; padding:20px;">No registered names currently assigned inside attendance ledger.</td></tr>`;
            return;
        }

        this.roster.forEach(person => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td><strong>${person.name}</strong></td>
                <td>
                    <div class="status-btn-group">
                        <button class="status-btn ${person.status === 'Present' ? 'active' : ''}" data-id="${person.id}" data-status="Present">Present</button>
                        <button class="status-btn ${person.status === 'Absent' ? 'active' : ''}" data-id="${person.id}" data-status="Absent">Absent</button>
                        <button class="status-btn ${person.status === 'Late' ? 'active' : ''}" data-id="${person.id}" data-status="Late">Late</button>
                    </div>
                </td>
                <td><button class="btn-delete purge-btn" data-id="${person.id}">Delete</button></td>
            `;

            tbody.appendChild(tr);
        });
    }
};

// ========================================================
// CONTROLLER EVENT HANDLING INTERFACE LOGIC
// ========================================================

// Handle Registration Input Form Processing Submissions
document.getElementById('attendanceForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.getElementById('personName');

    AttendanceSystem.addIndividual(nameInput.value);
    nameInput.value = ""; // Clear active input workspace field
});

// Event Delegation capture block matches status buttons and delete adjustments
document.getElementById('tableBody').addEventListener('click', (event) => {
    const target = event.target;
    const selectedId = target.getAttribute('data-id');

    if (!selectedId) return;

    if (target.classList.contains('status-btn')) {
        const statusValue = target.getAttribute('data-status');
        AttendanceSystem.updateStatus(selectedId, statusValue);
    } else if (target.classList.contains('purge-btn')) {
        if (confirm("Are you sure you want to permanently remove this individual from roll register tracking logs?")) {
            AttendanceSystem.purgeIndividual(selectedId);
        }
    }
});

// Launch structural core boot loop systems when layout parsing finishes safely
document.addEventListener('DOMContentLoaded', () => {
    AttendanceSystem.init();
});