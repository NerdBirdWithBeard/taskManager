function sendNormalized (res, result, successMessage, fallbackStatus = 400, fallbackMessage = 'Invalid data') {
    // result = normalizeResult(result);
    if (
        result === null ||
        (typeof result === 'object' && (
        (Array.isArray(result) && result.length === 0) ||
        (Object.keys(result).length === 0 && result.constructor === Object)
        ))
    ) {
        result = null;
    }
    if (result) {
        res.json({ message: successMessage, result });
    } else {
        res.status(fallbackStatus).json({ error: fallbackMessage });
    }
};

module.exports = sendNormalized;