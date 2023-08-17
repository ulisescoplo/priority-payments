//const { LoggerInterface } = require('your-logger-library'); // Replace with the actual logger library you're using
const PriorityService = require('../services/priority-service'); // Replace with the actual PriorityService module
const {} = require('../env.js');

class PriorityPayments {
    static MODULE_VERSION = '1.0.0';

    getVersion() {
        return PriorityPayments.MODULE_VERSION;
    }

    setLogger(logger) {
        PriorityService.getInstance().setLogger(logger);
    }

    getInstitution() {
        return PriorityService.getInstance().getInstitution();
    }

    addPaymentData(data) {
        return PriorityService.getInstance().addPaymentData(data);
    }

    addPayment(paymentNo, supplierId, supplierName, invoices) {
        return PriorityService.getInstance().addPayment(paymentNo, supplierId, supplierName, invoices);
    }

    getPifStatus(fileName) {
        return PriorityService.getInstance().getPifStatus(fileName);
    }

    getPayment(id) {
        return PriorityService.getInstance().getPayment(id);
    }
}

module.exports = PriorityPayments;
