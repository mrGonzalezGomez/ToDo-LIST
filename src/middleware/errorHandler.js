const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.type === 'authorization') {
        res.status(401).json({ msg: err.message || "No token, authorization denied" });
    } else if (err.type === 'not_found') {
        res.status(404).json({ msg: err.message || "Not found" });
    } else if (err.type === 'bad_request') {
        res.status(400).json({ msg: err.message || "Bad parameter" });
    } else {
        res.status(500).json({ msg: err.message || "Internal server error" });
    }
};

module.exports = errorHandler;
