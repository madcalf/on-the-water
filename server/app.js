const PORT = process.env.PORT || 9000;
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const chalk = require('chalk');
const app = express();
module.exports = app;

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', require('./api'));

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('File not found: ' + req.path);
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '..', 'public/index.html'))
);

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(chalk.red(err.message));
  if (err.status !== 404) console.error('STACK', err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

// =============== //
// Start the server
// =============== //
const init = async () => {
  try {
    app.listen(PORT, () => console.log(`Starting server on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

init();
