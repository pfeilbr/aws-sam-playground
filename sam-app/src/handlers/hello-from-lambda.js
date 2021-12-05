/**
 * A Lambda function that returns a static string
 */

const l = (o) => {
    console.log(JSON.stringify(o, null, 2))
}

exports.helloFromLambdaHandler = async (event) => {
    // If you change this message, you will need to change hello-from-lambda.test.js
    l({event})
    const message = event.msg || 'Hello from Lambda!';

    // All log statements are written to CloudWatch
    console.info(`${message}`);
    
    return message;
}
