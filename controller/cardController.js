import Cart from "../models/cartModel.js";
import Food from "../models/foodModel.js";

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { userId, foodId } = req.body;

        // Find the food item by ID
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found." });
        }

        // Use the image from the food document or default if missing
        const foodImage = food.image || 'default_image_url';

        // Create a new cart item
        const cartItem = new Cart({
            userId,
            foodId,
            name: food.name,
            description: food.description,
            image: foodImage,
            price: food.price,

        });

        await cartItem.save();
        res.status(201).json({ success: true, message: "Item added to cart." });
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding to the cart." });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { userId, foodId } = req.body;

        const result = await Cart.findOneAndDelete({ userId, foodId });
        if (!result) {
            return res.status(404).json({ success: false, message: "Item not found in cart." });
        }

        res.json({ success: true, message: "Item removed from cart." });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({ success: false, message: "An error occurred while removing from the cart." });
    }
};

// Get cart items
export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cartItems = await Cart.find({ userId }).populate("foodId", "name image");
        res.json({ success: true, cartItems });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({ success: false, message: "An error occurred while fetching the cart." });
    }
};
