// models/Asset.js
const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    value: { type: Number, required: true },
    owner: { type: String, required: true }, // User who owns the asset
    dateAdded: { type: Date, default: Date.now }
});

// module.exports = mongoose.model('Asset', AssetSchema);

// models/Category.js
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    owner: { type: String, required: true }
});

module.exports = {
    Asset: mongoose.model('Asset', AssetSchema),
    Category: mongoose.model('Category', CategorySchema)
}
