const User = require('../Model/UserModel'); // Adjust the path as needed
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Generate user ID with leading zeros
const generateUserId = async () => {
    const lastUser = await User.findOne().sort({ userId: -1 }).limit(1);
    const lastId = lastUser ? parseInt(lastUser.userId.slice(1), 10) : 0; // Remove prefix if any
    const newId = (lastId + 1).toString().padStart(3, '0'); // Pad with zeros
    return `U${newId}`; // Prefix with 'U' or any other identifier
};

// Login user
// Login user
exports.loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Find user by username or email
        const user = await User.findOne({ $or: [{ userName: name }, { email: name }] });
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


// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { userName, name, email, password, phone, type } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userId = await generateUserId(); // Generate new user ID
        const newUser = new User({ userId, userName, name, email, password: hashedPassword, phone, type });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id }); // Use userId instead of _id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
    try {
        const { userName, name, email, password, phone, type } = req.body;
        const updateData = { userName, name, email, phone, type };

        // Only update password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        const updatedUser = await User.findOneAndUpdate(
            { userId: req.params.id }, // Use userId instead of _id
            updateData,
            { new: true } // Return the updated user
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ userId: req.params.id }); // Use userId instead of _id
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
