/*jshint esversion: 6 */
const messages = require('./iris_pb.js');
const services = require('./iris_grpc_pb.js');
const grpc = require('grpc');

const defaultIrisPort = 32000;
const errClientNotConnected = new Error("The client must be connected before it can be used to send requests to the server.");

class IrisClient {
    constructor(serverAddress, caFile) {
        this.serverAddress = serverAddress;
        if (!caFile || caFile.length === 0) {
            this.creds = grpc.credentials.createInsecure();
        } else {
            this.creds = grpc.credentials.createSsl(caFile);
        }

        this.sourceHandlers = new Map();
        this.keyHandlers = new Map();
        this.connected = false;
    }

    connect(errorCallback) {
        return new Promise((resolve, reject) => {
            if (this.serverAddress.length === 0) {
                reject(Error("You must provide a server address to connect to."));
                return;
            }

            this.rpc = new services.IrisClient(this.serverAddress, this.creds);
            const connectReq = new messages.ConnectRequest();
            this.rpc.connect(connectReq, (err, response) => {
                if (err) {
                    reject(Error("Failed to connect to Iris server at " + this.serverAddress));
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
                        
                        var shs = this.sourceHandlers[update.source];
                        var khs;
                        if (this.keyHandlers[update.source]) {
                            khs = this.keyHandlers[update.source][update.key];
                        }

                        if (shs) {
                            shs.forEach(handler => {
                                handler(update);
                            });
                        }

                        if (khs) {
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
                    resolve({"session":this.session});
                    return;
                }  
            });
        });
    }

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
                        "value":response.getValue()
                    });
                }
            });
        });
    }

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
                        "value":response.getValue()
                    });
                }
            });
        });
    }

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
                        "session":response.getSession(),
                        "source":response.getSource(),
                        "key":response.getKey()
                    });
                }
            });
        });
    }

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
                        "session":response.getSession(),
                        "source":response.getSource()
                    });
                }
            });
        });
    }

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
                        "session":this.session,
                        "source":response.getSource(),
                    });
                }
            });
        });
    }

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
                        "session":this.session,
                        "source":response.getSource(),
                        "key":response.getKey(),
                    });
                }
            });
        });
    }

    unsubscribe(source, handler) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(errClientNotConnected);
            }

            const request = new messages.UnsubscribeRequest();
            request.setSession(this.session);
            request.setSource(source);

            this.rpc.unsubscribe(request, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    if (this.sourceHandlers && this.sourceHandlers[source]) {
                        var index = this.sourceHandlers[source].indexOf(handler);
                        if (index >= 0) {
                            this.sourceHandlers[source].splice(index, 1);
                        }
                    }
                    
                    resolve({
                        "session":this.session,
                        "source":source,
                    });
                }
            });
        });
    }

    unsubscribeKey(source, key, handler) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(errClientNotConnected);
            }

            const request = new messages.UnsubscribeKeyRequest();
            request.setSession(this.session);
            request.setSource(source);
            request.setKey(key);

            this.rpc.unsubscribeKey(request, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    if (this.keyHandlers && this.keyHandlers[source] && this.keyHandlers[source][key]) {
                        var index = this.keyHandlers[source][key].indexOf(handler);
                        if (index >= 0) {
                            this.keyHandlers[source][key].splice(index, 1);
                        }
                    }

                    resolve({
                        "session":this.session,
                        "source":source,
                        "key":key,
                    });
                }
            });
        });
    }
}

module.exports = IrisClient;