const User = require('../Model/UserModel'); // Adjust the path as needed
const bcrypt = require('bcrypt');

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Find user by name (assuming `name` is unique, or adjust as needed)
        const user = await User.findOne({ userName: name });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Send user details excluding password
        const { password: pwd, ...userData } = user.toObject();
        res.status(200).json({ user: userData });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
};
