const { Storage } = require('@google-cloud/storage');

let storage;
const bucketName = 'chrms';

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getFile = async (req, res) => {

  if (!storage) {
    storage = new Storage();
  }

  // Downloads the file
  try {
    const file = await storage.bucket(bucketName).file(req.params[0]);
    const exists = await file.exists();

    if (!exists[0]) {
      return res.status(404).send('not found');
    }

    return file.createReadStream().pipe(res);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Error');
  }
};
