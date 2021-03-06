const express = require('express');
const mongoose= require('mongoose');
const routes = require('./routes');
const app = express();

const { MONGODB_URI } = process.env; 
mongoose.connect(MONGODB_URI, { useUnifiedTopology: true });


app.use(express.json()); //express json middleware

app.use('/', routes); //setup routes


app.use('*', (req, res, next) => {            //notfound middleware
    res.status(404).json({err: 'Not_found'});    
});

//error handler middleware
app.use((err, req, res, next)=>{    
    console.error(err);
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(422).json(err.errors);
    }
    else if (err.code === 11000) {
      res.status(422).json({ statusCode: 'ValidationError', property: err.keyValue });
    }
    else if (err.message === 'UN_AUTHENTICATED') {
      res.status(401).json({ statusCode: 'UN_AUTHENTICATED' });
    }
    res.status(503).end(); //server error
});

const { PORT=3000 } = process.env;
app.listen(PORT, ()=>{
    console.log('App is ready on:', PORT);
})