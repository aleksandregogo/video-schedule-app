// >>>
{
    "protocol": "mdtp",
    "version": "1.0",
    "boxId": 1234,
    "packetId": 3452,
    "sessionId": 21,
    "timeStamp": 323423412342,
    "message": "AUTH:TOKEN:REQUEST"
}

// <<<
{
    "protocol": "mdtp",
    "version": "1.0",
    "packetId": 3452,
    "sessionId": 21,
    "timeStamp": 323423412342,
    "message": "AUTH:TOKEN:RESPONSE",
    "token": {
        "value": "1234567890",
        "validity": 3600
    }
}

// >>>
{
    "protocol": "mdtp",
    "version": "1.0",
    "boxId": 1234,
    "packetId": 3452,
    "sessionId": 21,
    "timeStamp": 323423412342,
    "token": "1234567890",
    "message": "EVENTS:LIST:REQUEST"
}

// <<<
{
    "protocol": "mdtp",
    "version": "1.0",
    "packetId": 3452,
    "sessionId": 21,
    "timeStamp": 323423412342,
    "message": "EVENTS:LIST:RESPONSE",
    "events": [
        {
            "id": 2342,
            "name": "Requested video name",
            "desc": "Optional event description for enhansed logging",
            "dates": [
                { "from": "2024/01/22-12:00:00", "to": "2024/01/23-12:00:00" },
                { "from": "2024/01/23-19:00:00", "to": "2024/01/24-12:00:00" },
                { "from": "2024/01/24-19:00:00", "to": "2024/01/25-12:00:00" }
            ],
        },
        {
            "id": 2344,
            "name": "Another video name",
            "desc": "Optional event description for enhansed logging",
            "dates": [
                { "from": "2024/01/23-12:00:00", "to": "2024/01/23-19:00:00" },
                { "from": "2024/01/24-12:00:00", "to": "2024/01/24-19:00:00" },
                { "from": "2024/01/25-12:00:00", "to": "2024/01/25-19:00:00" }
            ],
        }
    ]
}

// >>>
{
    "protocol": "mdtp",
    "version": "1.0",
    "boxId": 1234,
    "packetId": 3452,
    "sessionId": 21,
    "timeStamp": 323423412342,
    "token": "1234567890",
    "message": "EVENTS:DATA:REQUEST",
    "eventId": 2342,
}

// <<<
{
    "protocol": "mdtp",
    "version": "1.0",
    "boxId": 1234,
    "packetId": 3452,
    "sessionId": 21,
    "timeStamp": 323423412342,
    "message": "EVENTS:DATA:RESPONSE",
    "event": {
        "id": 2342,
        "name": "Requested video name",
        "desc": "Optional event description for enhansed logging",
        "url": "http://www.example.com/video.mp4",
        "size": 567245645,
        "sha256": "lkaudsfhoa8fa9dfaosiufh78o43rt09hgsg",
        "token" {
            "value": "735463563454",
            "validity": 3600
        }
    }
}

// >>>
{
    "protocol": "mdtp",
    "version": "1.0",
    "boxId": 1234,
    "packetId": 3452,
    "sessionId": 21,
    "timeStamp": 323423412342,
    "token": "1234567890",
    "message": "DATA:RECV:DONE",
    "eventId": 2342,
}

// >>>
{
    "protocol": "mdtp",
    "version": "1.0",
    "boxId": 1234,
    "packetId": 3452,
    "sessionId": 21,
    "timeStamp": 323423412342,
    "token": "1234567890",
    "message": "DATA:RECV:ERROR",
    "error": "Error message",
    "eventId": 2342,
}

// <<<
{
    "protocol": "mdtp",
    "version": "1.0",
    "packetId": 3452,
    "sessionId": 21,
    "timeStamp": 323423412342,
    "message": "EVENTS:EVENT:CREATED",
    "event": {
        "id": 2345,
        "name": "Another video name",
        "desc": "Optional event description for enhansed logging",
        "dates": [
            { "from": "2024/01/23-12:00:00", "to": "2024/01/23-19:00:00" },
            { "from": "2024/01/24-12:00:00", "to": "2024/01/24-19:00:00" },
            { "from": "2024/01/25-12:00:00", "to": "2024/01/25-19:00:00" }
        ]
    }
}

// <<<
{
    "protocol": "mdtp",
    "version": "1.0",
    "packetId": 3452,
    "sessionId": 21,
    "timeStamp": 323423412342,
    "message": "EVENTS:DATA:REMOVE",
    "events": [
        2345,
        2346
    ]
}

// >>>
{
    "protocol": "mdtp",
    "version": "1.0",
    "packetId": 3452,
    "sessionId": 21,
    "timeStamp": 323423412342,
    "message": "EVENTS:DATA:REMOVE",
    "events": [
        2345,
        2346
    ]
}