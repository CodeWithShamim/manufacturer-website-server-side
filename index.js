const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// use middleware 
app.use(cors());
app.use(express.json());

// root route 
app.get('/', (req, res) => {
    res.send("Ryan refrigerator instrument server is running.......");
});

// listen 
app.listen(port, () => {
    console.log("Listening to port is", port)
})