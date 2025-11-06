// src/utils/validators.js

// Username: only letters and numbers, at least 3 characters
export const validateUsername = (username) => /^[a-zA-Z0-9]{3,}$/.test(username);

// Account Number: exactly 10 digits
export const validateAccountNumber = (acc) => /^[0-9]{10}$/.test(acc);

// Password: minimum length 6 characters
export const validatePassword = (pwd) => pwd.length >= 6;

// ID Number: exactly 13 digits (South African style)
export const validateIDNumber = (id) => /^[0-9]{13}$/.test(id);

// SWIFT Code: 8 to 11 characters, uppercase letters and numbers
export const validateSWIFT = (swift) => /^[A-Z0-9]{8,11}$/.test(swift);

// Amount: numbers only, optional 1-2 decimal places
export const validateAmount = (amount) => /^[0-9]+(\.[0-9]{1,2})?$/.test(amount);
