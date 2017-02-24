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
        return new Promise((resolve, reject) => {
            if(this.serverAddress.length == 0) {
                reject(Error("You must provide a server address to connect to."))
                return
            }

            this.rpc = new services.IrisClient(this.serverAddress, this.creds);
            const connectReq = new messages.ConnectRequest()
            this.rpc.connect(connectReq, function(err, response) {
                if (err) {
                    reject(Error("Failed to connect to Iris server at " + this.serverAddress))
                    return
                } else {
                    this.session = response.getSession()
                    resolve({
                        "session":response.getSession()
                    })
                    return
                }  
            })
        })
    }

    setValue(source, key, value) {
        return new Promise((resolve, reject) => {
            const setReq = new messages.SetValueRequest()
            setReq.setSession(this.session)
            setReq.setSource(source)
            setReq.setKey(key)
            setReq.setValue(value)
            this.rpc.setValue(setReq, function(err, response) {
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
        return new Promise((resolve, reject) => {
            const getReq = new messages.GetValueRequest()
            getReq.setSession(this.session)
            getReq.setSource(source)
            getReq.setKey(key)
            this.rpc.getValue(getReq, function(err, response) {
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
        return new Promise((resolve, reject) => {
            const removeReq = new messages.RemoveValueRequest()
            removeReq.setSession(this.session)
            removeReq.setSource(source)
            removeReq.setKey(key)
            this.rpc.removeValue(removeReq, function(err, response) {
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
        return new Promise((resolve, reject) => {
            const removeReq = new messages.RemoveSourceRequest()
            removeReq.setSession(this.session)
            removeReq.setSource(source)
            this.rpc.removeSource(removeReq, function(err, response) {
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
}

module.exports = IrisClient;