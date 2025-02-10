const express = require("express");
const router = express.Router();
const { Category } = require("../models/asset");
const connectDB = require("../utils/mongoDB");

router.post('/add', async (req, res) => {
    try {
        const { name, owner } = req.body;
        await connectDB.open();
        const existingCategory = await Category.findOne({ name, owner });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists for this owner' });
        }
        const newCategory = new Category({ name, owner });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    } finally {
        await connectDB.close();
    }
});

// Remove Category
router.post('/remove/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await connectDB.open();
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    } finally {
        await connectDB.close();
    }
});

router.get('/all/:ownerId', async (req, res) => {
    try {
        await connectDB.open();
        const { ownerId } = req.params;
        const categories = await Category.find({ owner: ownerId });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    } finally {
        await connectDB.close();
    }
});

module.exports = router;
