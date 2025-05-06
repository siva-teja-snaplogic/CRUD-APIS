const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection URI
const uri = "mongodb+srv://sivatejasivakavi:EYlMPJ3X8wHahCjm@cluster-slc.vxoqaed.mongodb.net/snap?retryWrites=true&w=majority&appName=Cluster-SLC";

// Connect to MongoDB using Mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if the connection fails
  }
}

connectToDatabase();

// Middleware to parse JSON request bodies
app.use(express.json());


// Define a Mongoose Schema (replace with your actual data structure)
const SnapSchema = new mongoose.Schema({
    snapPack: { type: String, required: true },
    description: { type: String, required: true },
    docLink: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    snapPricingCategory: { type: String, required: true },
    sourceversion: { type: String, required: true },
    snapversion: { type: String, required: true },
    lastEnhanceMade: { type: Date, default: Date.now},
    AhaBacklogLink: { type: String, required: true },
    currentWorkItems: { type: Number, required: true },
});

// Create a Mongoose Model
const Item = mongoose.model('Item', SnapSchema);  // 'Item' will be the name of the collection in MongoDB (it will be pluralized to 'items')

// Middleware to parse JSON request bodies
app.use(express.json());
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// --- API Endpoints ---

// 1. Create (POST /items)
app.post('/items', async (req, res) => {
    try {
        // Validate required fields
        const { snapPack, description, docLink, category, type, snapPricingCategory, sourceversion, snapversion, AhaBacklogLink, currentWorkItems } = req.body;

        if (!snapPack || !description || !docLink || !category || !type || !snapPricingCategory || !sourceversion || !snapversion || !AhaBacklogLink || currentWorkItems === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create a new item
        const newItem = new Item({
            snapPack,
            description,
            docLink,
            category,
            type,
            snapPricingCategory,
            sourceversion,
            snapversion,
            AhaBacklogLink,
            currentWorkItems,
        });

        // Save the item to the database
        const savedItem = await newItem.save();
        res.status(201).json(savedItem); // Respond with the created item
    } catch (err) {
        console.error("Error creating item:", err);
        res.status(500).json({ error: 'Failed to create item', details: err.message });
    }
});

// 2. Read All (GET /items)
app.get('/items', async (req, res) => {
    try {
        // Fetch all items from the database
        const items = await Item.find();
        res.status(200).json(items); // Respond with the list of items
    } catch (err) {
        console.error("Error retrieving items:", err);
        res.status(500).json({ error: 'Failed to retrieve items', details: err.message });
    }
});

// 3. Read One (GET /items/:id)
app.get('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id; // No need to convert, Mongoose handles it

        const item = await Item.findById(itemId); // findById returns null if not found
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (err) {
        console.error("Error reading item:", err);
        if (err instanceof mongoose.Error.CastError) {
            return res.status(400).json({ error: 'Invalid item ID format' });
        }
        res.status(500).json({ error: 'Failed to retrieve item', details: err.message });
    }
});

// 4. Update (PUT /items/:id)  (Use PUT for complete replacement, PATCH for partial updates)
app.put('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;

        // Validate the request body (optional, based on your schema)
        const { snapPack, description, docLink, category, type, snapPricingCategory, sourceversion, snapversion, AhaBacklogLink, currentWorkItems } = req.body;

        if (!snapPack || !description || !docLink || !category || !type || !snapPricingCategory || !sourceversion || !snapversion || !AhaBacklogLink || currentWorkItems === undefined) {
            return res.status(400).json({ error: 'All fields are required for update' });
        }

        // Update the item in the database
        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            req.body, // Update with the request body
            {
                new: true, // Return the updated document
                runValidators: true, // Ensure schema validation is applied
            }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json(updatedItem); // Respond with the updated item
    } catch (err) {
        console.error("Error updating item:", err);
        if (err instanceof mongoose.Error.CastError) {
            return res.status(400).json({ error: 'Invalid item ID format' });
        }
        res.status(500).json({ error: 'Failed to update item', details: err.message });
    }
});

// 5. Delete (DELETE /items/:id)
app.delete('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;

        const deletedItem = await Item.findByIdAndDelete(itemId); // findByIdAndDelete
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(204).send(); // 204 No Content (successful deletion, no body)
    } catch (err) {
        console.error("Error deleting item:", err);
        if (err instanceof mongoose.Error.CastError) {
            return res.status(400).json({ error: 'Invalid item ID format' });
        }
        res.status(500).json({ error: 'Failed to delete item', details: err.message });
    }
});

// --- Error Handling Middleware ---
//  This should be placed after all route definitions
// app.use((err, req, res, next) => {
//     if (isCelebrateError(err)) {
//         // We use celebrate's error() method to get the error details.
//         const errorMessage = err.details.get('body') || err.details.get('query') || err.details.get('params');
//         return res.status(400).json({
//             error: 'Invalid input',
//             details: errorMessage.message, //  Send the error message
//         });
//     }
//     // For other errors, delegate to the default Express error handler
//     next(err);
// });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
