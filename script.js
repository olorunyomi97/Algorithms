// DOM Elements
const providerCards = document.querySelectorAll('.provider-card');
const dayCells = document.querySelectorAll('.day-cell.available');
const timeSlots = document.querySelectorAll('.time-slot');
const patientSelect = document.querySelector('.session-controls .form-select');
const durationSelect = document.querySelector('.session-controls .form-select:last-child');
const monthSelect = document.querySelector('.month-select');
const yearSelect = document.querySelector('.year-select');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const bookSessionBtn = document.querySelector('.btn-primary');
const saveDraftBtn = document.querySelector('.btn-secondary');

// State management
let bookingState = {
    selectedProvider: {
        name: 'Jaydon Workman',
        specialty: 'Psychiatrist',
        avatar: 'JW'
    },
    selectedDate: '27',
    selectedMonth: 'July',
    selectedYear: '2025',
    selectedTime: '9:00 AM',
    selectedPatient: 'Andrew Scone',
    selectedDuration: '60 minutes',
    practiceLocation: 'AOA Clinic'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateBookingSummary();
});

function initializeEventListeners() {
    // Provider selection
    providerCards.forEach(card => {
        card.addEventListener('click', function() {
            selectProvider(this);
        });
    });

    // Calendar day selection
    dayCells.forEach(cell => {
        cell.addEventListener('click', function() {
            selectDate(this);
        });
    });

    // Time slot selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            selectTimeSlot(this);
        });
    });

    // Form controls
    if (patientSelect) {
        patientSelect.addEventListener('change', function() {
            bookingState.selectedPatient = this.value;
            updateBookingSummary();
        });
    }

    if (durationSelect) {
        durationSelect.addEventListener('change', function() {
            bookingState.selectedDuration = this.value;
            updateBookingSummary();
        });
    }

    // Calendar navigation
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', navigateToPreviousMonth);
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', navigateToNextMonth);
    }

    if (monthSelect) {
        monthSelect.addEventListener('change', function() {
            bookingState.selectedMonth = this.value;
            updateBookingSummary();
        });
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', function() {
            bookingState.selectedYear = this.value;
            updateBookingSummary();
        });
    }

    // Action buttons
    if (bookSessionBtn) {
        bookSessionBtn.addEventListener('click', handleBookSession);
    }

    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', handleSaveDraft);
    }

    // Provider search
    const providerSearch = document.querySelector('.form-input');
    if (providerSearch) {
        providerSearch.addEventListener('input', function() {
            filterProviders(this.value);
        });
    }

    // Specialty filter
    const specialtyFilter = document.querySelector('.form-select');
    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', function() {
            filterProvidersBySpecialty(this.value);
        });
    }
}

function selectProvider(providerCard) {
    // Remove active class from all provider cards
    providerCards.forEach(card => card.classList.remove('active'));
    
    // Add active class to selected card
    providerCard.classList.add('active');
    
    // Update booking state
    const providerName = providerCard.querySelector('h4').textContent;
    const providerSpecialty = providerCard.querySelector('.provider-specialty').textContent;
    const providerAvatar = providerCard.querySelector('.provider-avatar').textContent;
    
    bookingState.selectedProvider = {
        name: providerName,
        specialty: providerSpecialty,
        avatar: providerAvatar
    };
    
    updateBookingSummary();
    
    // Add visual feedback
    providerCard.style.transform = 'scale(0.98)';
    setTimeout(() => {
        providerCard.style.transform = 'scale(1)';
    }, 100);
}

function selectDate(dateCell) {
    // Remove selected class from all date cells
    dayCells.forEach(cell => cell.classList.remove('selected'));
    
    // Add selected class to clicked cell
    dateCell.classList.add('selected');
    
    // Update booking state
    bookingState.selectedDate = dateCell.dataset.date;
    
    updateBookingSummary();
}

function selectTimeSlot(timeSlot) {
    // Remove active class from all time slots
    timeSlots.forEach(slot => slot.classList.remove('active'));
    
    // Add active class to selected slot
    timeSlot.classList.add('active');
    
    // Update booking state
    bookingState.selectedTime = timeSlot.textContent;
    
    updateBookingSummary();
}

