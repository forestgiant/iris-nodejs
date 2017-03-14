/*jshint esversion: 6 */
const messages = require('./iris_pb.js');
const services = require('./iris_grpc_pb.js');
const grpc = require('grpc');
const fs = require('fs');

const defaultIrisAddress = '127.0.0.1:32000';
const errClientNotConnected = new Error('The client must be connected before it can be used to send requests to the server.');

/**
   * Creates a new iris client used to communicate with an iris server via gRPC.
   * @param {string} serverAddress - IPv4 and Port of the stela server you want to communicate with.
   * @param {string} serverName - Common name of the server you want to communicate with.
   * @param {string} certFile - Certificate file used to encrypt gRPC communication.
   * @param {string} keyFile - Private key file used to encrypt gRPC communication.
   * @param {string} caFile - Certificate Authority file used for gRPC communication.
   * @constructor
   */
class IrisClient {
    constructor(serverAddress, serverName, certFile, keyFile, caFile) {
        this.serverAddress = serverAddress;
        if (!certFile || certFile.length === 0) {
            this.creds = grpc.credentials.createInsecure();
        } else {
            this.creds = grpc.credentials.createSsl(
                fs.readFileSync(caFile), 
                fs.readFileSync(keyFile), 
                fs.readFileSync(certFile)
            );
        }

        this.sourceHandlers = new Map();
        this.keyHandlers = new Map();
        this.connected = false;
        this.listener = null;
        this.rpc = null;
    }

    /**
     * connect creates a unidirectional stream from the gRPC to this client. 
     * @param {function} errorCallback Called when there is an error with the gRPC server stream.
     * @return {Promise} A promised object that contains the session identifier.
     */
    connect(errorCallback) {
        return new Promise((resolve, reject) => {
            if (this.serverAddress.length === 0) {
                reject(Error('You must provide a server address to connect to.'));
                return;
            }

            this.rpc = new services.IrisClient(this.serverAddress, this.creds);
            const connectReq = new messages.ConnectRequest();
            this.rpc.connect(connectReq, (err, response) => {
                if (err) {
                    reject(Error('Failed to connect to Iris server at ' + this.serverAddress));
                    return;
                } else {
                    this.session = response.getSession();
                    var request = new messages.ListenRequest();
                    request.setSession(this.session);
                    this.listener = this.rpc.listen(request);

                    this.listener.on('data', response => {
                        var update = {
                            source: response.getSource(),
                            key: response.getKey(),
                            value: response.getValue(),
                        };
                        
                        var shs = [], khs = [];
                        if (this.sourceHandlers && update.source) {
                            shs = this.sourceHandlers[update.source];

                            if (this.keyHandlers && this.keyHandlers[update.source] && update.key) {
                                khs = this.keyHandlers[update.source][update.key];
                            }
                        }
                        
                        if(shs) {
                            shs.forEach(handler => {
                                handler(update);
                            });
                        }

                        if(khs) {
                            khs.forEach(handler => {
                                handler(update);
                            });
                        }
                    });

                    this.listener.on('error', err => {
                        if (errorCallback) {
                            errorCallback(err);
                        }
                    });
                    
                    this.connected = true;
                    resolve({'session':this.session});
                    return;
                }  
            });
        });
    }

    /**
     * close will clean up the stream from the listen gRPC and null out some variables the client uses.
     */
    close() {
        if (this.listener) {
            this.listener.cancel();
            this.listener = null;
        }
        
        this.rpc = null;
        this.serverAddress = null;
        this.creds = null;
        this.session = null;
        this.sourceHandlers = null;
        this.keyHandlers = null;
        this.connected = false;
    }

