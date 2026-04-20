// const OTRoom = require('../models/OTRoom');
// const Schedule = require('../models/Schedule');
// const ChatMessage = require('../models/ChatMessage');
// const User = require('../models/User');

// // ─── OT ROOMS ─────────────────────────────────────────────────────────────

// exports.getRooms = async (req, res) => {
//   try {
//     const q = {};
//     if (req.query.type) q.type = req.query.type;
//     if (req.query.status) q.status = req.query.status;
//     const rooms = await OTRoom.find(q)
//       .populate('assignedPatient','name bloodGroup')
//       .populate('assignedDoctor','name specialization')
//       .populate('assignedNurse','name')
//       .sort({ type:1, number:1 });
//     res.json({ success:true, count:rooms.length, data:rooms });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.createRoom = async (req, res) => {
//   try {
//     const room = await OTRoom.create(req.body);
//     res.status(201).json({ success:true, data:room });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.updateRoom = async (req, res) => {
//   try {
//     const room = await OTRoom.findByIdAndUpdate(req.params.id, req.body, { new:true })
//       .populate('assignedPatient','name').populate('assignedDoctor','name').populate('assignedNurse','name');
//     if (!room) return res.status(404).json({ success:false, error:'Room not found' });
//     const io = req.app.get('io');
//     if (io) io.emit('room_updated', { roomId:room._id, status:room.status, name:room.name });
//     res.json({ success:true, data:room });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.deleteRoom = async (req, res) => {
//   try {
//     await OTRoom.findByIdAndDelete(req.params.id);
//     res.json({ success:true, message:'Room deleted' });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// // ─── SCHEDULES ────────────────────────────────────────────────────────────

// exports.getSchedules = async (req, res) => {
//   try {
//     const q = {};
//     if (req.query.userId) q.user = req.query.userId;
//     if (req.query.role) q.role = req.query.role;
//     if (req.query.date) {
//       const d = new Date(req.query.date);
//       q.date = { $gte: new Date(d.setHours(0,0,0,0)), $lt: new Date(new Date(req.query.date).setHours(23,59,59,999)) };
//     }
//     if (req.query.week) {
//       const start = new Date(req.query.week);
//       const end = new Date(start); end.setDate(end.getDate()+7);
//       q.date = { $gte: start, $lt: end };
//     }
//     if (!['admin','doctor','nurse','pharmacist','wardboy'].includes(req.user.role)) {
//       q.user = req.user.id;
//     }
//     const schedules = await Schedule.find(q)
//       .populate('user','name role department')
//       .populate('room','name number type')
//       .sort({ date:1 });
//     res.json({ success:true, count:schedules.length, data:schedules });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.createSchedule = async (req, res) => {
//   try {
//     const schedule = await Schedule.create(req.body);
//     await schedule.populate('user','name role');
//     res.status(201).json({ success:true, data:schedule });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.updateSchedule = async (req, res) => {
//   try {
//     const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new:true }).populate('user','name role');
//     if (!schedule) return res.status(404).json({ success:false, error:'Schedule not found' });
//     res.json({ success:true, data:schedule });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.deleteSchedule = async (req, res) => {
//   try {
//     await Schedule.findByIdAndDelete(req.params.id);
//     res.json({ success:true, message:'Schedule deleted' });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// // ─── CHAT ─────────────────────────────────────────────────────────────────

// exports.getMessages = async (req, res) => {
//   try {
//     const { room = 'general', limit = 50, before } = req.query;
//     const q = { room };
//     if (before) q.createdAt = { $lt: new Date(before) };
//     const msgs = await ChatMessage.find(q)
//       .populate('sender','name role avatar')
//       .sort({ createdAt:-1 })
//       .limit(parseInt(limit));
//     res.json({ success:true, data:msgs.reverse() });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.sendMessage = async (req, res) => {
//   try {
//     const { message, room='general', receiver } = req.body;
//     const msg = await ChatMessage.create({
//       sender: req.user.id,
//       senderName: req.user.name,
//       senderRole: req.user.role,
//       message,
//       room,
//       receiver: receiver||null,
//     });
//     await msg.populate('sender','name role avatar');
//     const io = req.app.get('io');
//     if (io) {
//       io.to(room).emit('new_message', msg);
//       if (receiver) io.to(`user_${receiver}`).emit('new_message', msg);
//     }
//     res.status(201).json({ success:true, data:msg });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find({ status:'approved', _id:{ $ne:req.user.id } })
//       .select('name role department isOnline lastSeen avatar')
//       .sort({ isOnline:-1, name:1 });
//     res.json({ success:true, data:users });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };


// const OTRoom = require('../models/OTRoom');
// const Schedule = require('../models/Schedule');
// const ChatMessage = require('../models/ChatMessage');
// const User = require('../models/User');

