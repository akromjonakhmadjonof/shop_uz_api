const always_valid = (req, res, next) => {
	return next();
};

module.exports = always_valid;
