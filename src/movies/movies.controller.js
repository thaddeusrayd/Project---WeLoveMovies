const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { is_showing } = req.query;

  const data = is_showing
    ? await (await moviesService.listNowPlaying()).splice(0, 15)
    : await moviesService.list();

  res.status(200).json({ data: data });
}

function read(req, res) {
  const { movie: data } = res.locals;
  res.json({ data });
}

function movieExists(req, res, next) {
  moviesService
    .read(req.params.movieId)
    .then((movie) => {
      if (movie) {
        res.locals.movie = movie;
        return next();
      }
      next({ status: 404, message: `Movie cannot be found.` });
    })
    .catch(next);
}

async function getTheaters(req, res) {
  const data = await moviesService.getTheaters(res.locals.movie.movie_id);
  res.json({ data });
}

async function getReviews(req, res) {
  const data = await moviesService.getReviews(res.locals.movie.movie_id);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [movieExists, read],
  getTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(getTheaters),
  ],
  getReviews: [movieExists, asyncErrorBoundary(getReviews)],
};
