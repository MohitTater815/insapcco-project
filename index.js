// Import required modules
const express = require('express');
const cors = require('cors');

require('dotenv').config();


const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const AuthApi = require('./api/users');
const CategoryApi = require('./api/Category');
const AssetApi = require('./api/Asset');

app.use('/api', AuthApi)
app.use('/Category', CategoryApi)
app.use('/Asset', AssetApi)

app.get('/', async (req, res) => {
    res.send({ message: "this is working" });
})
// Login Route

// Start the server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
