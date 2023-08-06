function validatePassword(password) {
    return (
        password.trim().length >= 8 // at least 8 characters
        && /[a-z]/.test(password) // contains a lower case letter
        && /[A-Z]/.test(password) // contains an upper case letter
        && /\d/.test(password) // contains a number
    );
}

export default validatePassword;
