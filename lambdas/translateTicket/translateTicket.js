var AWS = require('aws-sdk');
var translate = new AWS.Translate();   

exports.handler = async(event, context) => {
    var sparams = {
        SourceLanguageCode: 'auto', /* required */
        TargetLanguageCode: 'en', /* required */
        Text: event.raw_subject, /* required */
    };
    var dparams = {
        SourceLanguageCode: 'auto', /* required */
        TargetLanguageCode: 'en', /* required */
        Text: event.description, /* required */
    };

    event.original_subject = event.raw_subject;
    event.original_description = event.description;
    event.original_language = "en";

    try {
        await translate.translateText(sparams).promise().then((result) => {
            console.log(result);
            if (result.SourceLanguageCode == "en") {
                return event;
            }
            else {
                event.raw_subject = result.TranslatedText;
                event.original_language = result.SourceLanguageCode;
            }
        });
        await translate.translateText(dparams).promise().then((result) => {
            console.log(result);
            if (!(result.SourceLanguageCode == "en")) {
                event.description = result.TranslatedText;
            }
        });
    }
    catch (err) {
        console.log(err);
        return err;
    }
    console.log("successful translation");
    return event;
};