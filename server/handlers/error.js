// Error Handler
exports.notFound = (req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
}

exports.errors = (err, req, res, next) => {
    res.status(err.status || 400).json({
        message: err.message || 'Something went wrong'
    });
};