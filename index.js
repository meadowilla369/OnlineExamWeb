const express = require('express');
const connection = require('./config/database');
const thiSinhRoutes = require('./routes/AuthRoutes');

const cookieParser = require('cookie-parser');
const cors = require('cors'); 
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/Users', thiSinhRoutes); 

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;

