const messages = require('./iris_pb.js');
const services = require('./iris_grpc_pb.js')
const grpc = require('grpc')

const defaultIrisPort = 32000

class IrisClient {
    constructor(serverAddress, caFile) {
        this.serverAddress = serverAddress
        var caFile
        if (!caFile || caFile.length == 0) {
            this.creds = grpc.credentials.createInsecure();
        } else {
            this.creds = grpc.credentials.createSsl(caFile);
        }
    }

    connect() {
        const _this = this
        return new Promise(function(resolve, reject){
            if(_this.serverAddress.length == 0) {
                reject(Error("You must provide a server address to connect to."))
                return
            }

            _this.rpc = new services.IrisClient(_this.serverAddress, _this.creds);
            const connectReq = new messages.ConnectRequest()
            _this.rpc.connect(connectReq, function(err, response) {
                if (err) {
                    reject(Error("Failed to connect to Iris server at " + _this.serverAddress))
                    return
                } else {
                    _this.session = response.getSession()
                    resolve({
                        "session":response.getSession()
                    })
                    return
                }  
            })
        })
    }

    setValue(source, key, value) {
        const _this = this
        return new Promise(function(resolve, reject) {
            const setReq = new messages.SetValueRequest()
            setReq.setSession(_this.session)
            setReq.setSource(source)
            setReq.setKey(key)
            setReq.setValue(value)
            _this.rpc.setValue(setReq, function(err, response) {
                if (err) {
                    reject(err)
                } else {
                    resolve({
                        "value":response.getValue()
                    })
                }
            })
        })
    }

    getValue(source, key) {
        const _this = this
        return new Promise(function(resolve, reject) {
            const getReq = new messages.GetValueRequest()
            getReq.setSession(_this.session)
            getReq.setSource(source)
            getReq.setKey(key)
            _this.rpc.getValue(getReq, function(err, response) {
                if (err) {
                    reject(err)
                } else {
                    resolve({
                        "value":response.getValue()
                    })
                }
            })
        })
    }

    removeValue(source, key) {
        const _this = this
        return new Promise(function(resolve, reject) {
            const removeReq = new messages.RemoveValueRequest()
            removeReq.setSession(_this.session)
            removeReq.setSource(source)
            removeReq.setKey(key)
            _this.rpc.removeValue(removeReq, function(err, response) {
                if (err) {
                    reject(err)
                } else {
                    resolve({
                        "session":response.getSession(),
                        "source":response.getSource(),
                        "key":response.getKey()
                    })
                }
            })
        })
    }

    removeSource(source) {
        const _this = this
        return new Promise(function(resolve, reject) {
            const removeReq = new messages.RemoveSourceRequest()
            removeReq.setSession(_this.session)
            removeReq.setSource(source)
            _this.rpc.removeSource(removeReq, function(err, response) {
                if (err) {
                    reject(err)
                } else {
                    resolve({
                        "session":response.getSession(),
                        "source":response.getSource()
                    })
                }
            })
        })
    }

    // Listen
    // GetSources
    // GetKeys
    // Subscribe
    // SubscribeKey
    // Unsubscribe
    // UnsubscribeKey
}

module.exports = IrisClient;