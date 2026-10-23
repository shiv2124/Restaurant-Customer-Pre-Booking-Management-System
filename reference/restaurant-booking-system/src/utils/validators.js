// Validation rules for every form in the app.
//
// Each field validator returns an error message, or '' when the value is
// fine. Each form validator returns an object of errors keyed by field
// name; a field with no problem has no key. `useForm` plugs these straight in.

import {
  MAX_PARTY_SIZE,
  OCCASIONS,
  TOTAL_TABLES,
  DINING_DURATION_MINUTES,
} from '../constants/options';
import {
  currentMinutes,
  generateTimeSlots,
  isValidISODate,
  timeToMinutes,
  todayISO,
} from './date';

export const SPECIAL_REQUESTS_MAX = 300;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 64;

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const NAME_REGEX = /^\p{L}[\p{L}\s.'-]*$/u;
const PHONE_CHARS_REGEX = /^[+\d\s-]+$/;
// Indian mobile number, optionally prefixed with +91, 91 or 0.
const INDIAN_MOBILE_REGEX = /^(\+91|91|0)?[6-9]\d{9}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Drop the empty strings so `Object.keys(errors).length === 0` means "valid". */
const compact = (errors) =>
  Object.fromEntries(Object.entries(errors).filter(([, message]) => message));

/* ------------------------------------------------------------------ */
/* Single-field validators                                             */
/* ------------------------------------------------------------------ */

export function validateName(value, label = 'Full name') {
  const name = (value ?? '').trim();
  if (!name) return `Enter your ${label.toLowerCase()}.`;
  if (name.length < 2) return `${label} must be at least 2 characters.`;
  if (name.length > 50) return `${label} must be 50 characters or fewer.`;
  if (!NAME_REGEX.test(name)) {
    return `${label} can only contain letters, spaces, apostrophes, dots and hyphens.`;
  }
  return '';
}

/** The email address is the user's login ID in this app. */
export function validateEmail(value) {
  const email = (value ?? '').trim();
  if (!email) return 'Enter your email address.';
  if (email.length > 254) return 'Email address is too long.';
  if (/\s/.test(email)) return 'Email address cannot contain spaces.';
  if (
    !EMAIL_REGEX.test(email) ||
    email.includes('..') ||
    email.startsWith('.') ||
    email.includes('.@')
  ) {
    return 'Enter a valid email address, like name@example.com.';
  }
  return '';
}

export function validatePhone(value) {
  const phone = (value ?? '').trim();
  if (!phone) return 'Enter your phone number.';
  if (!PHONE_CHARS_REGEX.test(phone)) {
    return 'Phone number can only contain digits, spaces, hyphens and a leading +.';
  }
  if (!INDIAN_MOBILE_REGEX.test(phone.replace(/[\s-]/g, ''))) {
    return 'Enter a valid 10-digit mobile number, like +91 98765 43210.';
  }
  return '';
}

/* ---- Passwords ---- */

// One entry per rule. The checklist on the sign-up form is rendered from
// this same list, so what the user sees can never drift from what is enforced.
const PASSWORD_RULES = [
  {
    id: 'length',
    label: `At least ${PASSWORD_MIN} characters`,
    message: `Password must be at least ${PASSWORD_MIN} characters.`,
    test: (p) => p.length >= PASSWORD_MIN,
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    message: 'Password needs at least one lowercase letter.',
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    message: 'Password needs at least one uppercase letter.',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: 'number',
    label: 'One number',
    message: 'Password needs at least one number.',
    test: (p) => /\d/.test(p),
  },
  {
    id: 'special',
    label: 'One special character, like ! @ # $',
    message: 'Password needs at least one special character, like ! @ # $.',
    test: (p) => /[^A-Za-z0-9\s]/.test(p),
  },
  {
    id: 'spaces',
    label: 'No spaces',
    message: 'Password cannot contain spaces.',
    test: (p) => !/\s/.test(p),
  },
];

/** [{ id, label, passed }] for the live checklist under the password field. */
export function getPasswordChecks(password = '') {
  return PASSWORD_RULES.map(({ id, label, test }) => ({
    id,
    label,
    passed: test(password),
  }));
}

/** Sign-up: enforce every rule. */
export function validateNewPassword(password) {
  if (!password) return 'Create a password.';
  if (password.length > PASSWORD_MAX) {
    return `Password must be ${PASSWORD_MAX} characters or fewer.`;
  }
  const failed = PASSWORD_RULES.find(({ test }) => !test(password));
  return failed ? failed.message : '';
}

/** Sign-in: only check the basics so we don't leak the password rules. */
export function validateLoginPassword(password) {
  if (!password) return 'Enter your password.';
  if (password.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters.`;
  }
  return '';
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Re-enter your password to confirm it.';
  if (password !== confirmPassword) return "Passwords don't match.";
  return '';
}

/* ---- Booking fields ---- */

export function validateDate(date) {
  if (!date) return 'Choose a date.';
  if (!isValidISODate(date)) return 'Enter a valid date.';
  if (date < todayISO()) return "Date can't be in the past.";
  return '';
}

export function validateTime(time, date) {
  if (!time) return 'Choose a time.';
  if (!TIME_REGEX.test(time)) return 'Enter a valid time.';
  if (date === todayISO() && timeToMinutes(time) <= currentMinutes()) {
    return 'Choose a time later than now.';
  }
  return '';
}

export function validatePartySize(value) {
  const size = Number(value);
  if (!value || !Number.isInteger(size)) return 'Choose how many people are coming.';
  if (size < 1 || size > MAX_PARTY_SIZE) {
    return `Party size must be between 1 and ${MAX_PARTY_SIZE}.`;
  }
  return '';
}

export function validateOccasion(value) {
  if (!value) return 'Choose an occasion.';
  if (!OCCASIONS.includes(value)) return 'Choose an occasion from the list.';
  return '';
}

export function validateSpecialRequests(value) {
  if ((value ?? '').length > SPECIAL_REQUESTS_MAX) {
    return `Special requests must be ${SPECIAL_REQUESTS_MAX} characters or fewer.`;
  }
  return '';
}

/* ------------------------------------------------------------------ */
/* Form validators                                                     */
/* ------------------------------------------------------------------ */

export function validateLoginForm({ email, password }) {
  return compact({
    email: validateEmail(email),
    password: validateLoginPassword(password),
  });
}

export function validateSignupForm({ name, email, password, confirmPassword }) {
  return compact({
    name: validateName(name, 'Full name'),
    email: validateEmail(email),
    password: validateNewPassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  });
}

/** Step 1 of a booking, on the restaurant details page. */
export function validateBookingDetails(
  { date, time, partySize, occasion },
  restaurant,
) {
  let timeError = validateTime(time, date);
  if (!timeError && restaurant) {
    const slots = generateTimeSlots(restaurant.openTime, restaurant.closeTime);
    if (!slots.includes(time)) {
      timeError = `${restaurant.name} takes bookings from ${slots[0]} to ${slots[slots.length - 1]}.`;
    }
  }
  return compact({
    date: validateDate(date),
    time: timeError,
    partySize: validatePartySize(partySize),
    occasion: validateOccasion(occasion),
  });
}

/** Step 2 of a booking: the guest's contact details. */
export function validateCustomerInfo({
  firstName,
  lastName,
  email,
  phone,
  specialRequests,
}) {
  return compact({
    firstName: validateName(firstName, 'First name'),
    lastName: validateName(lastName, 'Last name'),
    email: validateEmail(email),
    phone: validatePhone(phone),
    specialRequests: validateSpecialRequests(specialRequests),
  });
}

/** The table picked on the floor plan must exist, be free and fit the party. */
export function validateTableSelection(table, partySize) {
  if (!table) return 'Pick a table from the floor plan.';
  if (!table.isAvailable) return `Table ${table.number} is already taken.`;
  if (table.seats < Number(partySize)) {
    return `Table ${table.number} seats ${table.seats}. Pick a larger table for ${partySize} people.`;
  }
  return '';
}

/** Restaurant dashboard: "Add reservation" form. */
export function validateReservationForm(values, existingReservations = []) {
  const errors = {
    customerName: validateName(values.customerName, 'Customer name'),
    email: validateEmail(values.email),
    phone: validatePhone(values.phone),
    date: validateDate(values.date),
    time: validateTime(values.time, values.date),
    partySize: validatePartySize(values.partySize),
    tableNumber: '',
    occasion: validateOccasion(values.occasion),
    specialRequests: validateSpecialRequests(values.specialRequests),
  };

  const tableNumber = Number(values.tableNumber);
  if (!Number.isInteger(tableNumber) || tableNumber < 1 || tableNumber > TOTAL_TABLES) {
    errors.tableNumber = `Choose a table between 1 and ${TOTAL_TABLES}.`;
  } else if (!errors.date && !errors.time) {
    const clash = existingReservations.find(
      (r) =>
        r.status !== 'cancelled' &&
        r.date === values.date &&
        Number(r.tableNumber) === tableNumber &&
        Math.abs(timeToMinutes(r.time) - timeToMinutes(values.time)) <
          DINING_DURATION_MINUTES,
    );
    if (clash) {
      errors.tableNumber = `Table ${tableNumber} is already booked at ${clash.time}. Choose another table or time.`;
    }
  }

  return compact(errors);
}
