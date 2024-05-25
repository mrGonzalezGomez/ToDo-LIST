const notFound = (req, res, next) => {
    console.error(`NotFound: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: 'Route not found' });
};

module.exports = notFound;
