const success = {
    USER_CREATED: 'User has been registered successfully',
    USER_VERIFIED: 'User has been verified',
    USER_AUTHENTICATED: 'User has been authenticated',
    OTP_CREATED: 'Otp has been generated',
    OTP_SENT: 'Otp has been sent',
    ITEM_LIST_FOUND: 'Item list found',
    ITEM_FOUND: 'Item found',
    ITEM_CREATED: 'Item has been added',
    ITEM_UPDATED: 'Item has been updated',
    ITEM_DELETED: 'Item has been deleted'
};

const error = {
    EMAIL_EXISTS: 'Email already registered',
    USERNAME_EXISTS: 'Username already registered',
    USER_NOT_FOUND: 'User not found',
    OTP_NOT_FOUND: 'Otp not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    INVALID_TOKEN: 'Invalid or expired authorization token',
    MISSING_TOKEN_SCOPE: 'Missing required token scope',
    MISSING_AUTHORIZATION_TOKEN: 'Missing authorization token',
    ITEM_NOT_FOUND: 'Item not found',
    MISSING_ADMIN_PRIVILEGE: 'Missing admin role',
    SCHEMA_VALIDATION_FAILED: 'Schema validation failed',
    INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later.'
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