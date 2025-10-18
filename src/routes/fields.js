const express = require('express');
const cors = require('cors');
const router = express.Router();
const worldMapData = require('city-state-country');
const _ = require('loadsh');

// Apis
router.use(cors({
	origin:'*',
	methods:['GET'],
	optionsSuccessStatus:200
}));

router.get('/get-countries/', (req, res) => {
	res.send({
		count:_.size(worldMapData.getAllCountries()),
		results:[...worldMapData.getAllCountries()]
	});
});

router.get('/get-cities/:country', (req, res) => {
	const country = _.get(req, ['params', 'country']);
	res.send({
		count:_.size(worldMapData.getAllStatesFromCountry(country)),
		results:[...worldMapData.getAllStatesFromCountry(country)]
	});
});

router.get('/get-states/:city', (req, res) => {
	const city = _.get(req, ['params', 'city']);
	res.send({
		count:_.size(worldMapData.getAllCitiesFromState(city)),
		results:[...worldMapData.getAllCitiesFromState(city)]
	});
});

module.exports = router;