function updateBookingSummary() {
    // Update patient
    const patientElement = document.querySelector('.summary-section:nth-child(1) p');
    if (patientElement) {
        patientElement.textContent = bookingState.selectedPatient || 'Select patient';
    }
    
    // Update provider
    const providerElement = document.querySelector('.summary-section:nth-child(2) p');
    if (providerElement) {
        providerElement.textContent = `Dr ${bookingState.selectedProvider.name.split(' ')[1] || bookingState.selectedProvider.name}`;
    }
    
    // Update date
    const dateElement = document.querySelector('.summary-section:nth-child(3) p');
    if (dateElement) {
        const date = formatDate(bookingState.selectedDate, bookingState.selectedMonth, bookingState.selectedYear);
        dateElement.textContent = date;
    }
    
    // Update time
    const timeElement = document.querySelector('.summary-section:nth-child(4) p');
    if (timeElement) {
        const endTime = calculateEndTime(bookingState.selectedTime, bookingState.selectedDuration);
        timeElement.textContent = `${bookingState.selectedTime} - ${endTime}`;
    }
    
    // Update practice location
    const locationElement = document.querySelector('.summary-section:nth-child(5) p');
    if (locationElement) {
        locationElement.textContent = bookingState.practiceLocation;
    }
}

function formatDate(day, month, year) {
    const monthNames = {
        'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr',
        'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug',
        'September': 'Sep', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
    };
    
    const dayOfWeek = new Date(year, Object.keys(monthNames).indexOf(month), day).toLocaleDateString('en-US', { weekday: 'short' });
    const ordinalDay = getOrdinalNumber(day);
    
    return `${dayOfWeek}, ${ordinalDay} ${monthNames[month]}, ${year}`;
}

function getOrdinalNumber(day) {
    const dayNum = parseInt(day);
    const suffix = ['th', 'st', 'nd', 'rd'];
    const remainder = dayNum % 100;
    
    if (remainder >= 11 && remainder <= 13) {
        return dayNum + 'th';
    }
    
    return dayNum + (suffix[dayNum % 10] || suffix[0]);
}

function calculateEndTime(startTime, duration) {
    const [time, period] = startTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const durationMinutes = parseInt(duration) || 60;
    
    let totalMinutes = hours * 60 + minutes;
    if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
    if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60;
    
    totalMinutes += durationMinutes;
    
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMins = totalMinutes % 60;
    
    const endPeriod = endHours >= 12 ? 'PM' : 'AM';
    const displayHours = endHours === 0 ? 12 : endHours > 12 ? endHours - 12 : endHours;
    
    return `${displayHours}:${endMins.toString().padStart(2, '0')}${endPeriod.toLowerCase()}`;
}

function navigateToPreviousMonth() {
    const currentMonth = monthSelect.value;
    const currentYear = parseInt(yearSelect.value);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    let monthIndex = months.indexOf(currentMonth);
    let year = currentYear;
    
    if (monthIndex === 0) {
        monthIndex = 11;
        year--;
    } else {
        monthIndex--;
    }
    
    monthSelect.value = months[monthIndex];
    yearSelect.value = year;
    
    bookingState.selectedMonth = months[monthIndex];
    bookingState.selectedYear = year;
    
    updateBookingSummary();
}

function navigateToNextMonth() {
    const currentMonth = monthSelect.value;
    const currentYear = parseInt(yearSelect.value);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    let monthIndex = months.indexOf(currentMonth);
    let year = currentYear;
    
    if (monthIndex === 11) {
        monthIndex = 0;
        year++;
    } else {
        monthIndex++;
    }
    
    monthSelect.value = months[monthIndex];
    yearSelect.value = year;
    
    bookingState.selectedMonth = months[monthIndex];
    bookingState.selectedYear = year;
    
    updateBookingSummary();
}

function filterProviders(searchTerm) {
    const providers = document.querySelectorAll('.provider-card');
    const term = searchTerm.toLowerCase();
    
    providers.forEach(provider => {
        const providerName = provider.querySelector('h4').textContent.toLowerCase();
        const providerSpecialty = provider.querySelector('.provider-specialty').textContent.toLowerCase();
        const providerEmail = provider.querySelector('.provider-email').textContent.toLowerCase();
        
        if (providerName.includes(term) || providerSpecialty.includes(term) || providerEmail.includes(term)) {
            provider.style.display = 'flex';
        } else {
            provider.style.display = 'none';
        }
    });
}

