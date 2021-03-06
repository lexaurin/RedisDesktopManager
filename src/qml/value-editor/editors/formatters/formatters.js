.import "./msgpack.js" as MsgPack
.import "./hexy.js" as Hexy
.import "./php-unserialize.js" as PHPUnserialize

/**
  Plain formatter
**/

var plain = {
    title: "Plain Text",
    readOnly: false,
    binary: false,
    htmlOutput: false,

    getFormatted: function (raw) {        
        return raw
    },

    isValid: function (raw) {
        return true
    },

    getRaw: function (formatted) {
        return formatted
    }
}

var hex = {
    title: "HEX",
    readOnly: false,
    binary: true,
    htmlOutput: false,

    getFormatted: function (raw) {
        return binaryUtils.printable(binaryUtils.binaryListToValue(raw))
    },

    isValid: function (raw) {
        return binaryUtils.isBinaryString(binaryUtils.binaryListToValue(raw))
    },

    getRaw: function (formatted) {
        return binaryUtils.valueToBinary(binaryUtils.printableToValue(formatted))
    }
}

var hexTable = {
    title: "HEX TABLE",
    readOnly: true,
    binary: true,
    htmlOutput: true,

    getFormatted: function (raw) {
        var format = {'html': true}
        return Hexy.hexy(raw, format)
    },

    isValid: function (raw) {
        return true
    },

    getRaw: function (formatted) {
        return ''
    }
}

/**
  JSON formatter
**/
var json = {
    title: "JSON",
    readOnly: false,
    binary: false,
    htmlOutput: false,

    getFormatted: function (raw) {

        try {
            var parsed = JSON.parse(raw)
            return JSON.stringify(parsed, undefined, 4)

        } catch (e) {
            return "Error: Invalid JSON"
        }
    },

    isValid: function (raw) {
        try {
            JSON.parse(raw)
            return true
        } catch (e) {
            return false
        }
    },

    getRaw: function (formatted) {        
        try {
            var parsed = JSON.parse(formatted)
            return JSON.stringify(parsed)

        } catch (e) {
            return formatted
        }
    }
}

/**
  MsgPack formatter
**/
var msgpack = {
    title: "MSGPACK",
    readOnly: false,
    binary: true,
    htmlOutput: false,

    getFormatted: function (raw) {
        try {
            var parsed = MsgPack.msgpack().unpack(raw)
            console.log('parsed msgpack:', parsed)
            return JSON.stringify(parsed, undefined, 4)

        } catch (e) {
            return "Error: Invalid MSGPack or JSON" + e
        }
    },

    isValid: function (raw) {
        try {
            return MsgPack.msgpack().unpack(raw) !== undefined
        } catch (e) {
            return false
        }
    },

    getRaw: function (formatted) {
        var obj = JSON.parse(formatted)
        var compressed = MsgPack.msgpack().pack(obj)
        return compressed
    }
}

/**
  PHP Serialize formatter
**/
var phpserialized = {
    title: "PHP Serializer",
    readOnly: true,    
    binary: false,
    htmlOutput: false,

    getFormatted: function (raw) {

        try {
            var parsed = PHPUnserialize.unserialize(raw)
            console.log('parsed php serialized:', JSON.stringify(parsed))
            return JSON.stringify(parsed, undefined, 4)

        } catch (e) {
            return "Error: Invalid PHP Serialized String: " + JSON.stringify(e)
        }
    },

    isValid: function (raw) {
        try {
            PHPUnserialize.unserialize(raw)
            return true
        } catch (e) {
            return false
        }
    },

    getRaw: function (formatted) {
        var obj = JSON.parse(formatted)
        return PHPSerialize.serialize(obj)
    }
}

var defaultFormatterIndex = 0;                        
var enabledFormatters = [plain, json, msgpack, hex, hexTable, phpserialized]

function guessFormatter(isBinary, value)
{
    var tryFormatters = isBinary? [2, 5, 3, 4] : [1, 5, 2]

    for (var index in tryFormatters) {
        var val = (enabledFormatters[tryFormatters[index]].binary) ?
            binaryUtils.valueToBinary(value) : binaryUtils.toUtf(value)

        if (enabledFormatters[tryFormatters[index]].isValid(val)){
            return tryFormatters[index]
        }
    }
    return 0 // Plain text
}
