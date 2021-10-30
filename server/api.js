const router = require('express').Router();
const axios = require('axios');
module.exports = router;

router.get(
  '/currents/:stationId/:dateStr/:rangeStr/:interval',
  async (req, res, next) => {
    const { stationId, dateStr, rangeStr, interval } = req.params;
    const requestUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr}&range=${rangeStr}&station=${stationId}&product=currents_predictions&time_zone=lst_ldt&interval=${interval}&units=english&format=json`;

    try {
      const { data } = await axios.get(requestUrl);
      res.json(data);
    } catch (err) {
      // report the NOAA request error, not the axios error
      const e = new Error(
        `Failed to get currents for station ${stationId}: ${err.response.data.error.message}`
      );
      next(e);
    }
  }
);

router.get(
  '/tides/:stationId/:dateStr/:rangeStr/:interval',
  async (req, res, next) => {
    const { stationId, dateStr, rangeStr, interval } = req.params;

    const requestUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr}&range=${rangeStr}&station=${stationId}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=${interval}&units=english&format=json`;

    try {
      const { data } = await axios.get(requestUrl);
      res.json(data);
    } catch (err) {
      // report the NOAA request error, not the axios error
      const e = new Error(
        `Failed to get tide data for station ${stationId}: ${err.response.data.error.message}`
      );
      next(e);
    }
  }
);

router.use((req, res, next) => {
  const error = new Error('Nothing to see at this path: ' + req.path);
  error.status = 404;
  next(error);
});

console.log('server/api/index.js 2');
