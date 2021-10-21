const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const match = await reviewsService.read(reviewId);
  if (match.length === 0 || !reviewId)
    return next({ status: 404, message: "Review cannot be found." });
  res.locals.review = match[0];

  next();
}

function hasRequiredFields(req, res, next) {
  const { data: { score = null, content = null } = {} } = req.body;
  let updateObj = {};
  if (!score && !content)
    return next({ status: 400, message: "Missing score or content in body" });
  if (score) updateObj.score = score;
  if (content) updateObj.content = content;
  res.locals.update = updateObj;
  next();
}

async function update(req, res) {
  const { critic_id, review_id } = res.locals.review;
  const update = res.locals.update;
  await reviewsService.update(update, review_id);
  const updatedReview = await reviewsService.read(review_id);
  const critic = await reviewsService.getCritic(critic_id);
  res.status(200).json({ data: { ...updatedReview[0], critic: critic[0] } });
}

async function destroy(req, res) {
  const { review_id } = res.locals.review;
  await reviewsService.destroy(review_id);
  res.sendStatus(204);
}

module.exports = {
  update: [
    asyncErrorBoundary(reviewExists),
    hasRequiredFields,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
