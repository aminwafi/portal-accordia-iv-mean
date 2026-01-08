const success = {
    USER_CREATED: 'User has been registered successfully',
    USER_VERIFIED: 'User has been verified',
    USER_AUTHENTICATED: 'User has been authenticated',
    OTP_CREATED: 'Otp has been generated',
    OTP_SENT: 'Otp has been sent'
};

const error = {
    EMAIL_EXISTS: 'Email already registered',
    USERNAME_EXISTS: 'Username already registered',
    USER_NOT_FOUND: 'User not found',
    OTP_NOT_FOUND: 'Otp not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later.',
};

const exception = {
    USER_ALREADY_VERIFIED: 'User already verified',
    USER_NOT_VERIFIED: 'User not verified'
}

module.exports = {
    SUCCESS: success,
    FAILURE: error,
    EXCEPTION: exception
}