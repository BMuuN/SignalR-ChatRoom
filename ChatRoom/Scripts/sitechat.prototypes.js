String.prototype.beginsWith = function (t, i) {
    if (i == false) {
        return (t == this.substring(0, t.length));
    } else {
        return (t.toLowerCase() == this.substring(0, t.length).toLowerCase());
    }
}

String.prototype.endsWith = function (t, i) {
    if (i == false) {
        return (t == this.substring(this.length - t.length));
    } else {
        return (t.toLowerCase() == this.substring(this.length - t.length).toLowerCase());
    }
}

String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); }

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

String.prototype.replaceAll = function (find, replace) {
    return this.replace(new RegExp(find.escapeRegExp(), 'g'), replace);
}

String.prototype.escapeRegExp = function () {
    return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * A utility function to find all URLs - FTP, HTTP(S) and Email - in a text string
 * and return them in an array.  Note, the URLs returned are exactly as found in the text.
 * 
 * @return an array of URLs.
 */
String.prototype.findUrls = function () {
    var source = (this || '').toString();
    var urlArray = [];
    var url;
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

    // Iterate through any URLs in the text.
    while ((matchArray = regexToken.exec(source)) !== null) {
        var token = matchArray[0];
        urlArray.push(token);
    }

    return urlArray;
}