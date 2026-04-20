const Leave  = require('../models/Leave');
const Task   = require('../models/Task');
const User   = require('../models/User');

// ─── LEAVES ───────────────────────────────────────────────────────────

exports.getLeaves = async (req, res) => {
  try {
    const q = {};
    if (req.user.role !== 'admin') q.user = req.user.id;
    if (req.query.status)  q.status  = req.query.status;
    if (req.query.userId)  q.user    = req.query.userId;
    const leaves = await Leave.find(q)
      .populate('user','name role department avatar')
      .populate('reviewedBy','name')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.applyLeave = async (req, res) => {
  try {
    const { type, from, to, reason } = req.body;
    const fromD = new Date(from); const toD = new Date(to);
    const days = Math.ceil((toD - fromD) / (1000*60*60*24)) + 1;
    const leave = await Leave.create({ user: req.user.id, type, from: fromD, to: toD, days, reason });
    await leave.populate('user','name role');
    // Notify admin via socket
    const io = req.app.get('io');
    if (io) io.emit('leave_applied', { userName: req.user.name, type, days, leaveId: leave._id });
    res.status(201).json({ success: true, data: leave });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.reviewLeave = async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    const leave = await Leave.findByIdAndUpdate(req.params.id, {
      status, reviewNote, reviewedBy: req.user.id, reviewedAt: new Date(),
      isOnLeave: status === 'approved'
    }, { new: true }).populate('user','name role department');
    if (!leave) return res.status(404).json({ success:false, error:'Not found' });
    // Notify everyone
    const io = req.app.get('io');
    if (io) {
      io.emit('leave_reviewed', {
        leaveId: leave._id, userName: leave.user.name,
        userRole: leave.user.role, status,
        from: leave.from, to: leave.to, type: leave.type
      });
    }
    res.json({ success: true, data: leave });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success:false, error:'Not found' });
    if (leave.user.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success:false, error:'Unauthorized' });
    leave.status = 'rejected';
    await leave.save();
    res.json({ success:true, data: leave });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

// Who is on leave today
exports.getTodayLeaves = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
    const leaves = await Leave.find({
      status: 'approved',
      from: { $lte: tomorrow },
      to:   { $gte: today }
    }).populate('user','name role department avatar');
    res.json({ success:true, data: leaves });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

// ─── TASKS ────────────────────────────────────────────────────────────

exports.getTasks = async (req, res) => {
  try {
    const q = {};
    if (req.user.role !== 'admin') q.assignedTo = req.user.id;
    if (req.query.assignedTo) q.assignedTo = req.query.assignedTo;
    if (req.query.status)     q.status     = req.query.status;
    if (req.query.priority)   q.priority   = req.query.priority;
    const tasks = await Task.find(q)
      .populate('assignedTo','name role')
      .populate('assignedBy','name role')
      .populate('room','name number')
      .sort({ createdAt: -1 });
    res.json({ success:true, count:tasks.length, data:tasks });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, assignedBy: req.user.id });
    await task.populate('assignedTo','name role');
    await task.populate('assignedBy','name role');
    const io = req.app.get('io');
    if (io) io.to(`user_${task.assignedTo._id}`).emit('task_assigned', { taskId:task._id, title:task.title, assignedBy:req.user.name });
    res.status(201).json({ success:true, data:task });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.updateTask = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.status === 'completed') update.completedAt = new Date();
    const task = await Task.findByIdAndUpdate(req.params.id, update, { new:true })
      .populate('assignedTo','name role').populate('assignedBy','name role');
    if (!task) return res.status(404).json({ success:false, error:'Not found' });
    res.json({ success:true, data:task });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success:true, message:'Deleted' });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};
