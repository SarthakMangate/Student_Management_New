<template>
  <button class="chat-toggle" :class="{ 'active': open }" @click="open = !open">
    <span v-if="!open">👋</span>
    <span v-else>✕</span>
  </button>

  <Transition name="pop">
    <div v-if="open" class="chat-container">
      <div class="chat-header">
        <div class="header-main">
          <div class="bot-avatar">OS</div>
          <div>
            <h4>Platform Explorer</h4>
            <div class="online-status">
              <span class="dot"></span> Guide is Online
            </div>
          </div>
        </div>
      </div>

      <div class="chat-body" ref="chatBox">
        <div class="welcome-hero">
          <p>Welcome to <strong>AdminOS</strong>! I'm here to help you explore how our platform works and how it can
            help manage your student data efficiently.</p>
        </div>

        <div v-for="(msg, index) in messages" :key="index" :class="['msg', msg.role]">
          <div class="bubble">
            <span v-if="msg.role === 'assistant'" class="bot-label">Platform Guide</span>
            <div class="text" v-html="formatResponse(msg.content)"></div>
          </div>
        </div>

        <div v-if="loading" class="msg assistant">
          <div class="bubble typing">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div v-if="!loading" class="quick-chips">
          <button v-for="chip in chips" :key="chip" @click="handleChip(chip)">
            {{ chip }}
          </button>
        </div>
      </div>

      <form class="chat-footer" @submit.prevent="sendMessage">
        <input v-model="userInput" placeholder="Ask a question about AdminOS..." :disabled="loading" />
        <button type="submit" :disabled="!userInput.trim() || loading">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  </Transition>
</template>

<script setup>
import { ref, nextTick } from "vue";
import api from "../utils/api";

const open = ref(false);
const userInput = ref("");
const loading = ref(false);
const chatBox = ref(null);

// Suggestions for Visitors
const chips = [
  "What is the Tech Stack?",
  "Is my data secure?",
  "Can I filter students?",
  "Mobile Responsiveness"
];

const messages = ref([
  {
    role: "assistant",
    content: "Hello! Feel free to ask how to manage students, or click a suggestion below to see how the system handles records."
  }
]);

// Basic formatter to handle bold text and line breaks for "clean and neat" look
const formatResponse = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\n/g, '<br>'); // Line breaks
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight;
};

const handleChip = (text) => {
  userInput.value = text;
  sendMessage();
};

const sendMessage = async () => {
  const text = userInput.value.trim();
  if (!text) return;

  messages.value.push({ role: "user", content: text });
  userInput.value = "";
  loading.value = true;
  await scrollToBottom();

  try {
    const res = await api.post("/ai/ask", { question: text });
    messages.value.push({ role: "assistant", content: res.data.answer });
  } catch (err) {
    messages.value.push({
      role: "assistant",
      content: "**Connection Error.**\nI'm having trouble reaching the server. Please try again in a moment."
    });
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
};
</script>

<style scoped>
/* Main Container */
.chat-container {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 380px;
  height: 600px;
  max-height: 85vh;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

/* Toggle Button */
.chat-toggle {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 24px;
  z-index: 1001;
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.chat-toggle.active {
  background: #1e293b;
  transform: rotate(90deg);
}

/* Header */
.chat-header {
  background: #2563eb;
  color: white;
  padding: 24px;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bot-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
}

.chat-header h4 {
  margin: 0;
  font-size: 16px;
}

.online-status {
  font-size: 12px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #4ade80;
  border-radius: 50%;
}

/* Body & Messages */
.chat-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8fafc;
}

.welcome-hero {
  background: white;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  color: #64748b;
}

.msg {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.msg.assistant {
  align-items: flex-start;
}

.msg.user {
  align-items: flex-end;
}

.bubble {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.6;
  position: relative;
}

.assistant .bubble {
  background: white;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}

.user .bubble {
  background: #2563eb;
  color: white;
  border-bottom-right-radius: 4px;
}

.bot-label {
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 700;
  color: #94a3b8;
  display: block;
  margin-bottom: 4px;
}

/* Quick Chips */
.quick-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
}

.quick-chips button {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 500;
}

.quick-chips button:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

/* Footer */
.chat-footer {
  padding: 16px;
  background: white;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 10px;
}

.chat-footer input {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 16px;
  outline: none;
  font-size: 14px;
}

.chat-footer button {
  background: #2563eb;
  color: white;
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.chat-footer button:hover {
  background: #1d4ed8;
}

/* Animations */
.pop-enter-active,
.pop-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.8);
}

.typing span {
  width: 6px;
  height: 6px;
  background: #cbd5e1;
  display: inline-block;
  border-radius: 50%;
  margin: 0 2px;
  animation: type 1.4s infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes type {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}
</style>