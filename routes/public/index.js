
const express = require('express');
let router = express();
router.get('/' , (req , res , next) =>{
res.send('Hello world!);
})
module.exports = router;
