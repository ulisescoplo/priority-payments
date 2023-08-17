class PriorityPaymentsException extends Error {
    constructor(message = '', code = 0) {
        super(message);
        this.name = 'PriorityPaymentsException';
        this.code = code;
    }
}

module.exports = PriorityPaymentsException;