    /**
     * setValue will make a gRPC request to set the value for the given key on the specified source.
     * @param {string} source The name of the source to use.
     * @param {string} key The name of the key you wish to set. 
     * @param {!(string|Uint8Array)} value The data you wish to store.
     * @return {Promise} A promised object that contains the value that was set.
     */
    setValue(source, key, value) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(errClientNotConnected);
            }

            const setReq = new messages.SetValueRequest();
            setReq.setSession(this.session);
            setReq.setSource(source);
            setReq.setKey(key);
            setReq.setValue(value);
            this.rpc.setValue(setReq, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        'value':response.getValue()
                    });
                }
            });
        });
    }

    /**
     * getValue will make a gRPC request to retrieve the value for the given key on the specified source.
     * @param {string} source The name of the source to use.
     * @param {string} key The name of the key you wish to set. 
     * @return {Promise} A promised object that contains the returned value.
     */
    getValue(source, key) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(errClientNotConnected);
            }

            const getReq = new messages.GetValueRequest();
            getReq.setSession(this.session);
            getReq.setSource(source);
            getReq.setKey(key);
            this.rpc.getValue(getReq, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        'value':response.getValue()
                    });
                }
            });
        });
    }

    /**
     * removeValue will make a gRPC request to remove the key-value pair for the given key on the specified source.
     * @param {string} source The name of the source to use.
     * @param {string} key The name of the key you wish to set. 
     * @return {Promise} A promised object that contains the session identifier as well as the source and key of the removed value.
     */
    removeValue(source, key) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(errClientNotConnected);
            }

            const removeReq = new messages.RemoveValueRequest();
            removeReq.setSession(this.session);
            removeReq.setSource(source);
            removeReq.setKey(key);
            this.rpc.removeValue(removeReq, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        'session':response.getSession(),
                        'source':response.getSource(),
                        'key':response.getKey()
                    });
                }
            });
        });
    }

    /**
     * removeSource will make a gRPC request to remove the source and any key-value pairs contained within it.
     * @param {string} source The name of the source to use.
     * @return {Promise} A promised object that contains the session identifier as well as the identifier of the removed source.
     */
    removeSource(source) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(errClientNotConnected);
            }

            const removeReq = new messages.RemoveSourceRequest();
            removeReq.setSession(this.session);
            removeReq.setSource(source);
            this.rpc.removeSource(removeReq, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        'session':response.getSession(),
                        'source':response.getSource()
                    });
                }
            });
        });
    }

    /**
     * getSources will make a gRPC request to retrieve an array of known sources.
     * @return {Promise} A promised array of source identifiers.
     */
    getSources(){
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(errClientNotConnected);
            }

            const request = new messages.GetSourcesRequest();
            request.setSession(this.session);

            var sources = [];
            var call = this.rpc.getSources(request);
            call.on('data', response => {
                sources.push(response.getSource());
            });
            call.on('end', () => {
                resolve(sources);
            });
            call.on('error', err => {
                reject(err);
            });
        });
    }

    /**
     * getKeys will make a gRPC request to retrieve an array of keys for the given source.
     * @param {string} source The source identifier you wish to retrieve the keys for.
     * @return {Promise} A promised array of keys found in the given source.
     */
    getKeys(source) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(errClientNotConnected);
            }

            const request = new messages.GetKeysRequest();
            request.setSession(this.session);
            request.setSource(source);

            var keys = [];
            var call = this.rpc.getKeys(request);
            call.on('data', response => {
                keys.push(response.getKey());
            });
            call.on('end', () => {
                resolve(keys);
            });
            call.on('error', err => {
                reject(err);
            });
        });
    }

    /**
     * subscribe will make a gRPC request indicating that this client wishes to receive all updates for the given source.
     * Upon receipt of these updates, the client will call the provided handler.
     * @param {string} source The identifier of the source to subscribe to.
     * @param {function} handler The update handler you wish to call when an update is received.  Handlers should expect to receive
     * an object representing an updated source, key, and value.
     * @return {Promise} A promised object that contains the session identifier and identifier of the subscribed source.
     */
    subscribe(source, handler) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(errClientNotConnected);
            }

            const request = new messages.SubscribeRequest();
            request.setSession(this.session);
            request.setSource(source);

            this.rpc.subscribe(request, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    if (!this.sourceHandlers[source]) {
                        this.sourceHandlers[source] = [];
                    }

                    if (!this.sourceHandlers[source].includes(handler)) {
                        this.sourceHandlers[source].push(handler);
                    }

                    resolve({
                        'session':this.session,
                        'source':response.getSource(),
                    });
                }
            });
        });
    }

    /**
     * subscribeKey will make a gRPC request indicating that this client wishes to receive all updates for the given source and key.
     * Upon receipt of these updates, the client will call the provided handler.
     * @param {string} source The identifier of the source containing the key to be susbcribed to.
     * @param {string} key The key to be subscribed to.
     * @param {function} handler The update handler you wish to call when an update is received.  Handlers should expect to receive
     * an object representing an updated source, key, and value.
     * @return {Promise} A promsied object that contains the session identifier, the identifier of the subscribed source, and the key that was subscribed to.
     */
    subscribeKey(source, key, handler) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(errClientNotConnected);
            }

            const request = new messages.SubscribeKeyRequest();
            request.setSession(this.session);
            request.setSource(source);
            request.setKey(key);

            this.rpc.subscribeKey(request, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    if (!this.keyHandlers[source]) {
                        this.keyHandlers[source] = new Map();
                    }

                    if (!this.keyHandlers[source][key]) {
                        this.keyHandlers[source][key] = [];
                    }

                    if (!this.keyHandlers[source][key].includes(handler)) {
                        this.keyHandlers[source][key].push(handler);
                    }

                    resolve({
                        'session':this.session,
                        'source':response.getSource(),
                        'key':response.getKey(),
                    });
                }
            });
        });
    }

    /**
     * unsubscribe will make a gRPC request indicating that this client wishes to stop receiving updates for the given source.
     * @param {string} source The identifier of the source to unsubscribe from.
     * @param {function} handler The update handler you no longer wish to be called.
     * @return {Promise} A promised object that contains the session identifier and identifier of the subscribed source.
     */
    unsubscribe(source, handler) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(errClientNotConnected);
            }

            if (this.sourceHandlers && this.sourceHandlers[source]) {
                var index = this.sourceHandlers[source].indexOf(handler);
                if (index >= 0) {
                    this.sourceHandlers[source].splice(index, 1);
                }

                if (this.sourceHandlers[source].length > 0) {
                    resolve({
                        'session':this.session,
                        'source':source,
                    });
                    return;
                } 
            }
    
            const request = new messages.UnsubscribeRequest();
            request.setSession(this.session);
            request.setSource(source);

            this.rpc.unsubscribe(request, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        'session':this.session,
                        'source':source,
                    });
                    return;
                }
            });
        });
    }

    /**
     * unsubscribeKey will make a gRPC request indicating that this client wishes to stop receiving updates for the given source and key.
     * @param {string} source The identifier of the source containign the key to be unsubscribed from.
     * @param {string} key The key to be unsubscribed from.
     * @param {function} handler The update handler you no longer wish to be called.
     * @return {Promise} A promised object that contains the session identifier and identifier of the unsubscribed source.
     */
    unsubscribeKey(source, key, handler) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(errClientNotConnected);
            }

            if (this.keyHandlers && this.keyHandlers[source] && this.keyHandlers[source][key]) {
                var index = this.keyHandlers[source][key].indexOf(handler);
                if (index >= 0) {
                    this.keyHandlers[source][key].splice(index, 1);
                }

                if (this.keyHandlers[source][key].length > 0) {
                    resolve({
                        'session':this.session,
                        'source':source,
                        'key':key,
                    });
                    return;
                }
            }

            const request = new messages.UnsubscribeKeyRequest();
            request.setSession(this.session);
            request.setSource(source);
            request.setKey(key);

            this.rpc.unsubscribeKey(request, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        'session':this.session,
                        'source':source,
                        'key':key,
                    });
                }
            });
        });
    }
}

IrisClient.defaultIrisAddress = defaultIrisAddress;
IrisClient.errClientNotConnected = errClientNotConnected;
module.exports = IrisClient;