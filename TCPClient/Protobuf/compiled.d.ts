import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace example. */
export namespace example {

    /** Properties of a ClientRequest. */
    interface IClientRequest {

        /** ClientRequest cmd */
        cmd?: (string|null);

        /** ClientRequest message */
        message?: (string|null);

        /** ClientRequest clientId */
        clientId?: (string|null);
    }

    /** Represents a ClientRequest. */
    class ClientRequest implements IClientRequest {

        /**
         * Constructs a new ClientRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: example.IClientRequest);

        /** ClientRequest cmd. */
        public cmd: string;

        /** ClientRequest message. */
        public message: string;

        /** ClientRequest clientId. */
        public clientId: string;

        /**
         * Creates a new ClientRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClientRequest instance
         */
        public static create(properties?: example.IClientRequest): example.ClientRequest;

        /**
         * Encodes the specified ClientRequest message. Does not implicitly {@link example.ClientRequest.verify|verify} messages.
         * @param message ClientRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: example.IClientRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClientRequest message, length delimited. Does not implicitly {@link example.ClientRequest.verify|verify} messages.
         * @param message ClientRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: example.IClientRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClientRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ClientRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): example.ClientRequest;

        /**
         * Decodes a ClientRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ClientRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): example.ClientRequest;

        /**
         * Verifies a ClientRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClientRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClientRequest
         */
        public static fromObject(object: { [k: string]: any }): example.ClientRequest;

        /**
         * Creates a plain object from a ClientRequest message. Also converts values to other types if specified.
         * @param message ClientRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: example.ClientRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClientRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ClientRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ServerResponse. */
    interface IServerResponse {

        /** ServerResponse message */
        message?: (string|null);

        /** ServerResponse timestamp */
        timestamp?: (string|null);
    }

    /** Represents a ServerResponse. */
    class ServerResponse implements IServerResponse {

        /**
         * Constructs a new ServerResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: example.IServerResponse);

        /** ServerResponse message. */
        public message: string;

        /** ServerResponse timestamp. */
        public timestamp: string;

        /**
         * Creates a new ServerResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ServerResponse instance
         */
        public static create(properties?: example.IServerResponse): example.ServerResponse;

        /**
         * Encodes the specified ServerResponse message. Does not implicitly {@link example.ServerResponse.verify|verify} messages.
         * @param message ServerResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: example.IServerResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ServerResponse message, length delimited. Does not implicitly {@link example.ServerResponse.verify|verify} messages.
         * @param message ServerResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: example.IServerResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ServerResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ServerResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): example.ServerResponse;

        /**
         * Decodes a ServerResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ServerResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): example.ServerResponse;

        /**
         * Verifies a ServerResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ServerResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ServerResponse
         */
        public static fromObject(object: { [k: string]: any }): example.ServerResponse;

        /**
         * Creates a plain object from a ServerResponse message. Also converts values to other types if specified.
         * @param message ServerResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: example.ServerResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ServerResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ServerResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
