let chatSocket = null;
let roomNotificationSocket = null;
let currentRoomId = null;

function flipToChatView() {
    const dashboardCard = document.querySelector(".card");

    if (dashboardCard && !dashboardCard.classList.contains("flipped")) {
        dashboardCard.classList.add("flipped");
        console.log("Dashboard flipped to chat view (from dashboard front).");
    } else {
        console.log("Dashboard already in chat view or is not a flip card. No flip triggered.");
    }
}
function flipToDashboardView() {
    const dashboardCard = document.querySelector(".card");

    if (dashboardCard && dashboardCard.classList.contains("flipped")) {
        dashboardCard.classList.remove("flipped");
        console.log("Dashboard flipped back to overview.");
    }

    if (chatSocket) {
        chatSocket.close();
        chatSocket = null;
        console.log("Chat WebSocket closed.");
    }
    currentRoomId = null;
    document.getElementById("chatWithLabel").textContent = "Select a chat to begin";
    document.getElementById("chatContainer").innerHTML = "";

    document.querySelectorAll('.room-item.active').forEach(item => item.classList.remove('active'));
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}


function loadChatRoom(roomId, otherUsername) {
    const dashboardCard = document.querySelector(".card");
    if (currentRoomId === roomId && dashboardCard.classList.contains("flipped")) {
        console.log(`Already in chatroom ${roomId} and card is flipped. No action.`);
        return;
    }
    flipToChatView();

    currentRoomId = roomId;

    document.querySelectorAll('.room-item').forEach(item => item.classList.remove('active'));
    const clickedRoomItem = document.getElementById(`room-${roomId}`);
    if (clickedRoomItem) {
        clickedRoomItem.classList.add('active');

        const badge = clickedRoomItem.querySelector(".unread-badge");
        if (badge) {
            badge.remove();
        }
        clickedRoomItem.classList.remove("fw-bold");
    }

    document.getElementById("chatWithLabel").textContent = `Chat with ${otherUsername}`;
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.innerHTML = "<p class='text-muted text-center mt-5'>Loading messages...</p>";

    fetch(`/api/chat/${roomId}/messages/`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(messages => {
            if (currentRoomId !== roomId) {
                console.log(`Aborted rendering for room ${roomId} as user navigated away.`);
                return;
            }
            chatContainer.innerHTML = "";

            if (messages.length === 0) {
                chatContainer.innerHTML = "<p class='text-muted text-center mt-5'>No messages yet. Start a conversation!</p>";
            } else {
                messages.forEach(msg => {
                    const div = document.createElement("div");
                    div.className = "message " + (msg.sender_id === CURRENT_USER_ID ? "me" : "them");

                    const bubble = document.createElement("div");
                    bubble.className = "bubble";
                    const formattedTimestamp = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    bubble.innerHTML = `
                        <small class="sender">${msg.sender_username}</small><br>
                        ${msg.message}<br>
                        <small class="timestamp">${formattedTimestamp}</small>
                    `;

                    div.appendChild(bubble);
                    chatContainer.appendChild(div);
                });
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }

            fetch(`/api/chat/${roomId}/mark_read/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
            }).then(response => {
                if (response.ok) {
                    const roomItem = document.getElementById(`room-${roomId}`);
                    if (roomItem) {
                        roomItem.querySelector(".unread-badge")?.remove();
                        roomItem.classList.remove("fw-bold");
                    }
                } else {
                    console.warn(`Failed to mark messages as read for room ${roomId}. Status: ${response.status}`);
                }
            }).catch(err => {
                console.error(" Failed to mark messages as read:", err);
            });
        })
        .catch(err => {
            console.error("Failed to fetch messages:", err);
            if (currentRoomId === roomId) {
                chatContainer.innerHTML = "<p class='text-danger text-center mt-5'>Failed to load messages. Please try again.</p>";
            }
        });
    if (chatSocket) {
        chatSocket.close();
        chatSocket = null;
    }

    chatSocket = new WebSocket(`ws://${window.location.host}/ws/chat/${roomId}/`);

    chatSocket.onmessage = e => {
        const data = JSON.parse(e.data);
        if (data.room_id !== parseInt(currentRoomId) || !data.message) {
            console.log("Received message for a different or invalid room, ignoring.");
            return;
        }

        const div = document.createElement("div");
        div.className = "message " + (data.sender_id === CURRENT_USER_ID ? "me" : "them");

        const bubble = document.createElement("div");
        bubble.className = "bubble";
        const formattedTimestamp = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        bubble.innerHTML = `
            <small class="sender">${data.sender_username}</small><br>
            ${data.message}<br>
            <small class="timestamp">${formattedTimestamp}</small>
        `;

        if (data.sender_id !== CURRENT_USER_ID) {
            bubble.classList.add("blink");
            setTimeout(() => bubble.classList.remove("blink"), 1000);
            fetch(`/api/chat/${currentRoomId}/mark_read/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
            }).catch(err => console.warn("Failed to re-mark messages as read on new message:", err));
        }

        div.appendChild(bubble);
        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    chatSocket.onclose = () => console.warn("🔌 Chat WebSocket closed.");
    chatSocket.onerror = err => console.error("Chat WebSocket error:", err);
}


document.addEventListener("DOMContentLoaded", () => {
    const dashboardCard = document.querySelector(".card");
    if (dashboardCard) {
        dashboardCard.classList.remove("flipped");
    }

    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");

    sendBtn?.addEventListener("click", () => {
        const msg = messageInput.value.trim();
        if (!msg || !chatSocket || chatSocket.readyState !== WebSocket.OPEN) return;
        chatSocket.send(JSON.stringify({ message: msg }));
        messageInput.value = "";
    });

    messageInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    roomNotificationSocket = new WebSocket(`ws://${window.location.host}/ws/rooms/`);

    roomNotificationSocket.onopen = () => console.log("📡 Connected to room notifications.");
    roomNotificationSocket.onerror = err => console.error("Room WebSocket error:", err);
    roomNotificationSocket.onclose = () => console.warn("🔌 Room notification WebSocket closed.");

roomNotificationSocket.onmessage = e => {
    const data = JSON.parse(e.data);
    const roomList = document.getElementById("roomList");
    const roomId = data.room_id;
    let roomElem = document.getElementById(`room-${roomId}`);

    if (data.type === "new_room") {
        if (!roomElem) {
            const li = document.createElement("li");
            li.id = `room-${roomId}`;

            li.className = "room-item chat-button list-group-item d-flex justify-content-between align-items-center fw-bold";
            li.onclick = () => loadChatRoom(roomId, data.other_user_username);

            const avatarSrc = data.other_user_avatar || `https://ui-avatars.com/api/?name=${data.other_user_username}&background=567C8D&color=fff`;

            li.innerHTML = `
                <div class="chat-info">
                    <div class="chat-avatar">
                        <img src="${avatarSrc}" alt="${data.other_user_username} avatar"/>
                    </div>
                    <div class="chat-details">
                        <span class="chat-name">${data.other_user_username}</span>
                        <p class="last-msg">${data.last_message || "New conversation started"}</p>
                    </div>
                </div>
                <span class="badge bg-danger unread-badge">${data.unread_count || 1}</span>
            `;
            const noConvos = document.getElementById("no-conversations");
            noConvos?.remove();
            roomList.prepend(li);
            roomElem = li;

        } else {
            roomList.prepend(roomElem);
            const lastMsgP = roomElem.querySelector('.last-msg');
            if (lastMsgP && data.last_message) {
                lastMsgP.textContent = data.last_message;
            }
            let badge = roomElem.querySelector(".unread-badge");
            if (!badge && data.unread_count > 0) {
                 badge = document.createElement("span");
                 badge.className = "badge bg-danger unread-badge";
                 roomElem.appendChild(badge);
            }
            if (badge) badge.textContent = data.unread_count || 1;
            roomElem.classList.add("fw-bold");
        }
        roomElem.classList.add("blink");
        setTimeout(() => roomElem.classList.remove("blink"), 1500);

    } else if (data.type === "unread_count_update" && roomElem) {
        if (parseInt(roomId) === currentRoomId) {

            roomList.prepend(roomElem);
            const lastMsgP = roomElem.querySelector('.last-msg');
            if (lastMsgP && data.last_message) {
                lastMsgP.textContent = data.last_message;
            }
            return;
        }


        let badge = roomElem.querySelector(".unread-badge");
        let unreadCount = data.unread_count;

        if (unreadCount > 0) {
            if (badge) {
                badge.textContent = unreadCount;
            } else {
                badge = document.createElement("span");
                badge.className = "badge bg-danger unread-badge";
                badge.textContent = unreadCount;
                roomElem.appendChild(badge);
            }
            roomElem.classList.add("fw-bold", "blink");
            setTimeout(() => roomElem.classList.remove("blink"), 1500);
            roomList.prepend(roomElem);
            const lastMsgP = roomElem.querySelector('.last-msg');
            if (lastMsgP && data.last_message) {
                lastMsgP.textContent = data.last_message;
            }
        } else {

            if (badge) badge.remove();
            roomElem.classList.remove("fw-bold");
        }
    }
};

    const backToDashboardButton = document.getElementById("backToDashboardButton");
    if (backToDashboardButton) {
        backToDashboardButton.addEventListener("click", flipToDashboardView);
    }
});