const AWS = require("aws-sdk")
const uuid = require("uuid");

const l = (o) => {
    console.log(JSON.stringify(o, null, 2))
}

exports.helloFromLambdaHandler = async (event) => {
    l({event, env: process.env})
    const bucketName = process.env.S3_BUCKET_NAME

    if (bucketName) {
        const s3 = new AWS.S3()
        await s3.putObject({Bucket: bucketName, Key: `${uuid.v4()}`}).promise()
        const resp = await s3.listObjectsV2({Bucket: bucketName}).promise()
        l({resp});
    }

    const message = event.msg || 'Hello from Lambda!';
    console.info(`${message}`);
    return message;
}
