import React, { useEffect, useState } from "react";

function Chat({ socket, username, room }) {
	const [currentMessage, setCurrentMessage] = useState("");
	const [messageList, setMessageList] = useState([]);

	const sendMessage = async () => {
		if (currentMessage !== "") {
			const messageData = {
				room: room,
				author: username,
				message: currentMessage,
				time:
					new Date(Date.now()).getHours() +
					":" +
					new Date(Date.now()).getMinutes(),
			};

			await socket.emit("send_message", messageData);
			setMessageList((list) => [...list, messageData]);
		}
	};

	useEffect(() => {
		socket.on("receive_message", (data) => {
			setMessageList((list) => [...list, data]);
		});
	}, [socket]);

	return (
		<div class='chat-window'>
			<div class='chat-header'>
				<p>Live Chat</p>
			</div>
			<div class='chat-body'>
				{messageList.map((messageContent) => {
					return (
						<div
							class='message'
							id={
								username === messageContent.author
									? "you"
									: "other"
							}
						>
							<div>
								<div class='message-content'>
									<p>{messageContent.message}</p>
								</div>
								<div className='message-meta'>
									<p id='time'>{messageContent.time}</p>
									<p id='author'>{messageContent.author}</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<div class='chat-footer'>
				<input
					type='text'
					placeholder='Hello world'
					onChange={(event) => {
						setCurrentMessage(event.target.value);
					}}
					onKeyPress={(event) => {
						event.key === "Enter" && sendMessage();
					}}
				/>
				<button onClick={sendMessage}>Send</button>
			</div>
		</div>
	);
}

export default Chat;
