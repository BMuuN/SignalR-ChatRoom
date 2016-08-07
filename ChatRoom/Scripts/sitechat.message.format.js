GCChat.Message.Format = GCChat.Message.Format || function () {

    // Format the date
    function formatDate(d) {

        var messageDate = new Date(d);
        var dd = messageDate.getDate();
        var mm = messageDate.getMonth() + 1; //January is 0!
        var yyyy = messageDate.getFullYear();
        var hh = messageDate.getHours();
        var min = messageDate.getMinutes();
        var ss = messageDate.getSeconds();

        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        if (hh < 10) { hh = '0' + hh }
        if (min < 10) { min = '0' + min }
        if (ss < 10) { ss = '0' + ss }

        messageDate = mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + min;

        return messageDate;
    }

    // Format the message to replace all emoticons shortcuts with the image html
    function formatEmoticons(message) {

        var aspect = 'width="20" height="20"';

        // ahhhh
        //if (message.indexOf('') > -1) {
        //    message = message.replaceAll('', '<img src="Images/emoticons/ahhhh.png" />');
        //}

        // alien
        //if (message.indexOf('') > -1) {
        //    message = message.replaceAll('', '<img src="Images/emoticons/alien.png" />');
        //}

        // bad
        //if (message.indexOf('') > -1) {
        //    message = message.replaceAll('', '<img src="Images/emoticons/bad.png" />');
        //}

        // blush :$
        if (message.indexOf(':$') > -1) {
            message = message.replaceAll(':$', '<img src="Images/emoticons/blush.png"' + aspect + '" />');
        }

        // cool B)
        if (message.indexOf('B)') > -1) {
            message = message.replaceAll('B)', '<img src="Images/emoticons/cool.png"' + aspect + '" />');
        }


        // crying :'(
        if (message.indexOf(':\'(') > -1) {
            message = message.replaceAll(':\'(', '<img src="Images/emoticons/crying.png"' + aspect + '" />');
        }

        // devil
        //if (message.indexOf('') > -1) {
        //    message = message.replaceAll('', '<img src="Images/emoticons/devil.png"' + aspect + '" />');
        //}

        // doh
        //if (message.indexOf('') > -1) {
        //    message = message.replaceAll('', '<img src="Images/emoticons/doh.png"' + aspect + '" />');
        //}

        // happy :)
        if (message.indexOf(':)') > -1) {
            message = message.replaceAll(':)', '<img src="Images/emoticons/happy.png"' + aspect + '" />');
        }

        // huh
        //if (message.indexOf('') > -1) {
        //    message = message.replaceAll('', '<img src="Images/emoticons/huh.png"' + aspect + '" />');
        //}

        // laugh
        //if (message.indexOf('') > -1) {
        //    message = message.replaceAll('', '<img src="Images/emoticons/laugh.png"' + aspect + '" />');
        //}

        // love
        //if (message.indexOf('') > -1) {
        //    message = message.replaceAll('', '<img src="Images/emoticons/love.png"' + aspect + '" />');
        //}

        // mad :@
        if (message.indexOf(':@') > -1) {
            message = message.replaceAll(':@', '<img src="Images/emoticons/mad.png"' + aspect + '" />');
        }

        // ninja
        //if (message.indexOf('') > -1) {
        //    message = message.replaceAll('', '<img src="Images/emoticons/ninja.png"' + aspect + '" />');
        //}

        // ohhhh :O
        if (message.indexOf(':O') > -1) {
            message = message.replaceAll(':O', '<img src="Images/emoticons/ohhhh.png"' + aspect + '" />');
        }

        // sad :(
        if (message.indexOf(':(') > -1) {
            message = message.replaceAll(':(', '<img src="Images/emoticons/sad.png"' + aspect + '" />');
        }

        // scary
        //if (message.indexOf('') > -1) {
        //    message = message.replaceAll('', '<img src="Images/emoticons/scary.png"' + aspect + '" />');
        //}

        // scary-smile
        //if (message.indexOf('') > -1) {
        //    message = message.replaceAll('', '<img src="Images/emoticons/scary-smile.png"' + aspect + '" />');
        //}

        // shocking :O?
        if (message.indexOf(':O?') > -1) {
            message = message.replaceAll(':O?', '<img src="Images/emoticons/shocking.png"' + aspect + '" />');
        }

        // sick :#
        if (message.indexOf(':#') > -1) {
            message = message.replaceAll(':#', '<img src="Images/emoticons/sick.png"' + aspect + '" />');
        }

        // sleep :Z
        if (message.indexOf(':Z') > -1) {
            message = message.replaceAll(':Z', '<img src="Images/emoticons/sleep.png"' + aspect + '" />');
        }

        // smile :D
        if (message.indexOf(':D') > -1) {
            message = message.replaceAll(':D', '<img src="Images/emoticons/smile.png"' + aspect + '" />');
        }

        // tear :'
        if (message.indexOf(':\'') > -1) {
            message = message.replaceAll(':\'', '<img src="Images/emoticons/tear.png"' + aspect + '" />');
        }

        // tounge :P
        if (message.indexOf(':P') > -1) {
            message = message.replaceAll(':P', '<img src="Images/emoticons/tounge.png"' + aspect + '" />');
        }

        // what :/
        if (message.indexOf(':/') > -1) {
            message = message.replaceAll(':/', '<img src="Images/emoticons/what.png"' + aspect + '" />');
        }

        // wink ;)
        if (message.indexOf(';)') > -1) {
            message = message.replaceAll(';)', '<img src="Images/emoticons/wink.png"' + aspect + '" />');
        }

        // woot
        //if (message.indexOf('') > -1) {
        //    message = message.replaceAll('', '<img src="Images/emoticons/woot.png"' + aspect + '" />');
        //}

        return message;
    }

    function formatUrl(message) {

        var url = '';
        var urls = message.findUrls();
        for (i = 0; i < urls.length; i++) {
            var url = '<a href="' + urls[i] + '" target="_blank">' + urls[i] + '</a>';
            message = message.replaceAll(urls[i], url);
        }

        return message;
    }

    return {
        Date: formatDate,
        Emoticons: formatEmoticons,
        Url: formatUrl
    };

}();