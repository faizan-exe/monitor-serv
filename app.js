const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


mongoose.connect("mongodb+srv://waqasali00123:baQ4pFoRpSOEmLS2@cluster0.1c8za.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🟢 Connected to MongoDB'))
.catch(err => console.error('🔴 MongoDB connection error:', err));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use('/api/monitor', require('./routes/api.route'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
