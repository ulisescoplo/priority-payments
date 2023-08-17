const PriorityPayments = require('./priority-payments/facade/priority-payments');

exports.handler = async function(event, context) {
    
    let test = new PriorityPayments();
    console.log(event);
    console.log(context);
    response = await test.getInstitution().then((result) => {
        
    
        const response = {
            statusCode: 200,
            body: JSON.stringify(result)
          };
          
          return response;
    });
    
    console.log('end');
    
    return response;

}
