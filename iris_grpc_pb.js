// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var iris_pb = require('./iris_pb.js');

function serialize_iris_pb_ConnectRequest(arg) {
  if (!(arg instanceof iris_pb.ConnectRequest)) {
    throw new Error('Expected argument of type iris.pb.ConnectRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_ConnectRequest(buffer_arg) {
  return iris_pb.ConnectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_ConnectResponse(arg) {
  if (!(arg instanceof iris_pb.ConnectResponse)) {
    throw new Error('Expected argument of type iris.pb.ConnectResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_ConnectResponse(buffer_arg) {
  return iris_pb.ConnectResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_GetKeysRequest(arg) {
  if (!(arg instanceof iris_pb.GetKeysRequest)) {
    throw new Error('Expected argument of type iris.pb.GetKeysRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_GetKeysRequest(buffer_arg) {
  return iris_pb.GetKeysRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_GetKeysResponse(arg) {
  if (!(arg instanceof iris_pb.GetKeysResponse)) {
    throw new Error('Expected argument of type iris.pb.GetKeysResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_GetKeysResponse(buffer_arg) {
  return iris_pb.GetKeysResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_GetSourcesRequest(arg) {
  if (!(arg instanceof iris_pb.GetSourcesRequest)) {
    throw new Error('Expected argument of type iris.pb.GetSourcesRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_GetSourcesRequest(buffer_arg) {
  return iris_pb.GetSourcesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_GetSourcesResponse(arg) {
  if (!(arg instanceof iris_pb.GetSourcesResponse)) {
    throw new Error('Expected argument of type iris.pb.GetSourcesResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_GetSourcesResponse(buffer_arg) {
  return iris_pb.GetSourcesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_GetValueRequest(arg) {
  if (!(arg instanceof iris_pb.GetValueRequest)) {
    throw new Error('Expected argument of type iris.pb.GetValueRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_GetValueRequest(buffer_arg) {
  return iris_pb.GetValueRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_GetValueResponse(arg) {
  if (!(arg instanceof iris_pb.GetValueResponse)) {
    throw new Error('Expected argument of type iris.pb.GetValueResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_GetValueResponse(buffer_arg) {
  return iris_pb.GetValueResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_JoinRequest(arg) {
  if (!(arg instanceof iris_pb.JoinRequest)) {
    throw new Error('Expected argument of type iris.pb.JoinRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_JoinRequest(buffer_arg) {
  return iris_pb.JoinRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_JoinResponse(arg) {
  if (!(arg instanceof iris_pb.JoinResponse)) {
    throw new Error('Expected argument of type iris.pb.JoinResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_JoinResponse(buffer_arg) {
  return iris_pb.JoinResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_ListenRequest(arg) {
  if (!(arg instanceof iris_pb.ListenRequest)) {
    throw new Error('Expected argument of type iris.pb.ListenRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_ListenRequest(buffer_arg) {
  return iris_pb.ListenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_RemoveSourceRequest(arg) {
  if (!(arg instanceof iris_pb.RemoveSourceRequest)) {
    throw new Error('Expected argument of type iris.pb.RemoveSourceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_RemoveSourceRequest(buffer_arg) {
  return iris_pb.RemoveSourceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_RemoveSourceResponse(arg) {
  if (!(arg instanceof iris_pb.RemoveSourceResponse)) {
    throw new Error('Expected argument of type iris.pb.RemoveSourceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_RemoveSourceResponse(buffer_arg) {
  return iris_pb.RemoveSourceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_RemoveValueRequest(arg) {
  if (!(arg instanceof iris_pb.RemoveValueRequest)) {
    throw new Error('Expected argument of type iris.pb.RemoveValueRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_RemoveValueRequest(buffer_arg) {
  return iris_pb.RemoveValueRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_RemoveValueResponse(arg) {
  if (!(arg instanceof iris_pb.RemoveValueResponse)) {
    throw new Error('Expected argument of type iris.pb.RemoveValueResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_RemoveValueResponse(buffer_arg) {
  return iris_pb.RemoveValueResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_SetValueRequest(arg) {
  if (!(arg instanceof iris_pb.SetValueRequest)) {
    throw new Error('Expected argument of type iris.pb.SetValueRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_SetValueRequest(buffer_arg) {
  return iris_pb.SetValueRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_SetValueResponse(arg) {
  if (!(arg instanceof iris_pb.SetValueResponse)) {
    throw new Error('Expected argument of type iris.pb.SetValueResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_SetValueResponse(buffer_arg) {
  return iris_pb.SetValueResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_SubscribeKeyRequest(arg) {
  if (!(arg instanceof iris_pb.SubscribeKeyRequest)) {
    throw new Error('Expected argument of type iris.pb.SubscribeKeyRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_SubscribeKeyRequest(buffer_arg) {
  return iris_pb.SubscribeKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_SubscribeKeyResponse(arg) {
  if (!(arg instanceof iris_pb.SubscribeKeyResponse)) {
    throw new Error('Expected argument of type iris.pb.SubscribeKeyResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_SubscribeKeyResponse(buffer_arg) {
  return iris_pb.SubscribeKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_SubscribeRequest(arg) {
  if (!(arg instanceof iris_pb.SubscribeRequest)) {
    throw new Error('Expected argument of type iris.pb.SubscribeRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_SubscribeRequest(buffer_arg) {
  return iris_pb.SubscribeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_SubscribeResponse(arg) {
  if (!(arg instanceof iris_pb.SubscribeResponse)) {
    throw new Error('Expected argument of type iris.pb.SubscribeResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_SubscribeResponse(buffer_arg) {
  return iris_pb.SubscribeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_UnsubscribeKeyRequest(arg) {
  if (!(arg instanceof iris_pb.UnsubscribeKeyRequest)) {
    throw new Error('Expected argument of type iris.pb.UnsubscribeKeyRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_UnsubscribeKeyRequest(buffer_arg) {
  return iris_pb.UnsubscribeKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_UnsubscribeKeyResponse(arg) {
  if (!(arg instanceof iris_pb.UnsubscribeKeyResponse)) {
    throw new Error('Expected argument of type iris.pb.UnsubscribeKeyResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_UnsubscribeKeyResponse(buffer_arg) {
  return iris_pb.UnsubscribeKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_UnsubscribeRequest(arg) {
  if (!(arg instanceof iris_pb.UnsubscribeRequest)) {
    throw new Error('Expected argument of type iris.pb.UnsubscribeRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_UnsubscribeRequest(buffer_arg) {
  return iris_pb.UnsubscribeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_UnsubscribeResponse(arg) {
  if (!(arg instanceof iris_pb.UnsubscribeResponse)) {
    throw new Error('Expected argument of type iris.pb.UnsubscribeResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_UnsubscribeResponse(buffer_arg) {
  return iris_pb.UnsubscribeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iris_pb_Update(arg) {
  if (!(arg instanceof iris_pb.Update)) {
    throw new Error('Expected argument of type iris.pb.Update');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_iris_pb_Update(buffer_arg) {
  return iris_pb.Update.deserializeBinary(new Uint8Array(buffer_arg));
}


var IrisService = exports.IrisService = {
  // Join the node reachable at the provided address to this cluster
  join: {
    path: '/iris.pb.Iris/Join',
    requestStream: false,
    responseStream: false,
    requestType: iris_pb.JoinRequest,
    responseType: iris_pb.JoinResponse,
    requestSerialize: serialize_iris_pb_JoinRequest,
    requestDeserialize: deserialize_iris_pb_JoinRequest,
    responseSerialize: serialize_iris_pb_JoinResponse,
    responseDeserialize: deserialize_iris_pb_JoinResponse,
  },
  // Connect responds with a session identifier to be used for subsequent requests
  connect: {
    path: '/iris.pb.Iris/Connect',
    requestStream: false,
    responseStream: false,
    requestType: iris_pb.ConnectRequest,
    responseType: iris_pb.ConnectResponse,
    requestSerialize: serialize_iris_pb_ConnectRequest,
    requestDeserialize: deserialize_iris_pb_ConnectRequest,
    responseSerialize: serialize_iris_pb_ConnectResponse,
    responseDeserialize: deserialize_iris_pb_ConnectResponse,
  },
  // Listen responds with a stream of objects representing source, key, value updates
  listen: {
    path: '/iris.pb.Iris/Listen',
    requestStream: false,
    responseStream: true,
    requestType: iris_pb.ListenRequest,
    responseType: iris_pb.Update,
    requestSerialize: serialize_iris_pb_ListenRequest,
    requestDeserialize: deserialize_iris_pb_ListenRequest,
    responseSerialize: serialize_iris_pb_Update,
    responseDeserialize: deserialize_iris_pb_Update,
  },
  // GetSources responds with a stream of objects representing available sources
  getSources: {
    path: '/iris.pb.Iris/GetSources',
    requestStream: false,
    responseStream: true,
    requestType: iris_pb.GetSourcesRequest,
    responseType: iris_pb.GetSourcesResponse,
    requestSerialize: serialize_iris_pb_GetSourcesRequest,
    requestDeserialize: deserialize_iris_pb_GetSourcesRequest,
    responseSerialize: serialize_iris_pb_GetSourcesResponse,
    responseDeserialize: deserialize_iris_pb_GetSourcesResponse,
  },
  // GetKeys expects a source and responds with a stream of objects representing available keys
  getKeys: {
    path: '/iris.pb.Iris/GetKeys',
    requestStream: false,
    responseStream: true,
    requestType: iris_pb.GetKeysRequest,
    responseType: iris_pb.GetKeysResponse,
    requestSerialize: serialize_iris_pb_GetKeysRequest,
    requestDeserialize: deserialize_iris_pb_GetKeysRequest,
    responseSerialize: serialize_iris_pb_GetKeysResponse,
    responseDeserialize: deserialize_iris_pb_GetKeysResponse,
  },
  // SetValue sets the value for the specified source and key
  setValue: {
    path: '/iris.pb.Iris/SetValue',
    requestStream: false,
    responseStream: false,
    requestType: iris_pb.SetValueRequest,
    responseType: iris_pb.SetValueResponse,
    requestSerialize: serialize_iris_pb_SetValueRequest,
    requestDeserialize: deserialize_iris_pb_SetValueRequest,
    responseSerialize: serialize_iris_pb_SetValueResponse,
    responseDeserialize: deserialize_iris_pb_SetValueResponse,
  },
  // GetValue expects a source and key and responds with the associated value
  getValue: {
    path: '/iris.pb.Iris/GetValue',
    requestStream: false,
    responseStream: false,
    requestType: iris_pb.GetValueRequest,
    responseType: iris_pb.GetValueResponse,
    requestSerialize: serialize_iris_pb_GetValueRequest,
    requestDeserialize: deserialize_iris_pb_GetValueRequest,
    responseSerialize: serialize_iris_pb_GetValueResponse,
    responseDeserialize: deserialize_iris_pb_GetValueResponse,
  },
  // RemoveValue removes the specified value from the provided source
  removeValue: {
    path: '/iris.pb.Iris/RemoveValue',
    requestStream: false,
    responseStream: false,
    requestType: iris_pb.RemoveValueRequest,
    responseType: iris_pb.RemoveValueResponse,
    requestSerialize: serialize_iris_pb_RemoveValueRequest,
    requestDeserialize: deserialize_iris_pb_RemoveValueRequest,
    responseSerialize: serialize_iris_pb_RemoveValueResponse,
    responseDeserialize: deserialize_iris_pb_RemoveValueResponse,
  },
  // RemoveSource removes the specified source
  removeSource: {
    path: '/iris.pb.Iris/RemoveSource',
    requestStream: false,
    responseStream: false,
    requestType: iris_pb.RemoveSourceRequest,
    responseType: iris_pb.RemoveSourceResponse,
    requestSerialize: serialize_iris_pb_RemoveSourceRequest,
    requestDeserialize: deserialize_iris_pb_RemoveSourceRequest,
    responseSerialize: serialize_iris_pb_RemoveSourceResponse,
    responseDeserialize: deserialize_iris_pb_RemoveSourceResponse,
  },
  // Subscribe indicates that the client wishes to be notified of all updates for the specified source
  subscribe: {
    path: '/iris.pb.Iris/Subscribe',
    requestStream: false,
    responseStream: false,
    requestType: iris_pb.SubscribeRequest,
    responseType: iris_pb.SubscribeResponse,
    requestSerialize: serialize_iris_pb_SubscribeRequest,
    requestDeserialize: deserialize_iris_pb_SubscribeRequest,
    responseSerialize: serialize_iris_pb_SubscribeResponse,
    responseDeserialize: deserialize_iris_pb_SubscribeResponse,
  },
  // SubscribeKey indicates that the client wishes to be notified of updates associated with
  // a specific key from the specified source
  subscribeKey: {
    path: '/iris.pb.Iris/SubscribeKey',
    requestStream: false,
    responseStream: false,
    requestType: iris_pb.SubscribeKeyRequest,
    responseType: iris_pb.SubscribeKeyResponse,
    requestSerialize: serialize_iris_pb_SubscribeKeyRequest,
    requestDeserialize: deserialize_iris_pb_SubscribeKeyRequest,
    responseSerialize: serialize_iris_pb_SubscribeKeyResponse,
    responseDeserialize: deserialize_iris_pb_SubscribeKeyResponse,
  },
  // Unsubscribe indicates that the client no longer wishes to be notified of updates for the specified source
  unsubscribe: {
    path: '/iris.pb.Iris/Unsubscribe',
    requestStream: false,
    responseStream: false,
    requestType: iris_pb.UnsubscribeRequest,
    responseType: iris_pb.UnsubscribeResponse,
    requestSerialize: serialize_iris_pb_UnsubscribeRequest,
    requestDeserialize: deserialize_iris_pb_UnsubscribeRequest,
    responseSerialize: serialize_iris_pb_UnsubscribeResponse,
    responseDeserialize: deserialize_iris_pb_UnsubscribeResponse,
  },
  // UnsubscribeKey indicates that the client no longer wishes to be notified of updates associated
  // with a specific key from the specified source
  unsubscribeKey: {
    path: '/iris.pb.Iris/UnsubscribeKey',
    requestStream: false,
    responseStream: false,
    requestType: iris_pb.UnsubscribeKeyRequest,
    responseType: iris_pb.UnsubscribeKeyResponse,
    requestSerialize: serialize_iris_pb_UnsubscribeKeyRequest,
    requestDeserialize: deserialize_iris_pb_UnsubscribeKeyRequest,
    responseSerialize: serialize_iris_pb_UnsubscribeKeyResponse,
    responseDeserialize: deserialize_iris_pb_UnsubscribeKeyResponse,
  },
};

exports.IrisClient = grpc.makeGenericClientConstructor(IrisService);
