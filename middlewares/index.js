function notFound(req, res, next) {
    res.status(404).send({error: 'Url not found', status: 404, url: req.url});
  }
  
function errorHandler(err, req, res, next) {
    console.error('ERROR', err);
    res.status(500)
        .send({error: err, url: req.url, status: 500});
}

module.exports = {notFound, errorHandler};