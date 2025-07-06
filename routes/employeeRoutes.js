const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// ✅ Get Last Employee ID (must be first before any :id route)
router.get('/last-id', async (req, res) => {
  try {
    const lastEmployee = await Employee.findOne().sort({ empId: -1 }).exec();

    let nextId = 'E0001';
    if (lastEmployee && lastEmployee.empId) {
      const num = parseInt(lastEmployee.empId.replace('E', '')) + 1;
      nextId = 'E' + String(num).padStart(4, '0');
    }

    res.json({ empId: nextId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate ID' });
  }
});

// ✅ Register Employee
router.post('/', async (req, res) => {
  try {
    const existingEmail = await Employee.findOne({ email: req.body.email });
    const existingPhone = await Employee.findOne({ phone: req.body.phone });

    if (existingEmail)
      return res.status(400).json({ message: 'Email already exists' });

    if (existingPhone)
      return res.status(400).json({ message: 'Phone number already exists' });

    // Generate empId
    const lastEmployee = await Employee.findOne().sort({ empId: -1 }).exec();
    let nextId = 'E0001';
    if (lastEmployee && lastEmployee.empId) {
      const num = parseInt(lastEmployee.empId.replace('E', '')) + 1;
      nextId = 'E' + String(num).padStart(4, '0');
    }

    const newEmployee = new Employee({ ...req.body, empId: nextId });
    await newEmployee.save();

    res.status(201).json({ message: 'Employee registered successfully', empId: nextId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Get All Employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get Single Employee by ID (must be after /last-id)
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update Employee
router.put('/:id', async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete Employee
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
