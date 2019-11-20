var AWS = require('aws-sdk');
var s3 = new AWS.S3();      

exports.handler = async(event, context) => {
    var csvdata = "id,timestamp,keyword,sentiment" + String.fromCharCode(13);
    for(var i = 0; i < event.topics.length; i++) {
        csvdata += (event.id + "," + event.created_at + "," + event.topics[i] + "," + event.sentiment.Sentiment + String.fromCharCode(13));
    }
    var params = {
        Bucket: process.env.S3BucketForAnalytics,
        Key: (event.id + ".csv"),
        Body: csvdata
    };
    try {
        await s3.upload(params).promise();
    }
    catch (err) {
        console.log(err);
        return false;
    }
    console.log(csvdata);
    return true;
};