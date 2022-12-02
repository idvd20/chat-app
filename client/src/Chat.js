import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
	const [currentMessage, setCurrentMessage] = useState("");
	const [messageList, setMessageList] = useState([]);

	function addZero(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}

	const sendMessage = async () => {
		if (currentMessage !== "") {
			const messageData = {
				room: room,
				author: username,
				message: currentMessage,
				time:
					addZero(new Date(Date.now()).getHours()) +
					":" +
					addZero(new Date(Date.now()).getMinutes()),
			};

			await socket.emit("send_message", messageData);
			setMessageList((list) => [...list, messageData]);
			setCurrentMessage("");
		}
	};

	useEffect(() => {
		socket.on("receive_message", (data) => {
			setMessageList((list) => [...list, data]);
		});
	}, [socket]);

	return (
		<div className='chat-window'>
			<div className='chat-header'>
				<p>User: {username}</p>
			</div>
			<div className='chat-header'>
				<p>Live Chat ({room})</p>
			</div>
			<div className='chat-body'>
				<ScrollToBottom className='message-container'>
					{messageList.map((messageContent) => {
						return (
							<div
								className='message'
								id={
									username === messageContent.author
										? "other"
										: "you"
								}
							>
								<div>
									<div className='message-content'>
										<p>{messageContent.message}</p>
									</div>
									<div className='message-meta'>
										<p id='time'>{messageContent.time}</p>
										<p id='author'>
											{messageContent.author}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</ScrollToBottom>
			</div>
			<div className='chat-footer'>
				<input
					type='text'
					value={currentMessage}
					placeholder='Hello world'
					onChange={(e) => {
						setCurrentMessage(e.target.value);
					}}
					onKeyPress={(e) => {
						e.key === "Enter" && sendMessage();
					}}
				/>
				<button onClick={sendMessage}>Send</button>
			</div>
		</div>
	);
}

export default Chat;
