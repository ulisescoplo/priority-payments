//const RequestMaker = require('request-maker'); // Replace with the actual request-maker library you're using
const PriorityConnector = require('../connector/priority-connector'); 
const PriorityManager = require('../services/priority-manager'); 
const PriorityPaymentsException = require('../exception/priority-exception'); 



class PriorityService {
    constructor() {
        const url = process.env.PRIORITY_API_TESTING_ENV ? process.env.PRIORITY_API_ENDPOINT_URL_TEST : process.env.PRIORITY_API_ENDPOINT_URL;
        this.manager = new PriorityManager(new PriorityConnector(url));
    }

    async getRequest(relativeURI, data, method) {

        try {
            return await this.manager.request(relativeURI, data, method);
        } catch (error) {
            throw new PriorityPaymentsException(error.message);
        }
    }

    generate_string(input, strength = 16) {
        const input_length = input.length;
        let random_string = '';
    
        for (let i = 0; i < strength; i++) {
            const random_character = input[Math.floor(Math.random() * input_length)];
            random_string += random_character;
        }
    
        return random_string;
    }
    
    generateTransactionId() {
        const permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyz';
        const transactionId =
            this.generate_string(permitted_chars, 8) + '-' +
            this.generate_string(permitted_chars, 4) + '-' +
            this.generate_string(permitted_chars, 4) + '-' +
            this.generate_string(permitted_chars, 4) + '-' +
            this.generate_string(permitted_chars, 12);
        
        return transactionId;
    }
  

    async getInstitution(id = null) {
        const relativeURI = '/institution/v1/institution' + (id === null ? '' : `/${id}`);
        const data = {};
        const method = 'GET';
        
        try {
            const response = await this.getRequest(relativeURI, data, method);
            
            return response;
        } catch (error) {
            console.log(error.message);
            throw new PriorityPaymentsException(error.message);
        }
    }

    async addPaymentData(data = []) {
        const relativeURI = '/payment/v1/pifTransactions/json';
        const method = 'POST';
    
        try {
            const response = await this.getRequest(relativeURI, data, method);
            return response;
        } catch (error) {
            throw new PriorityPaymentsException(error.message);
        }
    }

    async addPayment(paymentNo, supplierId, supplierName, invoices) {
        const relativeURI = '/payment/v1/pifTransactions/json';
        const method = 'POST';
        
        const data = {
            nid: process.env.PRIORITY_NETWORK_ID,
            fid: process.env.PRIORITY_INSTITUTION_ID,
            buyerId: process.env.PRIORITY_BUYER_ID,
            supplierId,
            supplierName,
            reference1: paymentNo,
            fileDate: new Date().toISOString().split('T')[0],
            transactionId: this.generateTransactionId(),
            amount: invoices.reduce((total, invoice) => total + invoice.total, 0),
        };
    
        if (data.amount > 0) {
            data.invoiceNumbers = invoices.map(invoice => invoice.number);
            data.invoiceDates = invoices.map(invoice => invoice.date);
            data.invoiceAmounts = invoices.map(invoice => invoice.amount);
            data.invoiceTotalDues = invoices.map(invoice => invoice.total);
            data.invoiceDescriptions = invoices.map(invoice => invoice.description);
            data.invoiceDiscountAmounts = invoices.map(invoice => invoice.discount || 0);
        }
    
        const requestData = [data];
    
        try {
            const response = await this.getRequest(relativeURI, requestData, method);
            return response;
        } catch (error) {
            throw new PriorityPaymentsException(error.message);
        }
    }

    async getPifStatus(fileName = null) {
        if (!fileName) {
            throw new Error("File Name cannot be empty");
        }
    
        const relativeURI = '/file/v1/file';
        const data = { search: fileName };
        const method = 'GET';
    
        try {
            const pif = await this.getRequest(relativeURI, data, method);
            
            if (pif.totalRecords > 0) {
                return pif.records[0];
            } else {
                throw new Error(`File with File Name ${fileName} not found`);
            }
        } catch (error) {
            throw new PriorityPaymentsException(error.message);
        }
    }

    async getPayment(id = null) {
        if (!id) {
            throw new Error("Payment id cannot be empty");
        }
    
        const relativeURI = `/payment/v1/payment/${id}`;
        const data = {};
        const method = 'GET';
    
        try {
            const payment = await this.getRequest(relativeURI, data, method);
            
            if (!payment.message) {
                return payment;
            } else {
                throw new Error(`Payment with id ${id} not found: ${payment.message}`);
            }
        } catch (error) {
            throw new PriorityPaymentsException(error.message);
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new PriorityService();
        }
        return this.instance;
    }
}

module.exports = PriorityService;
