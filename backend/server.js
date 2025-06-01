require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Models
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const Favorite = require('./models/Favorite');
const authMiddleware = require('./authMiddleware');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'recipe-images',
    format: async () => 'png',
    public_id: (req, file) => Date.now() + '-' + file.originalname.split('.')[0]
  }
});

const upload = multer({ storage });

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debugging middleware for authorization
app.use((req, res, next) => {
    console.log("Authorization Header:", req.headers.authorization);
    next();
});

// Database Connection with retry logic
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URL, {
   
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    setTimeout(connectWithRetry, 5000);
  });
};
connectWithRetry();

// Database connection events
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectWithRetry();
});

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Recipe Manager API</h1>');
});

// Registration API with enhanced validation
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required',
            fields: {
                username: !username,
                email: !email,
                password: !password
            }
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password must be at least 6 characters',
            field: 'password'
        });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(400).json({ 
                success: false,
                message: `${field} already in use`,
                field
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.status(201).json({ 
            success: true,
            message: "User Registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Login API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ 
            success: true,
            message: "Login Successful", 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Recipe APIs

// Create Recipe (Protected route)
app.post('/recipes', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, ingredients, timeToCook, steps } = req.body;
        const imagePath = req.file ? req.file.path : null;

        if (!name || !ingredients || !timeToCook || !steps || !imagePath) {
            return res.status(400).json({ 
                success: false,
                message: "Missing required fields" 
            });
        }

        const recipe = new Recipe({
            name,
            ingredients: ingredients.split(',').map(item => item.trim()),
            timeToCook,
            steps: steps.split('.').map(item => item.trim()).filter(Boolean),
            image: imagePath,
            user: req.user.id,
        });

        await recipe.save();
        res.json({ 
            success: true,
            message: "Recipe created successfully", 
            recipe 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Get all recipes
app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json({ 
            success: true,
            data: recipes 
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Get a single recipe by ID
app.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ 
            success: false,
            message: "Recipe not found" 
        });
        res.json({ 
            success: true,
            data: recipe 
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Update recipe
app.put('/recipes/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized - No user found" 
            });
        }

        const { name, timeToCook } = req.body;
        const ingredients = req.body.ingredients.split(',').map(item => item.trim());
        const steps = req.body.steps.split('.').map(item => item.trim()).filter(Boolean);

        const existingRecipe = await Recipe.findById(req.params.id);
        if (!existingRecipe) return res.status(404).json({ 
            success: false,
            message: "Recipe not found" 
        });

        if (existingRecipe.user.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: "Unauthorized to update this recipe" 
            });
        }

        const imagePath = req.file ? req.file.path : existingRecipe.image;

        const updateData = { name, ingredients, timeToCook, steps, image: imagePath };
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, { new: true });

        res.json({ 
            success: true,
            message: "Recipe updated successfully", 
            data: updatedRecipe 
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Delete Recipe (Protected route)
app.delete('/recipes/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ 
            success: false,
            message: "Recipe not found" 
        });

        if (recipe.user.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: "Unauthorized to delete this recipe" 
            });
        }

        await Favorite.deleteMany({ recipeId: recipe._id });
        await recipe.deleteOne();
        
        res.json({ 
            success: true,
            message: "Recipe deleted successfully and removed from favorites" 
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Favorite APIs

// Toggle Favorite Recipe (Protected route)
app.post('/favorites/toggle', authMiddleware, async (req, res) => {
    try {
        const { recipeId } = req.body;
        const userId = req.user.id;

        if (!recipeId) return res.status(400).json({ 
            success: false,
            message: "Recipe ID is required" 
        });

        const existingFavorite = await Favorite.findOne({ userId, recipeId });

        if (existingFavorite) {
            await Favorite.findOneAndDelete({ userId, recipeId });
            return res.json({ 
                success: true,
                message: "Removed from favorites" 
            });
        }

        const favorite = new Favorite({ userId, recipeId });
        await favorite.save();
        res.json({ 
            success: true,
            message: "Added to favorites", 
            data: favorite 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Get all favorite recipes of a user
app.get('/favorites', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await Favorite.find({ userId }).populate('recipeId');
        res.json({ 
            success: true,
            data: favorites 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Delete a favorite recipe (Protected route)
app.delete('/favorites/:recipeId', authMiddleware, async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user.id;

        if (!recipeId) return res.status(400).json({ 
            success: false,
            message: "Recipe ID is required" 
        });

        const existingFavorite = await Favorite.findOne({ userId, recipeId });

        if (!existingFavorite) {
            return res.status(404).json({ 
                success: false,
                message: "Favorite not found" 
            });
        }

        await Favorite.findOneAndDelete({ userId, recipeId });

        res.json({ 
            success: true,
            message: "Removed from favorites" 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Get all recipes created by the logged-in user
app.get('/my-recipes', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const recipes = await Recipe.find({ user: userId });
        
        // Ensure we always return an array, even if null/undefined
        const recipeData = Array.isArray(recipes) ? recipes : [];
        
        res.json({ 
            success: true,
            data: recipeData 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: "Server Error",
            data: [], // Explicit empty array on error
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    return res.status(413).json({
      success: false,
      message: 'File too large',
      maxSize: '5MB'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});