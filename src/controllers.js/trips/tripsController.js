const Joi = require("joi");

const throwJsonError = require("../../errors/throwJsonError");
const createJsonError = require("../../errors/createJsonError");
const {
  findTrips,
  findTripsOrderByVotes,
} = require("../../repositories.js/tripsRepositories");

const schema = Joi.string().min(2).max(50);
const schema2 = Joi.number().positive();

const getTrips = async (req, res) => {
  try {
    const { query } = req;
    const { category, city, orderby } = query;

    await schema.validateAsync(category, city, orderby);

    if (!orderby) {
      const [trips, sql] = await findTrips(query);

      trips.sort((a, b) => {
        return b.ID - a.ID;
      });

      res.status(200);
      res.send(trips);
    } else {
      const tripsOrdered = await findTripsOrderByVotes(query);
      console.log(tripsOrdered);

      res.status(200);
      res.send(tripsOrdered);
    }
  } catch (error) {
    createJsonError(error, res);
  }
};
module.exports = getTrips;
