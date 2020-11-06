const mongodb = require('mongodb');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getChrms = (req, res) => {
  mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
    const filter = {};

    if (req.query.filter != null && req.query.filter !== "") {
      const filterTerms = req.query.filter.toLowerCase().trim().split(" ");
      filter.keywords = {
        "$in": filterTerms
      }
    }

    const col = client.db('chrmr').collection('chrms');
          
    col.find(filter).toArray(function(err, items) {
      client.close();
      res.status(200).send(items);
    });
  });
};
