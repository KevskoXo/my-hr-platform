// defaulttService/controllers/defaulttController.js

const defaultt = require('../models/defaulttModel');

// Get all defaultts
exports.getAlldefaultts = async (req, res) => {
    try {
        const defaultts = await defaultt.find();
        res.json(defaultts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new defaultt
exports.createdefaultt = async (req, res) => {
    const defaultt = new defaultt({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        salary: req.body.salary
    });

    try {
        const newdefaultt = await defaultt.save();
        res.status(201).json(newdefaultt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get a single defaultt by ID
exports.getdefaulttById = async (req, res) => {
    try {
        const defaultt = await defaultt.findById(req.params.id);
        if (!defaultt) return res.status(404).json({ message: 'defaultt not found' });
        res.json(defaultt);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a defaultt by ID
exports.updatedefaultt = async (req, res) => {
    try {
        const defaultt = await defaultt.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!defaultt) return res.status(404).json({ message: 'defaultt not found' });
        res.json(defaultt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a defaultt by ID
exports.deletedefaultt = async (req, res) => {
    try {
        const defaultt = await defaultt.findByIdAndDelete(req.params.id);
        if (!defaultt) return res.status(404).json({ message: 'defaultt not found' });
        res.json({ message: 'defaultt deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
