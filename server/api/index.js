const router = require('express').Router();
const axios = require('axios');
module.exports = router;

router.get(
  '/currents/:stationId/:dateStr/:rangeStr/:interval',
  async (req, res, next) => {
    // do the NOAA request here
    const { stationId, dateStr, rangeStr, interval } = req.params;
    const requestUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr}&range=${rangeStr}&station=${stationId}&product=currents_predictions&time_zone=lst_ldt&interval=${interval}&units=english&format=json`;

    // console.log('REQUEST: ', requestUrl);
    try {
      const { data } = await axios.get(requestUrl);
      console.log(data);
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

router.use((req, res, next) => {
  const error = new Error('Nothing to see at this path: ' + req.path);
  error.status = 404;
  next(error);
});
