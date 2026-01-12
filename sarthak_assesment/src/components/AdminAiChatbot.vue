<template>
  <div class="chatbot-container">
    <button class="chat-toggle" :class="{ 'toggle-active': isOpen }" @click="isOpen = !isOpen">
      <span v-if="!isOpen">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </span>
      <span v-else>✕</span>
    </button>

    <Transition name="slide-up">
      <div v-if="isOpen" class="chat-window">
        <div class="chat-header">
          <div class="header-info">
            <div class="avatar-wrapper">
              <div class="bot-avatar">AI</div>
              <span class="status-indicator"></span>
            </div>
            <div>
              <p class="bot-name">Ask anything..</p>
              <p class="bot-status">Admin Assistant</p>
            </div>
          </div>
          <button class="icon-btn" title="Clear All" @click="clearChat">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>

        <div class="chat-messages" ref="messageContainer">
          <div class="welcome-box">
            <p>Welcome to&nbsp;&nbsp;<strong>StudentSys</strong>.&nbsp;
            Ask about student records or platform settings.</p>
          </div>

          <div v-for="(msg, index) in messages" :key="index"
            :class="['message-wrapper', msg.role === 'user' ? 'user-wrapper' : 'bot-wrapper']">

            <div :class="['message', msg.role === 'user' ? 'user-msg' : 'bot-msg']">
              <div class="msg-content" v-html="formatResponse(msg.content)"></div>

              <div class="msg-actions">
                <button @click="deleteMessage(index)" title="Delete message">✕</button>
              </div>
            </div>
          </div>

          <div v-if="isLoading" class="message bot-msg typing">
            <div class="typing-dots"><span>•</span><span>•</span><span>•</span></div>
          </div>
        </div>

        <div v-if="!isLoading" class="chips-container">
          <button v-for="chip in chips" :key="chip" @click="handleChip(chip)" class="chip">
            {{ chip }}
          </button>
        </div>

        <form class="chat-input-area" @submit.prevent="sendMessage">
          <div class="input-wrapper">
            <input v-model="userInput" placeholder="Type a message..." :disabled="isLoading" ref="inputRef" />
            <button type="submit" :disabled="isLoading || !userInput.trim()" class="send-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import api from '../utils/api';

const isOpen = ref(false);
const userInput = ref('');
const isLoading = ref(false);
const messageContainer = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const chips = ["How it works?", "How are you?", "Student records", "Provide insights"];
const initialMessage = { role: 'assistant', content: "Hi! How can I help you today?" };
const messages = ref([initialMessage]);

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const clearChat = () => {
  if (confirm("Clear all messages?")) {
    messages.value = [initialMessage];
  }
};

const deleteMessage = (index: number) => {
  messages.value.splice(index, 1);
};

const handleChip = (text: string) => {
  userInput.value = text;
  sendMessage();
};

const formatResponse = (text: string) => {
  if (!text) return '';

  // Improved Table Parser: Detects full markdown table blocks
  const tableRegex = /((?:\|.+\|(?:\r?\n?)){2,})/g;
  let formatted = text.replace(tableRegex, (match) => {
    const rows = match.trim().split('\n');
    let html = '<div class="table-container"><table>';

    rows.forEach((row, index) => {
      // Ignore the separator row (---|---|---)
      if (row.match(/^\s*\|?\s*[:\- \||]+\s*$/)) return;

      const cells = row.split('|').filter(cell => cell.trim() !== '' || row.indexOf(cell) !== 0 && row.indexOf(cell) !== row.length - 1);
      const tag = (index === 0) ? 'th' : 'td';

      html += '<tr>';
      cells.forEach(cell => {
        html += `<${tag}>${cell.trim()}</${tag}>`;
      });
      html += '</tr>';
    });

    html += '</table></div>';
    return html;
  });

  return formatted
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.*$)/gim, '<div class="msg-header">$1</div>')
    .replace(/^\* (.*$)/gim, '<div class="msg-list-item"><span>•</span> $1</div>')
    .replace(/`(.*?)`/g, '<code class="msg-code">$1</code>')
    .replace(/\n/g, '<br>');
};

const sendMessage = async () => {
  const text = userInput.value.trim();
  if (!text) return;

  messages.value.push({ role: 'user', content: text });
  userInput.value = '';
  isLoading.value = true;
  await scrollToBottom();

  try {
    const response = await api.post('/ai/ask', { question: text });
    messages.value.push({ role: 'assistant', content: response.data.answer });
  } catch (error) {
    messages.value.push({ role: 'assistant', content: "**Error:** Service unavailable. Please try again later." });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
    nextTick(() => inputRef.value?.focus());
  }
};

watch(isOpen, (val) => { if (val) scrollToBottom(); });
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 2000;
  font-family: 'Inter', system-ui, sans-serif;
}

