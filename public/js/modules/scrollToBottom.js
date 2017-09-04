export default function scrollToBottom() {
    // Selectors
    const $messages = $('#messages');
    const newMessage = $messages.children('li:last-child');
    // Heights
    const clientHeight = $messages.prop('clientHeight');
    const scrollTop = $messages.prop('scrollTop');
    const scrollHeight = $messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();


    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight ){
        $messages.scrollTop(scrollHeight);
        console.log(clientHeight)
    }
}