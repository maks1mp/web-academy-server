class Responses {
    static success(data = {}) {
        return {
            status: 'ok',
            code: 200,
            ...data
        };
    }

    static error(data = {}) {
        return {
            status: 'error',
            ...data
        };
    }
}

module.exports = Responses;