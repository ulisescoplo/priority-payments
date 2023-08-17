const fs = require('fs'); 
const axios = require('axios'); 

class PriorityConnector {
    constructor(endpointUrl) {
        this.endpointUrl = endpointUrl;
        this.token = null;
    }

    setClient(client) {
        this.client = client;
        return this;
    }

    async doPost(relativeUrl, headers, data) {
        try {
            const response = await this.doRequest('POST', relativeUrl, headers, data);
            console.log(response);
            return { result: response.data };
        } catch (error) {
            console.log('doPost'+error.message);
            //throw new Error('An error has occurred in Request.00');
        }
    }

    async doRequest(method, relativeUrl, headers, data) {
        headers = await this.addTokenToHeader(headers);
        
        const options = {
            headers: headers,
            //data: data
        };

        if (method.toUpperCase() === 'GET') {
            options.params = data;
         } else {
            options.data = data;

         } 

        try {
            const response = await this.client.request({
                method: method,
                url: this.endpointUrl + relativeUrl,
                ...options
            });

            return response.data;
        } catch (error) {
            console.log("doRequest Error: "+error.message);
            console.log(error.response.data.errors[0].errors);
            throw new Error("doRequest Error: "+error.message);
        }
    }

    async doGet(relativeUrl, headers, data) {
        
        try {
            const response = await this.doRequest('GET', relativeUrl, headers, data);
            return response;
            //return { result: response };
        } catch (error) {
            console.log(error);
            throw new Error('An error has occurred in Request doGet.');
        }
    }

    async checkToken() {
        const tokenFilePath = '/tmp/token'; 

        if (!fs.existsSync(tokenFilePath) || (Date.now() - fs.statSync(tokenFilePath).mtimeMs) > 600000) {
            const body = { value: process.env.PRIORITY_API_KEY };
            const headers = {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            };

            try {
                this.token = await this.client.request({
                    method: 'POST',
                    url: this.endpointUrl + '/security/v1/apiKey/authenticate',
                    headers: headers,
                    data: body
                }).then(function (response) {
                    const token = response.data.token;
                    fs.writeFileSync(tokenFilePath, token);
                    return token;
                  })
                  .catch(function (error) {
                    console.error(error.message);
                    throw new Error('An error has occurred endpoint authenticate. '+error.message);
                  });

            } catch (error) {
                console.error(error.message);
                throw new Error('An error has occurred getting the token.');
            }
        } else {
            this.token = fs.readFileSync(tokenFilePath, 'utf8');
            return this.token;
        }
    }

    async addTokenToHeader(headers) {
        await this.checkToken();
        headers['Authorization'] = 'Bearer ' + this.token;
        return headers;
    }
}

module.exports = PriorityConnector;
