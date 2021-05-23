const { Storage } = require('@google-cloud/storage');
const { Readable } = require('stream');

let storage;
const bucketName = 'chrms';

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getChrmUrl = async (req, res) => {
  if (!storage) {
    storage = new Storage();
  }

  // Downloads the file
  try {
    console.log('req.body');
    console.log(req.body);
    console.log('req.body stringified');
    console.log(JSON.stringify(req.body));
    const fileName = req.body.id + '.html';
    const file = await storage.bucket(bucketName).file(fileName);
    const exists = await file.exists();

    if (!exists[0]) {
      const chunks = [];
      let fileString = '';
      const newUrl = 'https://storage.googleapis.com/chrms/' + fileName;
      const templateFile = await storage
        .bucket(bucketName)
        .file('template.html');
      await templateFile.copy(fileName, function (err, copiedFile) {
        copiedFile
          .createReadStream()
          .on('data', function (chunk) {
            chunks.push(chunk);
          })
          .on('end', function () {
            fileString = Buffer.concat(chunks).toString();

            const finalString = fileString
              .replace(/_TITLE_/g, req.body.title + ' - ' + req.body.artist)
              .replace('_SOURCE_URL_', newUrl)
              .replace('_IMAGE_URL_', req.body.coverUrl)
              .replace('_AUDIO_URL_', req.body.audioUrl);

            const stream = Readable.from(finalString);
            stream
              .pipe(copiedFile.createWriteStream())
              .on('error', function (err2) {
                console.log('error');
                console.log(err2);
              })
              .on('finish', function () {});
          });
      });

      return res.status(200).send(newUrl);
    }

    return res.status(200).send(file.publicUrl());
  } catch (err) {
    console.log(err);
    return res.status(500).send('Error');
  }
};
