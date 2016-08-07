
var GCChat = GCChat || function () {

    var clientId;
    var tryingToReconnect = false;

    var msgStatusCodes = { ERROR: 0, WARNING: 1, DEBUG: 2, INFO: 3 };

    var containers = {
        mainContainer: '.main-container',
        loginContainer: '.login',
        chatRoomContainer: '.chat-room',
        chatWindowContainer: '.chat-room .chat-window',
        userWindowContainer: '.chat-room .users'
    }

    var globalFormField = {
        sendMessageButton: '#btnSendMessage',
        username: '#hdUserName',
        userId: '#hdId',
        msgDateTime: '.message-date',
        settingsIcon: '#header .settings',
        settingsMenu: '.settings-menu',
        statusMessage: '.info, .debug, .error, .warning',
        displayDateTime: '#chkDisplayDateTime',
        displayStatusMessage: '#chkDisplayStatusMessage',
        playNotificationAudio: '#chkPlayNotificationAudio'
    }

    var loginFormField = {
        username: '#txtUserName',
        connectButton: '#btnStartChat'
    }

    var chatFormField = {
        username: '#lblUserName',
        message: '#txtMessage'
    }

    var privateChatFields = {
        closeWindow: '.close',
        message: '#txtPrivateMessage',
        messageDisplay: '.message-area'
    }

    function Init() {

        // display login screen
        setScreen(false);

        // initialise the chat server
        var chatHub = $.connection.chatHub;

        // register the global click events
        registerGlobalClicks();

        // register the client-server listeners
        registerClientMethods(chatHub);

        // connect to the server and initialise the client events
        //$.connection.hub.logging = true;
        $.connection.hub.start({ transport: ['webSockets', 'serverSentEvents', 'longPolling'] }).done(function () {

            clientId = $.connection.hub.id;

            registerEvents(chatHub);
            chatHub.server.connect();

            // set initial settings state
            //setSettings();
        });

        // display any errors
        $.connection.hub.error(function(error) {
            console.log('SignalR error: ' + error);
            addStatusMessage(chatHub, error, msgStatusCodes.ERROR);
        });

        // Handle the connectionSlow event to display a message as soon as SignalR is aware of connection problems, before it goes into reconnecting mode.
        $.connection.hub.connectionSlow(function () {
            addStatusMessage(chatHub, 'Server is suffering with connection problems', msgStatusCodes.WARNING);
        });

        // Handle the reconnecting event to display a message when SignalR is aware of a disconnection and is going into reconnecting mode.
        $.connection.hub.reconnecting(function () {
            tryingToReconnect = true;
        });

        // reconnected event
        $.connection.hub.reconnected(function () {
            tryingToReconnect = false;
        });

        $.connection.hub.disconnected(function () {
            if (tryingToReconnect) {
                addStatusMessage(chatHub, 'Disconnected from the server', msgStatusCodes.WARNING);
            }
        });

        // automatically re-connect on disconnection
        //$.connection.hub.disconnected(function () {
        //    setTimeout(function () {
        //        $.connection.hub.start();
        //    }, 5000);
        //});
    }

    // determine which screen to display: login/chat room
    function setScreen(isLogin) {
        if (!isLogin) {
            $(containers.chatRoomContainer).hide();
            $(containers.loginContainer).show();
            $(loginFormField.username).focus();
        } else {
            $(containers.chatRoomContainer).show();
            $(containers.loginContainer).hide();
            $(chatFormField.message).focus();
        }
    }

    // sets the initial state of the options available in the main menu
    function setSettings() {

        //display date and time on messages
        if (GCChat.Storage.GetDisplayDateTime()) {
            $(globalFormField.msgDateTime).show();
        } else {
            $(globalFormField.msgDateTime).hide();
        }

        // display the status messages
        if (GCChat.Storage.GetDisplayStatusMessage()) {
            $(globalFormField.statusMessage).parent().show();
        } else {
            $(globalFormField.statusMessage).parent().hide();
        }
    }

    // register the client side UI listener events
    function registerEvents(chatHub) {

        // attempt to connect to the server
        $(loginFormField.connectButton).click(function () {
            var name = $(loginFormField.username).val();
            if (name.length > 0) {
                chatHub.server.connect(name);
            } else {
                alert("Please enter name");
            }
        });

        // connect to the chat room when enter is pressed
        $(loginFormField.username).keypress(function (e) {
            if (e.which == 13) {
                $(loginFormField.connectButton).click();
            }
        });

        // attempt to send the message to the server
        $(globalFormField.sendMessageButton).on('click', function () {
            var msg = $(chatFormField.message).val();
            if (msg.length > 0) {
                var userName = $(globalFormField.username).val();
                chatHub.server.sendMessageToAll(userName, msg);
                $(chatFormField.message).val('').focus();
            }
        });

        // send the message when enter is pressed
        $(chatFormField.message).on('keypress', function (e) {
            if (e.which == 13) {
                $(globalFormField.sendMessageButton).click();
            }
        });

        // show / hide the date time
        $(globalFormField.displayDateTime).on('change', function () {
            $(globalFormField.msgDateTime).toggle();
            GCChat.Storage.SetDisplayDateTime(this.checked);
        });

        // show / hide the status messages
        $(globalFormField.displayStatusMessage).on('change', function () {
            $(globalFormField.statusMessage).parent().toggle();
            if ($(globalFormField.statusMessage).parent().is(':visible')) {
                scrollChatWindowToTop();
            }
            GCChat.Storage.SetDisplayStatusMessage(this.checked);
        });

        // play notification audio
        $(globalFormField.playNotificationAudio).on('change', function () {
            GCChat.Storage.SetPlayNotificationAudio(this.checked);
        });
    }

    // Register the global click events
    function registerGlobalClicks() {

        // settings popout menu
        $(globalFormField.settingsIcon).on('click', function (e) {
            $(globalFormField.settingsMenu).toggle();
            e.stopPropagation();
        });

        $('body').on('click', function () {

            // hide settings menu if it's  visible
            if ($(globalFormField.settingsMenu).is(':visible')) {
                $(globalFormField.settingsMenu).hide();
            }

        });
    }

    // register the client methods that are called form the server using SignalR
    function registerClientMethods(chatHub) {

        var i;

        // On User Successfully Logged In (caller only)
        chatHub.client.onConnected = function (id, userName, allUsers, messages) {

            // display chat room
            setScreen(true);

            // set page values
            $(globalFormField.userId).val(id);
            $(globalFormField.username).val(userName);
            $(chatFormField.username).html(userName);

            // Add all users to the user list
            for (i = 0; i < allUsers.length; i++) {
                addUser(chatHub, allUsers[i].ConnectionId, allUsers[i].UserName);
            }

            // Add existing messages to the chat window
            for (i = 0; i < messages.length; i++) {
                addMessage(messages[i].CreatedDate, messages[i].UserName, messages[i].Message);
            }

            // display the connection notification
            if (GCChat.Storage.GetPlayNotificationAudio()) {
                GCChat.Notification.PlayConnected();
            }

            // display the user in the chat window
            addStatusMessage(chatHub, userName + ' has joined the room', msgStatusCodes.INFO);
        }

        // On New User Connected (All except caller)
        chatHub.client.onNewUserConnected = function (id, name) {

            // Add the user to the users list
            addUser(chatHub, id, name);
        }

        // On User Disconnected
        chatHub.client.onUserDisconnected = function (id, userName) {

            // close any private chat windows
            //$('#private_' + id).remove();

            // log message to all private chat windows
            var createdDate = GCChat.Message.Format.Date(new Date());
            var msgHtml = GCChat.Message.GetMessageHtml(createdDate, userName, 'has left the room');
            $('#private_' + id).find(privateChatFields.messageDisplay).append(msgHtml);

            // remove the user from the user list
            $('#' + id).parent('li').removeClass('user').addClass('disconnect').delay(2000).fadeOut(600, function() {
                $(this).remove();
            });

            addStatusMessage(chatHub, userName + ' has left the room', msgStatusCodes.INFO);
        }

        // On Message Received
        chatHub.client.messageReceived = function (createdDate, userName, message) {
            addMessage(createdDate, userName, message);
        }

        // send private message
        chatHub.client.sendRecievePrivateMessage = function (userId, createdDate, fromUserName, message) {

            var ctrId = 'private_' + userId;

            // if the chat window doesn't exist on the receiving client then we need to create one
            if ($('#' + ctrId).length == 0) {
                createPrivateChatWindow(chatHub, userId, ctrId, fromUserName);
            }

            // play the message notification on the recieving client, we do this by checking the userId of the person raising the message
            if (clientId !== userId && GCChat.Storage.GetPlayNotificationAudio()) {
                GCChat.Notification.PlayMessage();
            }

            // format the message and append it to the chat window
            createdDate = GCChat.Message.Format.Date(createdDate);
            var msgHtml = GCChat.Message.GetMessageHtml(createdDate, fromUserName, message);
            $('#' + ctrId).find(privateChatFields.messageDisplay).append(msgHtml);

            // scroll to the latest message
            var height = $('#' + ctrId).find(privateChatFields.messageDisplay)[0].scrollHeight;
            $('#' + ctrId).find(privateChatFields.messageDisplay).scrollTop(height);
        }
    }

    // Add a user to the user's list
    function addUser(chatHub, newUserId, name) {

        var myUserId = $(globalFormField.userId).val();
        var code = '';

        // display other users as links to enable private chat
        if (myUserId == newUserId) {
            code = '<li class="username">' + name + '</li>';
            $(containers.userWindowContainer).prepend(code);
        } else {
            code = '<li class="user"><a id="' + newUserId + '">' + name + '</a></li>';
            $(containers.userWindowContainer).append(code);

            // when the user link is clicked, open a private chat window
            $('li.user a#' + newUserId).on('click', function () {
                var id = $(this).attr('id');
                openPrivateChatWindow(chatHub, newUserId, name);
            });
        }
    }

    // Add a message to the chat window
    function addMessage(createdDate, userName, message) {

        // covert any URL's to links
        message = GCChat.Message.Format.Url(message);

        // append any emoticons
        message = GCChat.Message.Format.Emoticons(message);

        // format the date
        createdDate = GCChat.Message.Format.Date(createdDate);

        // generate message html
        var msgHtml = GCChat.Message.GetMessageHtml(createdDate, userName, message);

        // hide the date time is the user has specified from the main menu
        if (!GCChat.Storage.GetDisplayDateTime()) {
            msgHtml = $(msgHtml).find(globalFormField.msgDateTime).hide().parent().wrapAll('<div></div>').parent().html();
        }

        // append it to the message box and scroll to the message
        $(containers.chatWindowContainer).append(msgHtml);
        scrollChatWindowToTop();
    }

    // Add a message to the chat window
    function addStatusMessage(chatHub, message, status) {

        // display the status messages
        if (!GCChat.Storage.GetDisplayStatusMessage()) {
            return;
        }

        var cssClass = 'info';

        switch (status) {
            case msgStatusCodes.ERROR:
                cssClass = 'error';
                break;
            case msgStatusCodes.WARNING:
                cssClass = 'warning';
                break;
            case msgStatusCodes.DEBUG:
                cssClass = 'debug';
                break;
            case msgStatusCodes.INFO:
                cssClass = 'info';
                break;
            default:
                cssClass = 'info';
                break;
        }

        // broadcast the status message
        chatHub.server.sendMessageToAll('', '<span class="' + cssClass + '">' + message + '</span>');
    }

    function scrollChatWindowToTop() {
        var height = $(containers.chatWindowContainer)[0].scrollHeight;
        $(containers.chatWindowContainer).scrollTop(height);
    }

    // Open a private chat window
    function openPrivateChatWindow(chatHub, id, userName) {
        var ctrId = 'private_' + id;
        if ($('#' + ctrId).length > 0) return;
        createPrivateChatWindow(chatHub, id, ctrId, userName);
    }

    // Create the private chat window
    function createPrivateChatWindow(chatHub, userId, ctrId, userName) {

        var chatHtml = '<div id="' + ctrId + '" class="ui-widget-content draggable private-chat" rel="0">' +
                    '<div class="header">' +
                        '<img class="close" src="Images/close.png"/>' +
                        '<span class="username" rel="0">' + userName + '</span>' +
                    '</div>' +
                    '<div class="message-area"></div>' +
                    '<div class="button-bar">' +
                        '<input id="txtPrivateMessage" type="text"   />' +
                        '<input id="btnSendMessage" type="button" value="Send" />' +
                    '</div>' +
                '</div>';

        var privateChat = $(chatHtml);

        // Close chat window
        privateChat.find(privateChatFields.closeWindow).on('click', function () {
            $('#' + ctrId).remove();
        });

        // Send message
        privateChat.find(globalFormField.sendMessageButton).on('click', function () {
            $textBox = privateChat.find(privateChatFields.message);
            var msg = $textBox.val();
            if (msg.length > 0) {
                chatHub.server.sendPrivateMessage(userId, msg);
                $textBox.val('').focus();
            }
        });

        // Send the message when enter is pressed
        privateChat.find(privateChatFields.message).on('keypress', function (e) {
            if (e.which == 13) {
                privateChat.find(globalFormField.sendMessageButton).click();
            }
        });

        // If the escape key is pressed then close the window
        privateChat.on('keyup', function (e) {
            if (e.keyCode == 27) {
                $('#' + ctrId).remove();;
            }
        });

        addPrivateChatWindow(privateChat);
        privateChat.find(privateChatFields.message).focus();
    }

    // Add a private chat window to the page
    function addPrivateChatWindow(privateChat) {
        $(containers.mainContainer).prepend(privateChat);

        privateChat.draggable({
            handle: '.header',
            stop: function () {

            }
        });

        ////privateChat.resizable({
        ////    stop: function () {

        ////    }
        ////});
    }

    return {
        Init: Init
    };

}();
