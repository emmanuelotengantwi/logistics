const User = require('../models/User');

const maskName = (name) => {
  const safe = String(name || '').trim().replace(/\s+/g, ' ');
  if (!safe) return 'Customer';
  const parts = safe.split(' ');
  const first = parts[0];
  const last = parts.length > 1 ? parts[parts.length - 1] : '';
  const lastInitial = last ? `${last[0].toUpperCase()}.` : '';
  return lastInitial ? `${first} ${lastInitial}` : first;
};

// @desc    Public, privacy-safe registration stats
// @route   GET /api/public/registrations
// @access  Public
const getRegistrations = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 12, 50));
    const role = String(req.query.role || 'Customer');

    const query = role ? { role } : {};
    const [total, recent] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .select('name createdAt')
        .sort({ createdAt: -1 })
        .limit(limit),
    ]);

    res.json({
      total,
      recent: recent.map((u) => ({
        id: u._id,
        displayName: maskName(u.name),
        joinedAt: u.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRegistrations };

