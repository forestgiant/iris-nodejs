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
                    resolve(this)
                    return
                }  
            })
        })
    }

    getSession() {
        return this.session
    }

    register() {
        console.log("Registering or whatever else we are trying to do.")
    }
}

module.exports = IrisClient;

function main() {
    var client = new IrisClient("127.0.0.1:32000", "")
    client.connect().then(function(c){
        console.log("Connected with session:", client.getSession())
        client.register()
    }, function(error) {
        // console.log(error.Message())
        console.log(error)
    })
}

main();