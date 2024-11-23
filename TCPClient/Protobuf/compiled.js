/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.example = (function() {

    /**
     * Namespace example.
     * @exports example
     * @namespace
     */
    var example = {};

    example.ClientRequest = (function() {

        /**
         * Properties of a ClientRequest.
         * @memberof example
         * @interface IClientRequest
         * @property {string|null} [cmd] ClientRequest cmd
         * @property {string|null} [message] ClientRequest message
         * @property {string|null} [clientId] ClientRequest clientId
         */

        /**
         * Constructs a new ClientRequest.
         * @memberof example
         * @classdesc Represents a ClientRequest.
         * @implements IClientRequest
         * @constructor
         * @param {example.IClientRequest=} [properties] Properties to set
         */
        function ClientRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ClientRequest cmd.
         * @member {string} cmd
         * @memberof example.ClientRequest
         * @instance
         */
        ClientRequest.prototype.cmd = "";

        /**
         * ClientRequest message.
         * @member {string} message
         * @memberof example.ClientRequest
         * @instance
         */
        ClientRequest.prototype.message = "";

        /**
         * ClientRequest clientId.
         * @member {string} clientId
         * @memberof example.ClientRequest
         * @instance
         */
        ClientRequest.prototype.clientId = "";

        /**
         * Creates a new ClientRequest instance using the specified properties.
         * @function create
         * @memberof example.ClientRequest
         * @static
         * @param {example.IClientRequest=} [properties] Properties to set
         * @returns {example.ClientRequest} ClientRequest instance
         */
        ClientRequest.create = function create(properties) {
            return new ClientRequest(properties);
        };

        /**
         * Encodes the specified ClientRequest message. Does not implicitly {@link example.ClientRequest.verify|verify} messages.
         * @function encode
         * @memberof example.ClientRequest
         * @static
         * @param {example.IClientRequest} message ClientRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cmd != null && Object.hasOwnProperty.call(message, "cmd"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cmd);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.clientId);
            return writer;
        };

        /**
         * Encodes the specified ClientRequest message, length delimited. Does not implicitly {@link example.ClientRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof example.ClientRequest
         * @static
         * @param {example.IClientRequest} message ClientRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ClientRequest message from the specified reader or buffer.
         * @function decode
         * @memberof example.ClientRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {example.ClientRequest} ClientRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.example.ClientRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.cmd = reader.string();
                        break;
                    }
                case 2: {
                        message.message = reader.string();
                        break;
                    }
                case 3: {
                        message.clientId = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ClientRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof example.ClientRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {example.ClientRequest} ClientRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ClientRequest message.
         * @function verify
         * @memberof example.ClientRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ClientRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cmd != null && message.hasOwnProperty("cmd"))
                if (!$util.isString(message.cmd))
                    return "cmd: string expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                if (!$util.isString(message.clientId))
                    return "clientId: string expected";
            return null;
        };

        /**
         * Creates a ClientRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof example.ClientRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {example.ClientRequest} ClientRequest
         */
        ClientRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.example.ClientRequest)
                return object;
            var message = new $root.example.ClientRequest();
            if (object.cmd != null)
                message.cmd = String(object.cmd);
            if (object.message != null)
                message.message = String(object.message);
            if (object.clientId != null)
                message.clientId = String(object.clientId);
            return message;
        };

        /**
         * Creates a plain object from a ClientRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof example.ClientRequest
         * @static
         * @param {example.ClientRequest} message ClientRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ClientRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cmd = "";
                object.message = "";
                object.clientId = "";
            }
            if (message.cmd != null && message.hasOwnProperty("cmd"))
                object.cmd = message.cmd;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                object.clientId = message.clientId;
            return object;
        };

        /**
         * Converts this ClientRequest to JSON.
         * @function toJSON
         * @memberof example.ClientRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ClientRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ClientRequest
         * @function getTypeUrl
         * @memberof example.ClientRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ClientRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/example.ClientRequest";
        };

        return ClientRequest;
    })();

    example.ServerResponse = (function() {

        /**
         * Properties of a ServerResponse.
         * @memberof example
         * @interface IServerResponse
         * @property {string|null} [message] ServerResponse message
         * @property {string|null} [timestamp] ServerResponse timestamp
         */

        /**
         * Constructs a new ServerResponse.
         * @memberof example
         * @classdesc Represents a ServerResponse.
         * @implements IServerResponse
         * @constructor
         * @param {example.IServerResponse=} [properties] Properties to set
         */
        function ServerResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ServerResponse message.
         * @member {string} message
         * @memberof example.ServerResponse
         * @instance
         */
        ServerResponse.prototype.message = "";

        /**
         * ServerResponse timestamp.
         * @member {string} timestamp
         * @memberof example.ServerResponse
         * @instance
         */
        ServerResponse.prototype.timestamp = "";

        /**
         * Creates a new ServerResponse instance using the specified properties.
         * @function create
         * @memberof example.ServerResponse
         * @static
         * @param {example.IServerResponse=} [properties] Properties to set
         * @returns {example.ServerResponse} ServerResponse instance
         */
        ServerResponse.create = function create(properties) {
            return new ServerResponse(properties);
        };

        /**
         * Encodes the specified ServerResponse message. Does not implicitly {@link example.ServerResponse.verify|verify} messages.
         * @function encode
         * @memberof example.ServerResponse
         * @static
         * @param {example.IServerResponse} message ServerResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified ServerResponse message, length delimited. Does not implicitly {@link example.ServerResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof example.ServerResponse
         * @static
         * @param {example.IServerResponse} message ServerResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ServerResponse message from the specified reader or buffer.
         * @function decode
         * @memberof example.ServerResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {example.ServerResponse} ServerResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.example.ServerResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.message = reader.string();
                        break;
                    }
                case 2: {
                        message.timestamp = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ServerResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof example.ServerResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {example.ServerResponse} ServerResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ServerResponse message.
         * @function verify
         * @memberof example.ServerResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ServerResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isString(message.timestamp))
                    return "timestamp: string expected";
            return null;
        };

        /**
         * Creates a ServerResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof example.ServerResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {example.ServerResponse} ServerResponse
         */
        ServerResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.example.ServerResponse)
                return object;
            var message = new $root.example.ServerResponse();
            if (object.message != null)
                message.message = String(object.message);
            if (object.timestamp != null)
                message.timestamp = String(object.timestamp);
            return message;
        };

        /**
         * Creates a plain object from a ServerResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof example.ServerResponse
         * @static
         * @param {example.ServerResponse} message ServerResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ServerResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.message = "";
                object.timestamp = "";
            }
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                object.timestamp = message.timestamp;
            return object;
        };

        /**
         * Converts this ServerResponse to JSON.
         * @function toJSON
         * @memberof example.ServerResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ServerResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ServerResponse
         * @function getTypeUrl
         * @memberof example.ServerResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ServerResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/example.ServerResponse";
        };

        return ServerResponse;
    })();

    return example;
})();

module.exports = $root;
