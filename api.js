const messages = require('./iris_pb.js');
const services = require('./iris_grpc_pb.js');
const grpc = require('grpc');

const defaultIrisPort = 32000;

class IrisClient {
    constructor(serverAddress, caFile) {
        this.serverAddress = serverAddress;
        var caFile;
        if (!caFile || caFile.length == 0) {
            this.creds = grpc.credentials.createInsecure();
        } else {
            this.creds = grpc.credentials.createSsl(caFile);
        }

        this.sourceHandlers = new Map();
        this.keyHandlers = new Map();
    }

    listen() {
        var _this = this;
        return new Promise((resolve, reject) => {
            var request = new messages.ListenRequest();
            request.setSession(this.session)
            var call = this.rpc.listen(request);
            call.on('data', response => {
                var update = {
                    source: response.getSource(),
                    key: response.getKey(),
                    value: response.getValue(),
                }
                
                var shs = _this.sourceHandlers[update.source]
                var khs;
                if (_this.keyHandlers[update.source]) {
                    khs = _this.keyHandlers[update.source][update.key]
                }

                if (shs) {
                    shs.forEach(handler => {
                        handler(update)
                    })
                }

                if (khs) {
                    khs.forEach(handler => {
                        handler(update)
                    })   
                }
            });
            call.on('end', () => {});
            call.on('error', err => {});
            resolve();
        })
    }

    connect() {
        var _this = this;
        return new Promise((resolve, reject) => {
            if(this.serverAddress.length == 0) {
                reject(Error("You must provide a server address to connect to."));
                return
            }

            this.rpc = new services.IrisClient(this.serverAddress, this.creds);
            const connectReq = new messages.ConnectRequest();
            this.rpc.connect(connectReq, function(err, response) {
                if (err) {
                    reject(Error("Failed to connect to Iris server at " + this.serverAddress));
                    return
                } else {
                    _this.session = response.getSession();
                    resolve({
                        "session":response.getSession()
                    });
                    return
                }  
            })
        })
    }

    setValue(source, key, value) {
        return new Promise((resolve, reject) => {
            const setReq = new messages.SetValueRequest();
            setReq.setSession(this.session);
            setReq.setSource(source);
            setReq.setKey(key);
            setReq.setValue(value);
            this.rpc.setValue(setReq, function(err, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        "value":response.getValue()
                    });
                }
            });
        })
    }

    getValue(source, key) {
        return new Promise((resolve, reject) => {
            const getReq = new messages.GetValueRequest();
            getReq.setSession(this.session);
            getReq.setSource(source);
            getReq.setKey(key);
            this.rpc.getValue(getReq, function(err, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        "value":response.getValue()
                    });
                }
            });
        })
    }

    removeValue(source, key) {
        return new Promise((resolve, reject) => {
            const removeReq = new messages.RemoveValueRequest();
            removeReq.setSession(this.session);
            removeReq.setSource(source);
            removeReq.setKey(key);
            this.rpc.removeValue(removeReq, function(err, response) {
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
        })
    }

    removeSource(source) {
        return new Promise((resolve, reject) => {
            const removeReq = new messages.RemoveSourceRequest();
            removeReq.setSession(this.session);
            removeReq.setSource(source);
            this.rpc.removeSource(removeReq, function(err, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        "session":response.getSession(),
                        "source":response.getSource()
                    });
                }
            });
        })
    }

    getSources(){
        return new Promise((resolve, reject) => {
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
        })
    }

    getKeys(source) {
        return new Promise((resolve, reject) => {
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
        })
    }

    subscribe(source, handler) {
        var _this = this;
        return new Promise((resolve, reject) => {
            const request = new messages.SubscribeRequest();
            request.setSession(_this.session)
            request.setSource(source)

            this.rpc.subscribe(request, function(err, response) {
                if (err) {
                    reject(err);
                } else {
                    if (!_this.sourceHandlers[source]) {
                        _this.sourceHandlers[source] = [];
                    }

                    if (!_this.sourceHandlers[source].includes(handler)) {
                        _this.sourceHandlers[source].push(handler)
                    }

                    resolve({
                        "session":_this.session,
                        "source":response.getSource(),
                    });
                }
            });
        })
    }

    subscribeKey(source, key, handler) {
        var _this = this;
        return new Promise((resolve, reject) => {
            const request = new messages.SubscribeKeyRequest();
            request.setSession(_this.session)
            request.setSource(source)
            request.setKey(key)

            this.rpc.subscribeKey(request, function(err, response) {
                if (err) {
                    reject(err);
                } else {
                    if (!_this.keyHandlers[source]) {
                        _this.keyHandlers[source] = new Map();
                    }

                    if (!_this.keyHandlers[source][key]) {
                        _this.keyHandlers[source][key] = [];
                    }

                    if (!_this.keyHandlers[source][key].includes(handler)) {
                        _this.keyHandlers[source][key].push(handler)
                    }

                    resolve({
                        "session":_this.session,
                        "source":response.getSource(),
                        "key":response.getKey(),
                    });
                }
            });
        })
    }

    unsubscribe(source, handler) {
        var _this = this;
        return new Promise((resolve, reject) => {
            const request = new messages.UnsubscribeRequest();
            request.setSession(_this.session)
            request.setSource(source)

            this.rpc.unsubscribe(request, function(err, response) {
                if (err) {
                    reject(err);
                } else {
                    if (_this.sourceHandlers && _this.sourceHandlers[source]) {
                        var index = _this.sourceHandlers[source].indexOf(handler)
                        if (index >= 0) {
                            _this.sourceHandlers[source].splice(index, 1)
                        }
                    }
                    
                    resolve({
                        "session":_this.session,
                        "source":source,
                    });
                }
            });
        })
    }

    unsubscribeKey(source, key, handler) {
        var _this = this;
        return new Promise((resolve, reject) => {
            const request = new messages.UnsubscribeKeyRequest();
            request.setSession(_this.session)
            request.setSource(source)
            request.setKey(key)

            this.rpc.unsubscribeKey(request, function(err, response) {
                if (err) {
                    reject(err);
                } else {
                    if (_this.keyHandlers && _this.keyHandlers[source] && _this.keyHandlers[source][key]) {
                        var index = _this.keyHandlers[source][key].indexOf(handler)
                        if (index >= 0) {
                            _this.keyHandlers[source][key].splice(index, 1)
                        }
                    }

                    resolve({
                        "session":_this.session,
                        "source":source,
                        "key":key,
                    });
                }
            });
        })
    }
}

module.exports = IrisClient;