const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
	    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const findUserByEmailInsensitive = async (email) => {
  const trimmed = String(email || '').trim();
  if (!trimmed) return null;

  // Prefer normalized lookup, but also support legacy case-mismatched emails.
  const normalized = trimmed.toLowerCase();
  const exact = await User.findOne({ email: normalized });
  if (exact) return exact;

  return await User.findOne({ email: { $regex: `^${escapeRegex(trimmed)}$`, $options: 'i' } });
};

const generateShippingMark = () => {
	    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	    let result = 'AMOOKSCO-';
	    for (let i = 0; i < 6; i++) {
	        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const registerUser = async (req, res) => {
	    try {
	        const { name, email, password, role } = req.body;
	        const emailTrimmed = String(email || '').trim();
	        const emailNormalized = emailTrimmed.toLowerCase();

	        if (!name || !emailTrimmed || !password) {
	            return res.status(400).json({ message: 'Name, email and password are required' });
	        }

	        const userExists = await findUserByEmailInsensitive(emailTrimmed);

	        if (userExists) {
	            return res.status(400).json({ message: 'User already exists' });
	        }

        let shippingMark = generateShippingMark();
        let markExists = await User.findOne({ shippingMark });
        while (markExists) {
            shippingMark = generateShippingMark();
            markExists = await User.findOne({ shippingMark });
        }

	        const user = await User.create({
	            name,
	            email: emailNormalized,
	            password,
	            role: role || 'Customer',
	            shippingMark
	        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                shippingMark: user.shippingMark,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
	    try {
	        const { email, password } = req.body;
	        if (!email || !password) {
	            return res.status(400).json({ message: 'Email and password are required' });
	        }

	        const user = await findUserByEmailInsensitive(email);

	        if (!user) {
	            return res.status(401).json({ message: 'Email not found' });
	        }

	        // Legacy support: if password is not hashed, treat it as plaintext once,
	        // then upgrade it to a bcrypt hash on successful login.
	        let isMatch = false;
	        if (typeof user.password === 'string' && user.password.startsWith('$2')) {
	            isMatch = await user.matchPassword(password);
	        } else if (typeof user.password === 'string') {
	            isMatch = user.password === password;
	            if (isMatch) {
	                user.password = password;
	                await user.save();
	            }
	        }

	        if (isMatch) {
	            res.json({
	                _id: user._id,
	                name: user.name,
	                email: user.email,
	                role: user.role,
	                shippingMark: user.shippingMark,
	                token: generateToken(user._id)
	            });
	        } else {
	            res.status(401).json({ message: 'Incorrect password' });
	        }
	    } catch (error) {
	        res.status(500).json({ message: error.message });
	    }
};

module.exports = { registerUser, loginUser };
