const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
exports.getUsers = async (req, res) => {
  try {
    let query = {};
    if (req.query.role) query.role = req.query.role;
    if (req.query.status) query.status = req.query.status;
    if (req.query.department) query.department = req.query.department;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Approve user
// @route   PUT /api/users/:id/approve
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const io = req.app.get('io');
    if (io) io.emit('user_approved', { userId: user._id, name: user.name, role: user.role });

    res.json({ success: true, data: user, message: `${user.name} approved successfully` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update user (admin)
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'department', 'specialization', 'status', 'role', 'licenseNumber'];
    const updates = {};
    allowedUpdates.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/users/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalPatients, totalDoctors, pendingUsers, totalNurses] = await Promise.all([
      User.countDocuments({ role: 'patient', status: 'approved' }),
      User.countDocuments({ role: 'doctor', status: 'approved' }),
      User.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'nurse', status: 'approved' })
    ]);

    res.json({
      success: true,
      data: { totalPatients, totalDoctors, pendingUsers, totalNurses }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};