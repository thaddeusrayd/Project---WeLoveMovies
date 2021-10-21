const theatersService = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const theatersList = await theatersService.list();
  const result = [];
  for (let i = 0; i < theatersList.length; i++) {
    const { theater_id } = theatersList[i];
    const movies = await theatersService.listTheatersWithMovies(theater_id);
    result.push({ ...theatersList[i], movies: movies });
  }
  res.status(200).json({ data: result });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
};
