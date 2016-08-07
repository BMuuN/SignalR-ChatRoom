GCChat.Storage = GCChat.Storage || function () {

    var _settingName = {
        displayDateTime: "DisplayDateTime",
        displayStatusMessage: "DisplayStatusMessage",
        playNotificationAudio: "PlayNotificationAudio"
    }

    function Init() {

        if (typeof (Storage) !== "undefined") {

            //var a = getDisplayDateTime();
            //var b = getDisplayStatusMessage();
            //var c = getPlayNotificationAudio();

        } else {
            // Sorry! No Web Storage support..
        }
    }

    function getDisplayDateTime() {
        var displayDateTime = getItem(_settingName.displayDateTime);
        if (displayDateTime === null) {
            return false;
        } else {
            return (displayDateTime === 'true');
        }
    }

    function setDisplayDateTime(value) {
        setItem(_settingName.displayDateTime, value);
    }

    function getDisplayStatusMessage() {
        var displayStatusMessage = getItem(_settingName.displayStatusMessage);
        if (displayStatusMessage === null) {
            return false;
        } else {
            return (displayStatusMessage === 'true');
        }
    }

    function setDisplayStatusMessage(value) {
        setItem(_settingName.displayStatusMessage, value);
    }

    function getPlayNotificationAudio() {
        var playAudio = getItem(_settingName.playNotificationAudio);
        if (playAudio === null) {
            return false;
        } else {
            return (playAudio === 'true');
        }
    }

    function setPlayNotificationAudio(value) {
        setItem(_settingName.playNotificationAudio, value);
    }

    function getItem(name) {
        if (typeof (Storage) !== "undefined") {
            return localStorage.getItem(name);
        } else {
            return null;
        }
    }

    function setItem(name, value) {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem(name, value);
        }
    }

    return {
        Init: Init,
        GetDisplayDateTime: getDisplayDateTime,
        GetDisplayStatusMessage: getDisplayStatusMessage,
        GetPlayNotificationAudio: getPlayNotificationAudio,
        SetDisplayDateTime: setDisplayDateTime,
        SetDisplayStatusMessage: setDisplayStatusMessage,
        SetPlayNotificationAudio: setPlayNotificationAudio
    };

}();
