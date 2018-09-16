class DBResponseParser {
    static status(bool) {
        return {status: bool ? 'success' : 'error'};
    }

    static data(data) {
        return {response: data};
    }
}

module.exports = DBResponseParser;