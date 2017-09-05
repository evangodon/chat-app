
const addBubbleToMessage = ($messageHTML, message, hasBeenCalledTwice) => {
    const $spanHTML = $($messageHTML.find('.message-bubble'));
    const username = message.from;
    $spanHTML.css({"background": message.colour });
    $spanHTML.attr("data-username", username)
             .removeClass('default-bubble bottom-bubble');
    $messageHTML.removeClass('contains-top-bubble');

    // Get username of previous and next message username
    const $prevMessageHTML = $messageHTML.prev();
    const $nextMessageHTML = $messageHTML.next();
    const prevMsgUsername = $prevMessageHTML.find('.message-bubble').getUsernameFromSpan();
    const nextMsgUsername = $nextMessageHTML.find('.message-bubble').getUsernameFromSpan();

    if (prevMsgUsername === username && nextMsgUsername === username) {
        $messageHTML.addClass('less-padding');
        $spanHTML.addClass('middle-bubble');

    } else if (nextMsgUsername === username){
        $spanHTML.addClass('top-bubble');
        $messageHTML.addClass('contains-top-bubble');

    } else if (prevMsgUsername === username){
        $($messageHTML).find('.message__title').remove();
        $spanHTML.addClass('bottom-bubble');
        $messageHTML.addClass('contains-bottom-bubble');
        // Update text bubble of previous message and limit recursive call to two times
        if (!hasBeenCalledTwice){
            let hasBeenCalledTwice = true;
            addBubbleToMessage($prevMessageHTML, message,hasBeenCalledTwice);
        }
    } else {
        $spanHTML.addClass('default-bubble');
    }
}

$.fn.getUsernameFromSpan = function() {
    if (this.length > 0) {
        return this[0].dataset.username;
    } else{
        return null;
    }
}

module.exports = {addBubbleToMessage};