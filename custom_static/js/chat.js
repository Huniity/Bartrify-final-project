let chatSocket = null;
let roomNotificationSocket = null;
let currentRoomId = null;

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}


function flipToChat() {
    document.querySelector(".card").classList.add("flipped");
}

function flipToDashboard() {
    document.querySelector(".card").classList.remove("flipped");
    if (chatSocket) {
        chatSocket.close();
        chatSocket = null;
    }
}

function loadChatRoom(roomId, otherUsername) {
    if (currentRoomId === roomId) return;

    currentRoomId = roomId;
    document.getElementById("chatWithLabel").textContent = `Chat with ${otherUsername}`;
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.innerHTML = "<p class='text-muted'>Loading messages...</p>";

    // Flip card to chat view
    flipToChat();

    // Fetch message history
    fetch(`/api/chat/${roomId}/messages/`)
        .then(res => res.json())
        .then(messages => {
            chatContainer.innerHTML = "";
            messages.forEach(msg => {
                const div = document.createElement("div");
                div.className = "message " + (msg.sender_id === CURRENT_USER_ID ? "me" : "them");

                const bubble = document.createElement("div");
                bubble.className = "bubble";
                bubble.innerHTML = `
        <small class="sender">${msg.sender_username}</small><br>
        ${msg.message}<br>
        <small class="timestamp">${msg.timestamp}</small>
      `;

                div.appendChild(bubble);
                chatContainer.appendChild(div);
            });
            chatContainer.scrollTop = chatContainer.scrollHeight;

            // ✅ Mark messages as read after loading them
            fetch(`/api/chat/${roomId}/mark_read/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"), // Ensure getCookie is defined
                },
            }).then(() => {
                console.log("✅ Marked messages as read.");
            }).catch(err => {
                console.error("❌ Failed to mark messages as read:", err);
            });
        })
        .catch(err => {
            console.error("Failed to fetch messages:", err);
            chatContainer.innerHTML = "<p class='text-danger'>Failed to load messages.</p>";
        });

    // Open WebSocket
    if (chatSocket) chatSocket.close();

    chatSocket = new WebSocket(`ws://${window.location.host}/ws/chat/${roomId}/`);

    chatSocket.onmessage = e => {
        const data = JSON.parse(e.data);
        if (!data.message) return;

        const div = document.createElement("div");
        div.className = "message " + (data.sender_id === CURRENT_USER_ID ? "me" : "them");

        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.innerHTML = `
    <small class="sender">${data.sender_username}</small><br>
    ${data.message}<br>
    <small class="timestamp">${data.timestamp}</small>
  `;

        if (data.sender_id !== CURRENT_USER_ID) {
            bubble.classList.add("blink");
            setTimeout(() => bubble.classList.remove("blink"), 1000);
        }

        div.appendChild(bubble);
        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // ✅ Add this to re-mark as read if the user is in this chat
        if (data.sender_id !== CURRENT_USER_ID && data.room_id === currentRoomId) {
            fetch(`/api/chat/${currentRoomId}/mark_read/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
            }).catch(err => console.warn("Failed to re-mark messages:", err));
        }
    };


    chatSocket.onclose = () => console.warn("🔌 Chat WebSocket closed.");
    chatSocket.onerror = err => console.error("Chat WebSocket error:", err);
}


document.addEventListener("DOMContentLoaded", () => {
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");

    sendBtn?.addEventListener("click", () => {
        const msg = messageInput.value.trim();
        if (!msg || !chatSocket || chatSocket.readyState !== WebSocket.OPEN) return;
        chatSocket.send(JSON.stringify({ message: msg }));
        messageInput.value = "";
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
                li.className = "chat-button list-group-item d-flex justify-content-between align-items-center fw-bold";
                li.onclick = () => loadChatRoom(roomId, data.other_user_username);
                li.innerHTML = `
          <div class="chat-info">
            <div class="chat-avatar">
              <img src="https://ui-avatars.com/api/?name=${data.other_user_username}&background=567C8D&color=fff" />
            </div>
            <div class="chat-details">
              <span class="chat-name">${data.other_user_username}</span>
              <p class="last-msg">Click to open</p>
            </div>
          </div>
          <span class="badge bg-danger unread-badge">${data.unread_count || 1}</span>
        `;
                const noConvos = document.getElementById("no-conversations");
                noConvos?.remove();
                roomList.prepend(li);
                roomElem = li;
            }
            roomElem.classList.add("blink");
            setTimeout(() => roomElem.classList.remove("blink"), 1500);
        }

        if (data.type === "unread_count_update" && roomElem) {
            if (parseInt(roomId) === currentRoomId) return;

            let badge = roomElem.querySelector(".unread-badge");
            if (data.unread_count > 0) {
                if (badge) {
                    badge.textContent = data.unread_count;
                } else {
                    badge = document.createElement("span");
                    badge.className = "badge bg-danger unread-badge";
                    badge.textContent = data.unread_count;
                    roomElem.appendChild(badge);
                }
                roomElem.classList.add("fw-bold", "blink");
                setTimeout(() => roomElem.classList.remove("blink"), 1500);
            } else {
                badge?.remove();
                roomElem.classList.remove("fw-bold");
            }
        }
    };

    const params = new URLSearchParams(window.location.search);
    const roomId = params.get("room_id");
    if (roomId) {
        const roomElem = document.getElementById(`room-${roomId}`);
        roomElem?.click();
    } else {
        const firstRoom = document.querySelector("#roomList .chat-button");
        firstRoom?.click();
    }
});