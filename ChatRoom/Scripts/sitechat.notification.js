GCChat.Notification = GCChat.Notification || function () {

    var _notify = {
        Connected: 'audioConnected',
        Message: 'audioMessage'
    }

    function playConnected() {
        document.getElementById(_notify.Connected).play();
    }

    function playMessage() {
        document.getElementById(_notify.Message).play();
    }

    return {
        PlayConnected: playConnected,
        PlayMessage: playMessage
    };

}();