function filterProvidersBySpecialty(specialty) {
    const providers = document.querySelectorAll('.provider-card');
    
    providers.forEach(provider => {
        const providerSpecialty = provider.querySelector('.provider-specialty').textContent;
        
        if (specialty === 'Psychiatrist' || providerSpecialty === specialty) {
            provider.style.display = 'flex';
        } else {
            provider.style.display = 'none';
        }
    });
}

function handleBookSession() {
    // Validate required fields
    if (!bookingState.selectedPatient || bookingState.selectedPatient === 'Select patient') {
        alert('Please select a patient');
        return;
    }
    
    if (!bookingState.selectedDuration || bookingState.selectedDuration === 'Select duration') {
        alert('Please select a session duration');
        return;
    }
    
    // Simulate booking process
    bookSessionBtn.textContent = '⏳ Booking...';
    bookSessionBtn.disabled = true;
    
    setTimeout(() => {
        alert('🎉 Session booked successfully!');
        bookSessionBtn.textContent = '📅 Book Session';
        bookSessionBtn.disabled = false;
        
        // Reset form or redirect to confirmation page
        resetBookingForm();
    }, 2000);
}

function handleSaveDraft() {
    // Save booking state to localStorage
    localStorage.setItem('bookingDraft', JSON.stringify(bookingState));
    
    // Visual feedback
    const originalText = saveDraftBtn.textContent;
    saveDraftBtn.textContent = '✅ Saved';
    
    setTimeout(() => {
        saveDraftBtn.textContent = originalText;
    }, 2000);
}

function resetBookingForm() {
    // Reset to default state
    bookingState = {
        selectedProvider: {
            name: 'Jaydon Workman',
            specialty: 'Psychiatrist',
            avatar: 'JW'
        },
        selectedDate: '27',
        selectedMonth: 'July',
        selectedYear: '2025',
        selectedTime: '9:00 AM',
        selectedPatient: 'Select patient',
        selectedDuration: 'Select duration',
        practiceLocation: 'AOA Clinic'
    };
    
    // Reset form controls
    if (patientSelect) patientSelect.value = 'Select patient';
    if (durationSelect) durationSelect.value = 'Select duration';
    
    // Reset active states
    providerCards.forEach(card => card.classList.remove('active'));
    providerCards[0].classList.add('active');
    
    timeSlots.forEach(slot => slot.classList.remove('active'));
    timeSlots[2].classList.add('active');
    
    updateBookingSummary();
}

// Load saved draft on page load
function loadSavedDraft() {
    const savedDraft = localStorage.getItem('bookingDraft');
    if (savedDraft) {
        bookingState = JSON.parse(savedDraft);
        updateBookingSummary();
    }
}

// Add smooth scrolling for mobile
function addSmoothScrolling() {
    const sections = document.querySelectorAll('.panel-section');
    sections.forEach(section => {
        section.addEventListener('click', function() {
            this.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    loadSavedDraft();
    addSmoothScrolling();
});

// Handle form validation
function validateForm() {
    const requiredFields = [
        { field: bookingState.selectedPatient, name: 'Patient', condition: val => val && val !== 'Select patient' },
        { field: bookingState.selectedDuration, name: 'Session Duration', condition: val => val && val !== 'Select duration' },
        { field: bookingState.selectedProvider.name, name: 'Provider', condition: val => val && val.length > 0 },
        { field: bookingState.selectedDate, name: 'Date', condition: val => val && val.length > 0 },
        { field: bookingState.selectedTime, name: 'Time', condition: val => val && val.length > 0 }
    ];
    
    const errors = [];
    
    requiredFields.forEach(({ field, name, condition }) => {
        if (!condition(field)) {
            errors.push(name);
        }
    });
    
    return errors;
}

// Add keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('provider-card')) {
            selectProvider(activeElement);
        } else if (activeElement.classList.contains('day-cell')) {
            selectDate(activeElement);
        } else if (activeElement.classList.contains('time-slot')) {
            selectTimeSlot(activeElement);
        }
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        calculateEndTime,
        getOrdinalNumber,
        validateForm
    };
}