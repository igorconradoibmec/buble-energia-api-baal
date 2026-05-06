const userService = require('../services/user.service');

function createSession(req, res) {
    const session = userService.createGuestSession();
    res.status(201).json(session);
}

module.exports = { createSession };
