/*jshint esversion: 6 */
const test = require('tape');
const iris_api = require('./api.js');
const messages = require('./iris_pb.js');
const textEncoding = require('text-encoding');

const irisAddress = iris_api.defaultIrisAddress;
const testSource = 'fg-iris-nodejs-test-source1';
const testSource2 = 'fg-iris-nodejs-test-source2';

function encode(value) {
    return new textEncoding.TextEncoder('utf-8').encode(value);
}

function decode(value) {
    return new textEncoding.TextDecoder('utf-8').decode(value);
}

test('Test client', (t) => {
    const client = new iris_api(irisAddress, '');
    t.equal(client.serverAddress, irisAddress);
    t.notEqual(client.creds, null);
    t.notEqual(client.sourceHandlers, null);
    t.notEqual(client.keyHandlers, null);
    t.equal(client.connected, false);
    client.close();
    t.end();
});

test('Test connect', (t) => {
    const client = new iris_api(irisAddress, '');
    client.connect().then(() => {
        t.notEqual(client.rpc, null);
        t.notEqual(client.session, null);
        t.notEqual(client.listener, null);
        t.equal(client.connected, true);
        client.close();
        t.equal(client.listener, null);
        t.equal(client.rpc, null);
        t.equal(client.serverAddress, null);
        t.equal(client.creds, null);
        t.equal(client.sourceHandlers, null);
        t.equal(client.keyHandlers, null);
        t.equal(client.connected, false);
        t.end();
    }, (error) => {
        client.close();
        t.end(error);
    });
});

test('Test set/get/remove', (t) => {
    const client = new iris_api(irisAddress, '');
    
    client.connect().then(()=>{
        return client.setValue(testSource, 'key1', encode('value1'));
    }).then((response) => {
        return client.setValue(testSource, 'key2', encode('value2'));
    }).then((response) => {
        return client.setValue(testSource2, 'key1', encode('value1'));
    }).then((response) => {
        return client.getValue(testSource, 'key1');
    }).then((response) => {
        t.equal(decode(response.value), 'value1');
        return client.getValue(testSource, 'key2');
    }).then((response) => {
        t.equal(decode(response.value), 'value2');
        return client.getValue(testSource2, 'key1');
    }).then((response) => {
        t.equal(decode(response.value), 'value1');
        return client.getSources();
    }).then((sources) => {
        t.equal(sources.length, 2);
        t.notEqual(sources.indexOf(testSource), -1);
        t.notEqual(sources.indexOf(testSource2), -1);
        return client.getKeys(testSource);
    }).then((keys) => {
        t.equal(keys.length, 2);
        t.notEqual(keys.indexOf('key1'), -1);
        t.notEqual(keys.indexOf('key2'), -1);
        return client.getKeys(testSource2);
    }).then((keys) => {
        t.equal(keys.length, 1);
        t.notEqual(keys.indexOf('key1'), -1);
        t.equal(keys.indexOf('key2'), -1);
        t.end();
        client.close();
    }).catch((error) => {
        t.end(error);
        client.close();
    });
});

test('Test subscribe', (t) => {
    const client = new iris_api(irisAddress, '');
    var handlerCallCount = 0;
    var otherHandlerCallCount = 0;
    var expectedHandlerCallCount = 5;
    var handlerCallCountReached = false;
    var expectedOtherHandlerCallCount = 3;
    var otherHandlerCallCountReached = false;

    var testTimeout = setTimeout(function(){
        testTimeout = null;
        t.fail(new Error('Test timeout reached before completion.'));
        finish();
    }, 1000);

    var finish = function(error) {
        clearTimeout(testTimeout);
        testTimeout = null;
        client.unsubscribe(testSource, handler);
        client.close();
        t.equal(handlerCallCount, expectedHandlerCallCount);
        t.equal(otherHandlerCallCount, expectedOtherHandlerCallCount);

        t.end(error);
    };

    var checkCallCounts = function(){
        if (handlerCallCount == expectedHandlerCallCount &&
            otherHandlerCallCount == expectedOtherHandlerCallCount) {
            finish();
        }
    };

    var handler = function(update) {
        handlerCallCount++;
        checkCallCounts();
    };
    
    
    var otherHandler = function(update) {
        otherHandlerCallCount++;
        checkCallCounts();
    };

    resume = function() {
        client.unsubscribe(testSource, otherHandler)
        .then((response) => {       
            return client.setValue(testSource, 'key1', 'value1');
        }).then((response) => {            
            client.setValue(testSource, 'key1', 'value1');
        }).catch((error) => {
            finish(error);
        });
    };

    client.connect().then(() => {
        return client.subscribe(testSource, handler);
    }).then((response) => {
        return client.subscribe(testSource, otherHandler);
    }).then((response) => {
        return client.setValue(testSource, 'key1', 'value1');
    }).then((response) => {            
        return client.setValue(testSource, 'key2', 'value2');
    }).then((response) => {            
        return client.setValue(testSource, 'key1', 'value1');
    }).then((response) => {     
        setTimeout(resume, 100);
    }).catch((error) => {
        finish(error);
    });
});

