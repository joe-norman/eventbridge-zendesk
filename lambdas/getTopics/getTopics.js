var AWS = require('aws-sdk');
var comprehend = new AWS.Comprehend({apiVersion: '2017-11-27'});   

exports.handler = async(event, context) => {
    const allText = event.raw_subject + "\n" + event.description;
    var params =    {  LanguageCode: 'en', /* required */
                        Text: allText /* required */
    }
    try {
        var data = await comprehend.detectKeyPhrases(params).promise();
        //var entities = await comprehend.detectEntities(params).promise();

        //Write keywords to ticket data in Step Function
        event.keywords = [];
        for(var i = 0; i < data.KeyPhrases.length; i++) {
           event.keywords.push(data.KeyPhrases[i].Text);
        }
        // for(var i = 0; i < entities.Entities.length; i++) {
        //     event.keywords.push(entities.Entities[i].Text);
        //  }
        console.log(event.keywords);
    }
    catch (err) {
        console.log(err);
        return err;
    }
    console.log(data);
    return event.keywords;
};