.chat-toggle {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(168, 85, 247, 0.3);
  transition: all 0.2s ease;
}

.toggle-active {
  background: #1a1a1a;
  transform: rotate(90deg);
}

.chat-window {
  position: absolute;
  bottom: 75px;
  right: 0;
  width: 420px;
  /* Slightly increased for table comfort */
  height: 600px;
  max-height: 80vh;
  background: #0a0a0a;
  border: 1px solid #1f1f1f;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

.chat-header {
  padding: 1rem 1.25rem;
  background: #111111;
  border-bottom: 1px solid #1f1f1f;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-wrapper {
  position: relative;
}

.bot-avatar {
  width: 34px;
  height: 34px;
  background: #1f1f1f;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #a855f7;
  font-size: 0.7rem;
  border: 1px solid #27272a;
}

.status-indicator {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 8px;
  height: 8px;
  background: #22c55e;
  border: 2px solid #111;
  border-radius: 50%;
}

.bot-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0;
  color: #fff;
}

.bot-status {
  font-size: 0.7rem;
  color: #71717a;
  margin: 0;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #71717a;
  cursor: pointer;
  transition: 0.2s;
  padding: 4px;
  border-radius: 4px;
}

.icon-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.chat-messages {
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scroll-behavior: smooth;
}

.message-wrapper {
  display: flex;
  width: 100%;
  position: relative;
}

.bot-wrapper {
  justify-content: flex-start;
}

.user-wrapper {
  justify-content: flex-end;
}

.message {
  max-width: 90%;
  /* Increased for table space */
  padding: 0.8rem 1rem;
  border-radius: 18px;
  font-size: 0.9rem;
  line-height: 1.5;
  position: relative;
  transition: all 0.2s ease;
}

.bot-msg {
  background: #161616;
  color: #e4e4e7;
  border-bottom-left-radius: 4px;
  border: 1px solid #222;
}

.user-msg {
  background: #a855f7;
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
}

.msg-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

:deep(.msg-header) {
  font-weight: 700;
  color: #a855f7;
  font-size: 0.8rem;
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:deep(.msg-list-item) {
  display: flex;
  gap: 8px;
  padding-left: 2px;
}

:deep(.msg-list-item span) {
  color: #a855f7;
  font-weight: bold;
}

:deep(.msg-code) {
  background: rgba(168, 85, 247, 0.15);
  color: #d8b4fe;
  padding: 1px 5px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.85em;
  border: 1px solid rgba(168, 85, 247, 0.2);
}

:deep(strong) {
  color: #fff;
}

.msg-actions {
  position: absolute;
  top: -8px;
  right: -8px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.message-wrapper:hover .msg-actions {
  opacity: 1;
  pointer-events: auto;
}

.msg-actions button {
  background: #27272a;
  color: #fff;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.welcome-box {
  background: #111;
  border: 1px dashed #222;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #71717a;
  margin-bottom: 8px;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 1.25rem 0.75rem;
}

.chip {
  background: transparent;
  border: 1px solid #27272a;
  color: #a1a1aa;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: 0.2s;
}

.chip:hover {
  border-color: #a855f7;
  color: #fff;
  background: rgba(168, 85, 247, 0.05);
}

.chat-input-area {
  padding: 1rem 1.25rem;
  background: #0a0a0a;
  border-top: 1px solid #1f1f1f;
}

.input-wrapper {
  display: flex;
  background: #161616;
  border: 1px solid #27272a;
  border-radius: 14px;
  padding: 4px;
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: #a855f7;
}

.chat-input-area input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.6rem 0.8rem;
  color: white;
  outline: none;
  font-size: 0.85rem;
}

.send-btn {
  background: #a855f7;
  color: white;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #27272a;
}

.typing-dots span {
  font-size: 1.2rem;
  animation: blink 1.2s infinite;
  color: #a855f7;
  margin: 0 1px;
}

@keyframes blink {

  0%,
  100% {
    opacity: 0.3;
  }

  50% {
    opacity: 1;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(30px) scale(0.95);
  opacity: 0;
}

/* Table Specific Styling */
:deep(.table-container) {
  width: 100%;
  overflow-x: auto;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #27272a;
  background: #000;
}

:deep(.table-container::-webkit-scrollbar) {
  height: 4px;
}

:deep(.table-container::-webkit-scrollbar-thumb) {
  background: #3f3f46;
  border-radius: 10px;
}

:deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  text-align: left;
  min-width: 320px;
}

:deep(th) {
  background: #1a1a1a;
  color: #a855f7;
  padding: 8px 10px;
  font-weight: 600;
  border-bottom: 2px solid #27272a;
}

:deep(td) {
  padding: 8px 10px;
  border-bottom: 1px solid #1f1f1f;
  color: #d4d4d8;
  white-space: nowrap;
}

:deep(tr:last-child td) {
  border-bottom: none;
}
</style>