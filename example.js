const iris_client = require("./api.js")
const textEncoding = require('text-encoding');

function main() {
    var client = new iris_client("127.0.0.1:32000", "")
    client.connect().then(function(response){
        console.log("Session: ", response.session)

        var encodedDev = new textEncoding.TextEncoder("utf-8").encode("stephan");
        client.setValue("company", "dev", encodedDev).then(function(response){
            var decodedSetDevResponse = new textEncoding.TextDecoder('utf-8').decode(response.value)
            console.log("SetValueResponse: ", decodedSetDevResponse) 

            var encodedDesigner = new textEncoding.TextEncoder("utf-8").encode("rich");
            client.setValue("company", "designer", encodedDesigner).then(function(response){
                var decodedSetDesignerResponse = new textEncoding.TextDecoder('utf-8').decode(response.value)
                console.log("SetValueResponse: ", decodedSetDesignerResponse) 

                client.getValue("company", "designer").then(function(response){
                    var decodedGetDesignerResponse = new textEncoding.TextDecoder('utf-8').decode(response.value)
                    console.log("GetValueResponse: ", decodedGetDesignerResponse)

                    client.removeValue("company", "designer").then(function(response) {
                        console.log("RemoveValueResponse: ", response)

                        client.removeSource("company").then(function(response) {
                            console.log("RemoveSourceResponse: ", response)  
                        }, function(error) {
                            console.log(error)
                        })
                    }, function(error) {
                        console.log(error)
                    })
                }, function(error){
                    console.log(error)
                }) 
            }, function(error){
                console.log(error)
            })
        }, function(error) {
            console.log(error)
        })
    }, function(error) {
        console.log(error)
    })
}

main();