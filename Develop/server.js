const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json')
const uuid = require('./uuid')


const PORT = 3001;

const app = express();

app.use(express.json());

app.use(express.static('public'));


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => { 

  fs.readFile('./db/db.json', 'utf8', (err, notes) => {


    if (err) {
      console.error(err);
    } else {
  return res.json(JSON.parse(notes));
    }
  })

});

app.post('/api/notes', (req, res) => {
  

  console.info(`${req.method} request received to add a review`);


    const { title, text } = req.body;

    if (title && text) {
      const newTip = {
        title,
        text,
        text_id: uuid(),
      };

      
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          
          const parsedReviews = JSON.parse(data);

          
          parsedReviews.push(newTip);

          
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedReviews, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated reviews!')
          );
        }
      });

      
    const response = {
      status: 'success',
      body: newTip,
    };

    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
});


app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);