const express = require("express");
const router = express.Router();
const { Asset } = require("../models/asset");
const connectDB = require("../utils/mongoDB");

router.post('/add', async (req, res) => {
    try {
        await connectDB.open();
        const { name, category, value, ownerId } = req.body;
        const newAsset = new Asset({ name, category, value, owner: ownerId });
        await newAsset.save();
        res.status(201).json(newAsset);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    } finally {
        // await connectDB.close();
    }
});

// Remove Asset
router.post('/remove/:id', async (req, res) => {
    try {
        await connectDB.open();
        const { id } = req.params;
        const asset = await Asset.findById(id);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        await Asset.findByIdAndDelete(id);
        res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    } finally {
        // await connectDB.close();
    }
});

// Edit Asset
router.post('/edit/:id', async (req, res) => {
    try {
        await connectDB.open();
        const { id } = req.params;
        const updatedAsset = await Asset.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedAsset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        res.status(200).json(updatedAsset);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    } finally {
        // await connectDB.close();
    }
});

// Fetch All Assets
router.post('/all/:ownerId', async (req, res) => {
    try {
        await connectDB.open();
        const { ownerId } = req.params;
        const assets = await Asset.find({ owner: ownerId }).populate('category');
        res.status(200).json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    } finally {
        // await connectDB.close();
    }
});

router.post('/dashboard/:ownerId', async (req, res) => {
    try {
        const { ownerId } = req.params;
        await connectDB.open();
        const assets = await Asset.find({ owner: ownerId }).populate('category');
        const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
        const categoryData = {};

        assets.forEach(asset => {
            const categoryName = asset.category.name;
            if (!categoryData[categoryName]) {
                categoryData[categoryName] = { count: 0, totalValue: 0 };
            }
            categoryData[categoryName].count++;
            categoryData[categoryName].totalValue += asset.value;
        });

        res.status(200).json({ totalAssets: assets.length, totalValue, categoryData });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    } finally {
        // await connectDB.close();
    }
});
module.exports = router;