// // ─── OT ROOMS ─────────────────────────────────────────────────────────────
// exports.getRooms = async (req, res) => {
//   try {
//     const q = {};
//     if (req.query.type)   q.type   = req.query.type;
//     if (req.query.status) q.status = req.query.status;
//     const rooms = await OTRoom.find(q)
//       .populate('assignedPatient','name bloodGroup')
//       .populate('assignedDoctor','name specialization')
//       .populate('assignedNurse','name')
//       .sort({ type:1, number:1 });
//     res.json({ success:true, count:rooms.length, data:rooms });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.createRoom = async (req, res) => {
//   try {
//     const room = await OTRoom.create(req.body);
//     res.status(201).json({ success:true, data:room });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.updateRoom = async (req, res) => {
//   try {
//     const room = await OTRoom.findByIdAndUpdate(req.params.id, req.body, { new:true })
//       .populate('assignedPatient','name').populate('assignedDoctor','name').populate('assignedNurse','name');
//     if (!room) return res.status(404).json({ success:false, error:'Room not found' });
//     const io = req.app.get('io');
//     if (io) io.emit('room_updated', { roomId:room._id, status:room.status, name:room.name });
//     res.json({ success:true, data:room });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.deleteRoom = async (req, res) => {
//   try {
//     await OTRoom.findByIdAndDelete(req.params.id);
//     res.json({ success:true, message:'Room deleted' });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// // ─── SCHEDULES ────────────────────────────────────────────────────────────
// // CRITICAL: always scope to current user UNLESS admin + explicit userId param OR all query

// exports.getSchedules = async (req, res) => {
//   try {
//     const isAdmin = req.user.role === 'admin';
//     const q = {};

//     // Scope: non-admin always gets own schedule only
//     // Admin can query all (no userId param) or specific user (userId param)
//     if (!isAdmin) {
//       q.user = req.user.id;
//     } else if (req.query.userId) {
//       q.user = req.query.userId;
//     }
//     // Admin with no userId gets all (for timetable admin view)

//     if (req.query.role) q.role = req.query.role;
//     if (req.query.date) {
//       const d = new Date(req.query.date);
//       q.date = { $gte: new Date(d.setHours(0,0,0,0)), $lt: new Date(new Date(req.query.date).setHours(23,59,59,999)) };
//     }
//     if (req.query.week) {
//       const start = new Date(req.query.week);
//       const end = new Date(start); end.setDate(end.getDate()+7);
//       q.date = { $gte: start, $lt: end };
//     }

//     const schedules = await Schedule.find(q)
//       .populate('user','name role department')
//       .populate('room','name number type')
//       .sort({ date:1 });
//     res.json({ success:true, count:schedules.length, data:schedules });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.createSchedule = async (req, res) => {
//   try {
//     const schedule = await Schedule.create(req.body);
//     await schedule.populate('user','name role');
//     const io = req.app.get('io');
//     if (io) io.to(`user_${req.body.user}`).emit('schedule_assigned', { title:'New shift assigned', date:req.body.date });
//     res.status(201).json({ success:true, data:schedule });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.bulkSeedSchedules = async (req, res) => {
//   try {
//     const { schedules } = req.body;
//     await Schedule.insertMany(schedules);
//     res.status(201).json({ success:true, count:schedules.length });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.updateSchedule = async (req, res) => {
//   try {
//     const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new:true }).populate('user','name role');
//     if (!schedule) return res.status(404).json({ success:false, error:'Schedule not found' });
//     res.json({ success:true, data:schedule });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.deleteSchedule = async (req, res) => {
//   try {
//     await Schedule.findByIdAndDelete(req.params.id);
//     res.json({ success:true, message:'Deleted' });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// // ─── CHAT ─────────────────────────────────────────────────────────────────
// exports.getMessages = async (req, res) => {
//   try {
//     const { room='general', limit=50, before } = req.query;
//     const q = { room };
//     if (before) q.createdAt = { $lt: new Date(before) };
//     const msgs = await ChatMessage.find(q)
//       .populate('sender','name role avatar')
//       .sort({ createdAt:-1 })
//       .limit(parseInt(limit));
//     res.json({ success:true, data:msgs.reverse() });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.sendMessage = async (req, res) => {
//   try {
//     const { message, room='general', receiver } = req.body;
//     const msg = await ChatMessage.create({
//       sender: req.user.id, senderName: req.user.name,
//       senderRole: req.user.role, message, room, receiver: receiver||null,
//     });
//     await msg.populate('sender','name role avatar');
//     const io = req.app.get('io');
//     if (io) {
//       io.to(room).emit('new_message', msg);
//       if (receiver) io.to(`user_${receiver}`).emit('new_message', msg);
//     }
//     res.status(201).json({ success:true, data:msg });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };

// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find({ status:'approved', _id:{ $ne:req.user.id } })
//       .select('name role department isOnline lastSeen avatar')
//       .sort({ isOnline:-1, name:1 });
//     res.json({ success:true, data:users });
//   } catch(e) { res.status(500).json({ success:false, error:e.message }); }
// };



