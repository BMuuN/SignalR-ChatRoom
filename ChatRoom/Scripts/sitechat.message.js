GCChat.Message = GCChat.Message || function () {

    function init() {

    }

    function getMessageHtml(createdDate, username, message) {
        if (username == '') {
            return '<div class="message"><span class="message-date">' + createdDate + ':</span> ' + message + '</div>';
        } else {
            return '<div class="message"><span class="message-date">' + createdDate + '</span>&nbsp;<span class="user-name">' + username + '</span>: ' + message + '</div>';
        }
    }

    return {
        Init: init,
        GetMessageHtml: getMessageHtml
    };

}();