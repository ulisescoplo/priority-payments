const PriorityPaymentsException = require('../exception/priority-exception'); 
const axios = require('axios');


class PriorityManager {
    constructor(connector) {
        this.connector = connector;
    }

    async request(suffix, data, method = 'POST') {
        const clientOptions = {};
                
        this.connector.setClient(axios.create(clientOptions));
        const doMethod = method.toUpperCase() === 'GET' ? 'doGet' : 'doPost';

        try {
            const response = await this.connector[doMethod](suffix, {
                'Content-Type': 'application/json'
                
            },data);

            return response;
        } catch (error) {
            console.error(error.message);
            throw new PriorityPaymentsException(error.message);
        }
    }
   
}

module.exports = PriorityManager;
