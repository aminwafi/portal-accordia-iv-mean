const success = {
    USER_CREATED: 'User has been registered successfully',
    OTP_CREATED: 'Otp has been generated successfully',
    OTP_SENT: 'Otp has been sent successfully'
};

const error = {
    EMAIL_EXISTS: 'Email already registered',
    USERNAME_EXISTS: 'Username already registered',
    INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later.',
    USER_NOT_FOUND: 'User not found'
};

module.exports = {
    SUCCESS: success,
    FAILURE: error
}