test('Test subscribeKey', (t) => {
    const client = new iris_api(irisAddress, '');
    var handlerCallCount = 0;
    var otherHandlerCallCount = 0;
    var expectedHandlerCallCount = 5;
    var handlerCallCountReached = false;
    var expectedOtherHandlerCallCount = 3;
    var otherHandlerCallCountReached = false;

    var testTimeout = setTimeout(function(){
        testTimeout = null;
        t.fail(new Error('Test timeout reached before completion.'));
        finish();
    }, 1000);

    var finish = function(error) {
        clearTimeout(testTimeout);
        testTimeout = null;

        client.unsubscribeKey(testSource, 'key1', handler);
        client.close();

        t.equal(handlerCallCount, expectedHandlerCallCount);
        t.equal(otherHandlerCallCount, expectedOtherHandlerCallCount);
        t.end(error);
    };

    var checkCallCounts = function(){
        if (handlerCallCount == expectedHandlerCallCount &&
            otherHandlerCallCount == expectedOtherHandlerCallCount) {
            finish();
        }
    };

    var handler = function(update) {
        handlerCallCount++;
        checkCallCounts();
    };
    
    
    var otherHandler = function(update) {
        otherHandlerCallCount++;
        checkCallCounts();
    };

    resume = function() {
        client.unsubscribeKey(testSource, 'key1', otherHandler)
        .then((response) => {       
            return client.setValue(testSource, 'key1', 'value4');
        }).then((response) => {            
            return client.setValue(testSource, 'key1', 'value5');
        }).catch((error) => {
            finish(error);
        });
    };

    client.connect().then(() => {
        return client.subscribeKey(testSource, 'key1', handler);
    }).then((response) => {
        return client.subscribeKey(testSource, 'key1', otherHandler);
    }).then((response) => {
        return client.setValue(testSource, 'key1', 'value1');
    }).then((response) => {            
        return client.setValue(testSource, 'key1', 'value2');
    }).then((response) => {            
        return client.setValue(testSource, 'key1', 'value3');
    }).then((response) => {     
        return client.setValue(testSource, 'key2', 'value3');
    }).then((response) => {     
        return client.setValue(testSource2, 'key1', 'value3');
    }).then((response) => {     
        setTimeout(resume, 100);
    }).catch((error) => {
        finish(error);
    });
});

test('Test remove source', (t) => {
    const client = new iris_api(irisAddress, '');
    client.connect().then((response) => {
        return client.setValue(testSource, 'key1', 'value1');
    }).then((response) => {
        return client.setValue(testSource, 'key2', 'value2');
    }).then((response) => {
        return client.setValue(testSource2, 'key1', 'value1');
    }).then((response) => {
        return client.removeSource(testSource);
    }).then((response) => {
        return client.getValue(testSource, 'key1');
    }).then((response) => {
        t.equal(response.value, '');
        return client.getValue(testSource, 'key2');
    }).then((response) => {
        t.equal(response.value, '');
        return client.removeSource(testSource2);
    }).then((response) => {
        return client.getValue(testSource2, 'key1');
    }).then((response) => {
        t.equal(response.value, '');
        t.end();
        client.close();
    }).catch((error) => {
        t.end(error);
        client.close();
    });
});

test('Test remove value', (t) => {
    const client = new iris_api(irisAddress, '');
    client.connect().then((response) => {
        return client.setValue(testSource, 'key1', encode('value1'));
    }).then((response) => {
        return client.setValue(testSource, 'key2', encode('value2'));
    }).then((response) => {
        return client.removeValue(testSource, "key1");
    }).then((response) => {
        return client.getValue(testSource, 'key1');
    }).then((response) => {
        t.equal(response.value, '');
        return client.getValue(testSource, 'key2');
    }).then((response) => {
        t.equal(decode(response.value), 'value2');
        t.end();
        client.close();
    }).catch((error) => {
        t.end(error);
        client.close();
    });
});

test('Cleanup', (t) => {
    const client = new iris_api(irisAddress, '');
    client.connect().then(()=>{
        return client.getSources();
    }).then((sources) => {
        if(sources) {
            sources.forEach((source) => {
                client.removeSource(source).then((response) => {
                    // source was removed
                }, (error) => {
                    t.error(error);
                });
            });
        }
        client.close();
        t.end();
    }).catch((error) => {
        client.close();
        t.end(error);
    });
});