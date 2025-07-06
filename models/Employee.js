const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  empId: String,
  firstName: String,
  lastName: String,
  phone: { type: String, unique: true },
  department: String,
  email: { type: String, unique: true },
  password: String,
  date: String
});

module.exports = mongoose.model('Employee', employeeSchema);
