const knex = require("../db/connection");

function read(review_id) {
  return knex("reviews").select("*").where({ review_id });
}

function update(updatedReview, review_id) {
  return knex("reviews")
    .select("*")
    .where({ review_id })
    .update(updatedReview)
    .then((updatedRecords) => updatedRecords[0]);
}

function getCritic(criticId) {
  return knex("critics").select("*").where({ critic_id: criticId }).select();
}

function destroy(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).del();
}

module.exports = {
  read,
  update,
  getCritic,
  destroy,
};
