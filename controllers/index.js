module.exports = (app) => {
	require("./apiController")(app);
	require("./htmlController")(app)
};