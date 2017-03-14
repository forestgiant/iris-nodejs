/*jshint esversion: 6 */
const iris_client = require('./api.js');

var handler = function(update){
    console.log('Received:', update);
};

function encode(value) {
    return Buffer.from(value).toString('base64');
}

function decode(value) {
    return Buffer.from(value, 'base64').toString();
}

function main() {
    var client = new iris_client(iris_client.defaultIrisAddress, iris_client.defaultIrisServerName, "client.crt", "client.key", "ca.crt");
    client.connect().then(function(connectResponse){
        console.log('Session: ', connectResponse.session);
        return client.subscribe('company', handler);
    }).then(function(subscribeResponse){
        console.log('SubscribeResponse: ', subscribeResponse);
        return client.subscribeKey('company', 'dev', handler);
    }).then(function(subscribeKeyResponse){
        console.log('SubscribeKeyResponse: ', subscribeKeyResponse);
        var encodedDev = encode('stephan');
        return client.setValue('company', 'dev', encodedDev);
    }).then(function(setResponse){
        var decodedSetDevResponse = decode(setResponse.value);
        console.log('SetValueResponse: ', decodedSetDevResponse) ;
        var encodedDesigner = encode('rich');
        return client.setValue('company', 'designer', encodedDesigner);
    }).then(function(setResponse){
        var decodedSetDesignerResponse = decode(setResponse.value);
        console.log('SetValueResponse: ', decodedSetDesignerResponse);
        return client.getValue('company', 'designer');
    }).then(function(getResponse){
        var decodedGetDesignerResponse = decode(getResponse.value);
        console.log('GetValueResponse: ', decodedGetDesignerResponse);
        return client.getSources();
    }).then(function(sources){
        console.log('Sources: ', sources);
        return client.getKeys('company');
    }).then(function(keys){
        console.log('Keys: ', keys);
        return client.removeValue('company', 'designer');
    }).then(function(removeValueResponse){
        console.log('RemoveValueResponse: ', removeValueResponse);
        return client.removeSource('company');
    }).then(function(removeSourceResponse){
        console.log('RemoveSourceResponse: ', removeSourceResponse);
        return client.unsubscribe('company', handler);
    }).then(function(unsubscribeResponse){
        console.log('UnsubscribeResponse: ', unsubscribeResponse);
        return client.unsubscribeKey('company', 'dev', handler);
    }).then(function(unsubscribeKeyResponse){
        console.log('UnsubscribeKeyResponse: ', unsubscribeKeyResponse);
        client.close();
    }).catch(function(error){
        console.log(error);
        client.close();
    });
}

main();