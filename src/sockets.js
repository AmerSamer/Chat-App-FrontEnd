import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import $ from 'jquery'
import { serverAddress } from "./constants"

let stompClient;
let messages = [];
const socketFactory = () => {
    return new SockJS(serverAddress + '/ws');
}

const onMessageReceived = (payload) => {
    var message = JSON.parse(payload.body);
    // messages.push(message)
    let textArea = $('#main-chat');
    textArea.val(textArea.val() + "\n" + message.sender + ": " + message.content);
}

const onMessageReceivedPrivate = (payload) => {
    var message = JSON.parse(payload.body);
    // messages.push(message)
    let textArea = $('#private-chat-textarea' + message.roomId);
    textArea.val(textArea.val() + "\n" + message.sender + ": " + message.content);
}

const onConnected = () => {
    stompClient.subscribe('/topic/mainChat', onMessageReceived);
    stompClient.send("/app/hello", [],
        JSON.stringify({ name: "Default user" })
    )
}

const openChatRoom = (roomId) => {
    stompClient.subscribe('/topic/privatechat/' + roomId, onMessageReceivedPrivate);
}

const closeChatRoom = () => {
    stompClient.unsubscribe('/topic/privatechat/{roomId}');
}

const openConnection = () => {
    const socket = socketFactory();
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected);
}

const sendPlainMessage = (user, message) => {
    stompClient.send("/app/plain", [], JSON.stringify({
        sender: user,
        content: message
    }))
}

const sendPrivatePlainMessage = (userSender, userReceiver, message, roomId) => {
    stompClient.send("/app/plain/privatechat/" + roomId, [], JSON.stringify({
        sender: userSender,
        receiver: userReceiver,
        content: message,
        roomId: roomId
    }))
}

export { openConnection, sendPlainMessage, openChatRoom, sendPrivatePlainMessage , closeChatRoom }