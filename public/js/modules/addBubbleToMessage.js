

const addBubbleToMessage = ($messageHTML, message, hasBeenCalledTwice) => {
    const $spanHTML = $($messageHTML.find('.message-bubble'));
    const username = message.from;
    $spanHTML.css({"background": message.colour });
    $spanHTML.attr("data-username", username)
             .removeClass('default-bubble bottom-bubble');
    $messageHTML.removeClass('contains-top-bubble');

    // Get username of previous and next message username
    const $previousMessageHTML = $messageHTML.prev();
    const $nextMessageHTML = $messageHTML.next();
    const previousMsgUsername = $previousMessageHTML.find('.message-bubble').getUsernameFromSpan();
    const nextMsgUsername = $nextMessageHTML.find('.message-bubble').getUsernameFromSpan();

    // console.log("previousMsgContainer", $previousMessageHTML);
    // console.log("nextMsgContainer", nextMsgUsername);
    // console.log("current username:", username);
    // console.log(`This message: ${$spanHTML.text()}, previous username: ${previousMsgUsername}`);
    // console.log(`This message: ${$spanHTML.text()}, next username: ${nextMsgUsername}`);
    // console.log("username", username)

    // If last message was from same user
    if (previousMsgUsername === username && nextMsgUsername === username) {
        $messageHTML.addClass('less-padding');
        $spanHTML.addClass('middle-bubble');

    // If next message is from same user
    } else if (nextMsgUsername === username){
        $spanHTML.addClass('top-bubble');
        $messageHTML.addClass('contains-top-bubble');
    // If message is in between messages from same user
    } else if (previousMsgUsername === username){
        $($messageHTML).find('.message__title').remove();
        $spanHTML.addClass('bottom-bubble');
        $messageHTML.addClass('contains-bottom-bubble');

        // Update text bubble of previous message and limit recursive call to two times
        if (!hasBeenCalledTwice){
            let hasBeenCalledTwice = true;
            addBubbleToMessage($previousMessageHTML, message,hasBeenCalledTwice);
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