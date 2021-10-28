const PORT = process.env.PORT || 9000;
const app = require('./app');

const init = async () => {
  try {
    app.listen(PORT, () => console.log(`Starting server on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

init();
