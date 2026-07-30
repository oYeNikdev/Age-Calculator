 (function() {
            'use strict';

            // ─── DOM refs ────────────────────────────────────────────────
            const dayInput = document.getElementById('day');
            const monthInput = document.getElementById('month');
            const yearInput = document.getElementById('year');
            const calculateBtn = document.getElementById('calculateBtn');
            const clearBtn = document.getElementById('clearBtn');

            const placeholder = document.getElementById('placeholder');
            const ageDisplay = document.getElementById('ageDisplay');
            const ageMain = document.getElementById('ageMain');
            const detailMonths = document.getElementById('detailMonths');
            const detailDays = document.getElementById('detailDays');
            const birthdayBadgeContainer = document.getElementById('birthdayBadgeContainer');
            const errorContainer = document.getElementById('errorContainer');

            // ─── Helpers ────────────────────────────────────────────────

            /** Validate a date (year, month, day) */
            function isValidDate(y, m, d) {
                // Basic range checks
                if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return false;
                if (y < 1900 || y > 2099) return false;
                if (m < 1 || m > 12) return false;
                if (d < 1 || d > 31) return false;

                // Use JS Date to validate day-in-month
                const date = new Date(y, m - 1, d);
                return (
                    date.getFullYear() === y &&
                    date.getMonth() === m - 1 &&
                    date.getDate() === d
                );
            }

            /** Calculate age in years, months, days from birth date to today */
            function calculateAge(birthDate) {
                const today = new Date();
                // Zero out time for accurate day diff
                const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const birthClean = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

                let years = todayClean.getFullYear() - birthClean.getFullYear();
                let months = todayClean.getMonth() - birthClean.getMonth();
                let days = todayClean.getDate() - birthClean.getDate();

                // Adjust if days negative
                if (days < 0) {
                    // Days in previous month
                    const prevMonth = new Date(todayClean.getFullYear(), todayClean.getMonth(), 0);
                    const daysInPrevMonth = prevMonth.getDate();
                    days += daysInPrevMonth;
                    months -= 1;
                }

                // Adjust if months negative
                if (months < 0) {
                    months += 12;
                    years -= 1;
                }

                // If age is negative (birth date in future), return null
                if (years < 0) return null;
                if (years === 0 && months === 0 && days === 0) {
                    // Born today
                    return { years: 0, months: 0, days: 0 };
                }

                return { years, months, days };
            }

            /** Check if today is the birthday */
            function isBirthdayToday(birthDate) {
                const today = new Date();
                return (
                    today.getMonth() === birthDate.getMonth() &&
                    today.getDate() === birthDate.getDate()
                );
            }

            /** Format a number with leading zero if needed */
            function pad(n) {
                return String(n).padStart(2, '0');
            }

            /** Clear error messages and badges */
            function clearMessages() {
                errorContainer.innerHTML = '';
                birthdayBadgeContainer.innerHTML = '';
            }

            /** Show error message */
            function showError(msg) {
                errorContainer.innerHTML = `<div class="error-msg">⚠️ ${msg}</div>`;
                birthdayBadgeContainer.innerHTML = '';
            }

            /** Show birthday badge */
            function showBirthdayBadge() {
                birthdayBadgeContainer.innerHTML = `<div class="birthday-badge">🎉 Happy Birthday! 🎉</div>`;
            }

            /** Display the age result */
            function displayAge(age, birthDate) {
                // Main
                const yearWord = age.years === 1 ? 'year' : 'years';
                ageMain.innerHTML = `${age.years} <span>${yearWord}</span>`;

                // Detail
                detailMonths.textContent = age.months;
                detailDays.textContent = age.days;

                // Show display, hide placeholder
                placeholder.style.display = 'none';
                ageDisplay.classList.add('show');
                ageDisplay.style.display = 'block';

                // Birthday badge
                if (isBirthdayToday(birthDate) && age.years > 0) {
                    showBirthdayBadge();
                } else {
                    birthdayBadgeContainer.innerHTML = '';
                }

                clearMessages();
            }

            /** Reset the UI to placeholder state */
            function resetToPlaceholder() {
                placeholder.style.display = 'block';
                ageDisplay.classList.remove('show');
                ageDisplay.style.display = 'none';
                clearMessages();
                errorContainer.innerHTML = '';
                birthdayBadgeContainer.innerHTML = '';
            }

            /** Main calculation logic */
            function performCalculation() {
                // Read values
                const dayVal = parseInt(dayInput.value.trim(), 10);
                const monthVal = parseInt(monthInput.value.trim(), 10);
                const yearVal = parseInt(yearInput.value.trim(), 10);

                // Validate inputs are numbers
                if (isNaN(dayVal) || isNaN(monthVal) || isNaN(yearVal)) {
                    showError('Please enter a valid day, month, and year.');
                    placeholder.style.display = 'none';
                    ageDisplay.classList.remove('show');
                    ageDisplay.style.display = 'none';
                    birthdayBadgeContainer.innerHTML = '';
                    return;
                }

                // Validate date
                if (!isValidDate(yearVal, monthVal, dayVal)) {
                    showError('Invalid date. Please check your day, month, and year.');
                    placeholder.style.display = 'none';
                    ageDisplay.classList.remove('show');
                    ageDisplay.style.display = 'none';
                    birthdayBadgeContainer.innerHTML = '';
                    return;
                }

                const birthDate = new Date(yearVal, monthVal - 1, dayVal);
                const age = calculateAge(birthDate);

                if (age === null) {
                    showError('Birth date cannot be in the future. Please enter a valid past date.');
                    placeholder.style.display = 'none';
                    ageDisplay.classList.remove('show');
                    ageDisplay.style.display = 'none';
                    birthdayBadgeContainer.innerHTML = '';
                    return;
                }

                // All good – display result
                displayAge(age, birthDate);
            }

            /** Clear all inputs and reset UI */
            function clearAll() {
                dayInput.value = '';
                monthInput.value = '';
                yearInput.value = '';
                resetToPlaceholder();
                // Also remove any error
                errorContainer.innerHTML = '';
                birthdayBadgeContainer.innerHTML = '';
                // Ensure placeholder is visible
                placeholder.style.display = 'block';
                ageDisplay.classList.remove('show');
                ageDisplay.style.display = 'none';
                // Focus first input
                dayInput.focus();
            }

            // ─── Event Listeners ───────────────────────────────────────

            calculateBtn.addEventListener('click', performCalculation);

            clearBtn.addEventListener('click', clearAll);

            // Enter key support: trigger calculation on Enter in any input
            [dayInput, monthInput, yearInput].forEach(input => {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        performCalculation();
                    }
                });

                // Auto-advance on max length (optional UX)
                input.addEventListener('input', function() {
                    const maxLen = parseInt(this.getAttribute('maxlength'), 10);
                    if (maxLen && this.value.length >= maxLen) {
                        const next =
                            this.id === 'day' ? monthInput :
                            this.id === 'month' ? yearInput :
                            null;
                        if (next) next.focus();
                    }
                });
            });

            // Set maxlength attributes for better UX
            dayInput.setAttribute('maxlength', '2');
            monthInput.setAttribute('maxlength', '2');
            yearInput.setAttribute('maxlength', '4');

            // ─── Init ──────────────────────────────────────────────────

            // Start with placeholder visible, age hidden
            resetToPlaceholder();

            // Optional: Pre-fill with today's date for testing? No – keep empty.
            // But we set placeholder text.

            console.log('🎂 Age Calculator ready!');
        })();