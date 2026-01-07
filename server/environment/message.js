const success = {
    USER_CREATED: 'User has been created successfully'
};

const error = {
    EMAIL_EXISTS: 'Email already registered',
    USERNAME_EXISTS: 'Username already registered',
    INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later.'
};

module.exports = {
    SUCCESS: success,
    FAILURE: error
}