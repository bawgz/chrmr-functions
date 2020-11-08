const mongodb = require('mongodb');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getChrms = async (req, res) => {

  const filter = {};

  if (req.query.filter != null && req.query.filter !== '') {
    const filterTerms = req.query.filter.toLowerCase().trim().split(' ');
    filter.keywords = {
      $in: filterTerms,
    };
  }

  const db = await mongodb.MongoClient.connect(process.env.MONGODB_URI);
  const collection = await db.db('chrmr').collection('chrms');
  const chrms =  await collection.find(filter).toArray();
  res.status(200).send(chrms);
};
