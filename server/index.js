const express = require('express');
const cors = require('cors');
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

const AuthRoutes = require('./routes/auth.js');


app.get('/', (req, res) => {
    
    res.send('Hello World');
    
});



app.use('/auth', AuthRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