const OTRoom = require('../models/OTRoom');
const Schedule = require('../models/Schedule');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

// ─── OT ROOMS ─────────────────────────────────────────────────────────────
exports.getRooms = async (req, res) => {
  try {
    const q = {};
    if (req.query.type)   q.type   = req.query.type;
    if (req.query.status) q.status = req.query.status;
    const rooms = await OTRoom.find(q)
      .populate('assignedPatient','name bloodGroup')
      .populate('assignedDoctor','name specialization')
      .populate('assignedNurse','name')
      .sort({ type:1, number:1 });
    res.json({ success:true, count:rooms.length, data:rooms });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.createRoom = async (req, res) => {
  try {
    const room = await OTRoom.create(req.body);
    res.status(201).json({ success:true, data:room });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await OTRoom.findByIdAndUpdate(req.params.id, req.body, { new:true })
      .populate('assignedPatient','name').populate('assignedDoctor','name').populate('assignedNurse','name');
    if (!room) return res.status(404).json({ success:false, error:'Room not found' });
    const io = req.app.get('io');
    if (io) io.emit('room_updated', { roomId:room._id, status:room.status, name:room.name });
    res.json({ success:true, data:room });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.deleteRoom = async (req, res) => {
  try {
    await OTRoom.findByIdAndDelete(req.params.id);
    res.json({ success:true, message:'Room deleted' });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

// ─── SCHEDULES ────────────────────────────────────────────────────────────
// CRITICAL: always scope to current user UNLESS admin + explicit userId param OR all query

exports.getSchedules = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const q = {};

    // Scope: non-admin always gets own schedule only
    // Admin can query all (no userId param) or specific user (userId param)
    if (!isAdmin) {
      q.user = req.user.id;
    } else if (req.query.userId) {
      q.user = req.query.userId;
    }
    // Admin with no userId gets all (for timetable admin view)

    if (req.query.role) q.role = req.query.role;
    if (req.query.date) {
      const d = new Date(req.query.date);
      q.date = { $gte: new Date(d.setHours(0,0,0,0)), $lt: new Date(new Date(req.query.date).setHours(23,59,59,999)) };
    }
    if (req.query.week) {
      const start = new Date(req.query.week);
      const end = new Date(start); end.setDate(end.getDate()+7);
      q.date = { $gte: start, $lt: end };
    }

    const schedules = await Schedule.find(q)
      .populate('user','name role department')
      .populate('room','name number type')
      .sort({ date:1 });
    res.json({ success:true, count:schedules.length, data:schedules });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.createSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    await schedule.populate('user','name role');
    const io = req.app.get('io');
    if (io) io.to(`user_${req.body.user}`).emit('schedule_assigned', { title:'New shift assigned', date:req.body.date });
    res.status(201).json({ success:true, data:schedule });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.bulkSeedSchedules = async (req, res) => {
  try {
    const { schedules } = req.body;
    await Schedule.insertMany(schedules);
    res.status(201).json({ success:true, count:schedules.length });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new:true }).populate('user','name role');
    if (!schedule) return res.status(404).json({ success:false, error:'Schedule not found' });
    res.json({ success:true, data:schedule });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success:true, message:'Deleted' });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

// ─── CHAT ─────────────────────────────────────────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const { room='general', limit=50, before } = req.query;
    const q = { room };
    if (before) q.createdAt = { $lt: new Date(before) };
    const msgs = await ChatMessage.find(q)
      .populate('sender','name role avatar')
      .sort({ createdAt:-1 })
      .limit(parseInt(limit));
    res.json({ success:true, data:msgs.reverse() });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message, room='general', receiver } = req.body;
    const msg = await ChatMessage.create({
      sender: req.user.id, senderName: req.user.name,
      senderRole: req.user.role, message, room, receiver: receiver||null,
    });
    await msg.populate('sender','name role avatar');
    const io = req.app.get('io');
    if (io) {
      io.to(room).emit('new_message', msg);
      if (receiver) io.to(`user_${receiver}`).emit('new_message', msg);
    }
    res.status(201).json({ success:true, data:msg });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};

exports.getUsers = async (req, res) => {
  try {
    const q = { status:'approved', _id:{ $ne:req.user.id } };
    // Ward boys and nurses can only chat with doctors and admins (not patients)
    if (['wardboy','sweeper','otboy','nurse'].includes(req.user.role)) {
      q.role = { $in: ['doctor','admin','nurse'] };
    }
    // Patients cannot see patient list in chat (can see doctors and admins)
    if (req.user.role === 'patient') {
      q.role = { $in: ['doctor','admin','nurse'] };
    }
    const users = await User.find(q)
      .select('name role department isOnline lastSeen avatar')
      .sort({ isOnline:-1, name:1 });
    res.json({ success:true, data:users });
  } catch(e) { res.status(500).json({ success:false, error:e.message }); }
};
