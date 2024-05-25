const express = require('express');
const app = express();

app.get('/', (req, res) =>{
    res.json({msg:"hi "})
})

app.listen(3000)