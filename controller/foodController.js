        import foodModel from '../models/foodModel.js';
        import fs from 'fs' ; 

        // add food item 

        const addFood = async (req, res) => {
            let image_filename = `${req.file.filename}`;
            const food = new foodModel({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                image: image_filename,  // Corrected field name here
            });
        
            try {
                await food.save();
                res.json({ success: true, message: "Food added" });
            } catch (error) {
                console.log(error);  // Log the error correctly
                res.json({ success: false, message: "Error adding food item" });
            }
        };



        //get all food
        const listFood = async(req,res) => {
            try{
                const foods = await foodModel.find({});
                res.json({success:true,date:foods})
            }catch (error) {
                console.log(error);
                res.json({ success: false, message: "Error fetching food items" });
            }

        }

        // remove food


        const removeFood = async (req, res) => {
            try {
                // tlawej ala id fema wella la 
                const food = await foodModel.findById(req.body.id);
                
                if (!food) {
                    return res.status(404).json({ success: false, message: "Food item not found" });
                }
        
                // tnahy il tsewer min uploads 
                fs.unlink(`uploads/${food.Image}`, (err) => {
                    if (err) {
                        console.log("Error deleting image:", err);
                    }
                });
        
                // tnahy il tsewer min base 
                await foodModel.findByIdAndDelete(req.body.id);
        
                res.json({ success: true, message: "Food removed" });
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Error removing food" });
            }
        };

        export{addFood , listFood , removeFood}