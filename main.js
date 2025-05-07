const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection URI
const uri = process.env.MONGODB_URI;

// Connecting to MongoDB using Mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

connectToDatabase();

// Middleware to parse JSON request bodies
app.use(express.json());

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
const Item = mongoose.model('Item', SnapSchema);

// Middleware to parse JSON request bodies
app.use(express.json());

// API Endpoints

app.post('/items', async (req, res) => {
    try {
        const { snapPack, description, docLink, category, type, snapPricingCategory, sourceversion, snapversion, AhaBacklogLink, currentWorkItems } = req.body;

        if (!snapPack || !description || !docLink || !category || !type || !snapPricingCategory || !sourceversion || !snapversion || !AhaBacklogLink || currentWorkItems === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }

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

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        console.error("Error creating item:", err);
        res.status(500).json({ error: 'Failed to create item', details: err.message });
    }
});

app.get('/items', async (req, res) => {
    try {
        // Fetching all items from the database
        const items = await Item.find();
        res.status(200).json(items);
    } catch (err) {
        console.error("Error retrieving items:", err);
        res.status(500).json({ error: 'Failed to retrieve items', details: err.message });
    }
});

app.get('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (err) {
        console.error("Error reading item:", err);
        res.status(500).json({ error: 'Failed to retrieve item', details: err.message });
    }
});

app.put('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const { snapPack, description, docLink, category, type, snapPricingCategory, sourceversion, snapversion, AhaBacklogLink, currentWorkItems } = req.body;

        if (!snapPack || !description || !docLink || !category || !type || !snapPricingCategory || !sourceversion || !snapversion || !AhaBacklogLink || currentWorkItems === undefined) {
            return res.status(400).json({ error: 'All fields are required for update' });
        }

        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).json({ error: 'Failed to update item', details: err.message });
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;

        const deletedItem = await Item.findByIdAndDelete(itemId);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).json({ error: 'Failed to delete item', details: err.message });
    }
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
