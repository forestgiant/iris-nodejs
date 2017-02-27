/*jshint esversion: 6 */
const iris_client = require("./api.js");
const textEncoding = require('text-encoding');

var handleUpdate = function(update){
    console.log("Received:", update);
};

function main() {
    var client = new iris_client("127.0.0.1:32000", "");
    client.connect().then(function(connectResponse){
        console.log("Session: ", connectResponse.session);
        return client.subscribe("company", handleUpdate);
    }).then(function(subscribeResponse){
        console.log("SubscribeResponse: ", subscribeResponse);
        return client.subscribeKey("company", "dev", handleUpdate);
    }).then(function(subscribeKeyResponse){
        console.log("SubscribeKeyResponse: ", subscribeKeyResponse);
        var encodedDev = new textEncoding.TextEncoder("utf-8").encode("stephan");
        return client.setValue("company", "dev", encodedDev);
    }).then(function(setResponse){
        var decodedSetDevResponse = new textEncoding.TextDecoder('utf-8').decode(setResponse.value);
        console.log("SetValueResponse: ", decodedSetDevResponse) ;
        var encodedDesigner = new textEncoding.TextEncoder("utf-8").encode("rich");
        return client.setValue("company", "designer", encodedDesigner);
    }).then(function(setResponse){
        var decodedSetDesignerResponse = new textEncoding.TextDecoder('utf-8').decode(setResponse.value);
        console.log("SetValueResponse: ", decodedSetDesignerResponse);
        return client.getValue("company", "designer");
    }).then(function(getResponse){
        var decodedGetDesignerResponse = new textEncoding.TextDecoder('utf-8').decode(getResponse.value);
        console.log("GetValueResponse: ", decodedGetDesignerResponse);
        return client.getSources();
    }).then(function(sources){
        console.log("Sources: ", sources);
        return client.getKeys("company");
    }).then(function(keys){
        console.log("Keys: ", keys);
        return client.removeValue("company", "designer");
    }).then(function(removeValueResponse){
        console.log("RemoveValueResponse: ", removeValueResponse);
        return client.removeSource("company");
    }).then(function(removeSourceResponse){
        console.log("RemoveSourceResponse: ", removeSourceResponse);
        return client.unsubscribe("company", handleUpdate);
    }).then(function(unsubscribeResponse){
        console.log("UnsubscribeResponse: ", unsubscribeResponse);
        return client.unsubscribeKey("company", "dev", handleUpdate);
    }).then(function(unsubscribeKeyResponse){
        console.log("UnsubscribeKeyResponse: ", unsubscribeKeyResponse);
        client.close();
    }).catch(function(error){
        console.log(error);
    });
}
main();