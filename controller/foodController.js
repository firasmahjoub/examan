import foodModel from '../models/foodModel.js';
import fs from 'fs';

// Add food item
const addFood = async (req, res) => {
    try {
        // Ensure file upload middleware works correctly
        let image_filename = req.file ? req.file.filename : 'default_image_url';

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename, // Corrected field name
        });

        await food.save();
        res.json({ success: true, message: "Food added", food });
    } catch (error) {
        console.log("Error adding food:", error);
        res.status(500).json({ success: false, message: "Error adding food item" });
    }
};

// Get all food
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log("Error fetching food:", error);
        res.status(500).json({ success: false, message: "Error fetching food items" });
    }
};

// Remove food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Remove image from uploads folder
        if (food.image && food.image !== 'default_image_url') {
            fs.unlink(`uploads/${food.image}`, (err) => {
                if (err) {
                    console.log("Error deleting image:", err);
                } else {
                    console.log("Image deleted successfully.");
                }
            });
        }

        // Delete food from database
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food removed" });
    } catch (error) {
        console.log("Error removing food:", error);
        res.status(500).json({ success: false, message: "Error removing food" });
    }
};

export { addFood, listFood, removeFood };
