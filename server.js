const express = require('express');
const cors = require('express-cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
const app = express();
const { coWorkers } = require('./co-workers.js');

app.locals.title = 'Co-Workers API';
app.locals.coWorkers = coWorkers

app.use(cors({
  allowedOrigins: ['localhost:3000']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/v1/coworkers', (req, res) => {
  res.status(200).json(app.locals.coWorkers);
});

app.post('/api/v1/coworkers', (req, res) => {
  const newCoWorker = req.body;

  for (let requiredParameter of ['id', 'image', 'name', 'role', 'location']) {
    if (!newCoWorker[requiredParameter]) {
      return res.status(422).json({
        message: `You are missing a required parameter of ${requiredParameter}`
      });
    }
  }

  app.locals.coWorkers = [...app.locals.coWorkers, { ...newCoWorker, status: false }];

  return res.status(201).json({id: newCoWorker.id});
});

app.delete('/api/v1/coworkers/:id', (req, res) => {
  const { id } = req.params;
  const match = app.locals.coWorkers.find(coworker => coworker.id == id);

  if (!match) {
    return res.status(404).json({
      message: `No co-worker found with an id of ${id}`
    });
  }

  const filteredCoWorkers = app.locals.coWorkers.filter(coworker => coworker.id != id);

  app.locals.coWorkers = filteredCoWorkers;

  return res.status(202).json(app.locals.coWorkers);
});

app.listen(port, () => {
  console.log(`${app.locals.title} is now running on ${port}!`)
});