<template>
  <div class="chatbot-root">
    <button class="chat-toggle" :class="{ 'active': isOpen }" @click="isOpen = !isOpen">
      <span v-if="!isOpen">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </span>
      <span v-else>✕</span>
    </button>

    <Transition name="pop">
      <div v-if="isOpen" class="chat-container">
        <div class="chat-header">
          <div class="header-main">
            <div class="bot-avatar">OS</div>
            <div class="header-text">
              <h4>Platform Explorer</h4>
              <div class="online-status"><span class="dot"></span> Secure Mode</div>
            </div>
          </div>
          <div class="header-actions">
            <button class="icon-btn" @click="confirmClear" title="Clear Chat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
            <button class="icon-btn" @click="isOpen = false">✕</button>
          </div>
        </div>

        <div class="chat-body" ref="chatBox">
          <div class="security-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Confidential data is restricted to Admin.
          </div>

          <div v-for="(msg, index) in messages" :key="index" :class="['msg-wrapper', msg.role]">
            <div class="bubble">
              <span v-if="msg.role === 'assistant'" class="bot-label">Platform Guide</span>
              <div class="text" v-html="formatResponse(msg.content)"></div>
            </div>
          </div>

          <div v-if="isLoading" class="msg-wrapper assistant">
            <div class="bubble typing"><span></span><span></span><span></span></div>
          </div>
        </div>

        <div v-if="!isLoading" class="quick-chips">
          <div class="chip-grid">
            <button v-for="chip in platformChips" :key="chip" @click="handleChip(chip)">{{ chip }}</button>
          </div>
        </div>

        <form class="chat-footer" @submit.prevent="sendMessage">
          <div class="input-container">
            <input v-model="userInput" placeholder="Ask about platform features..." :disabled="isLoading" />
            <button type="submit" :disabled="!userInput.trim() || isLoading" class="send-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import api from "../utils/api";

interface Message { role: "user" | "assistant"; content: string; }

const WELCOME: Message = {
  role: "assistant",
  content: "I am the **StudentSys Explorer**. I can guide you through the UI and features, but I do not have access to live student data."
};

const isOpen = ref(false);
const userInput = ref("");
const isLoading = ref(false);
const chatBox = ref<HTMLElement | null>(null);
const messages = ref<Message[]>([WELCOME]);
const platformChips = ["System Overview", "Is data safe?", "Who can use this?"];

const formatResponse = (t: string) => t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

const confirmClear = () => { if (confirm("Reset chat?")) messages.value = [WELCOME]; };

const handleChip = (t: string) => { userInput.value = t; sendMessage(); };

const scrollToBottom = async () => {
  await nextTick();
  if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight;
};

const sendMessage = async () => {
  const text = userInput.value.trim();
  if (!text) return;

  messages.value.push({ role: "user", content: text });
  userInput.value = "";
  isLoading.value = true;
  await scrollToBottom();

  // --- STRICT FRONTEND PRIVACY FILTER ---
  const lowerText = text.toLowerCase();
  const restrictedTerms = ['student', 'record', 'database', 'db', 'sql', 'list', 'show', 'table', 'data', 'user', 'name'];

  const isViolating = restrictedTerms.some(term => lowerText.includes(term));

  if (isViolating) {
    // We do NOT call the API here. We force a local response.
    setTimeout(() => {
      messages.value.push({
        role: "assistant",
        content: "I'm sorry, as a security measure, **I cannot access or display student records.** This information is strictly restricted to the Admin Dashboard. I can only assist with general platform navigation."
      });
      isLoading.value = false;
      scrollToBottom();
    }, 700);
    return; // Kill the process
  }

  // --- API CALL ONLY FOR SAFE TOPICS ---
  try {
    const res = await api.post("/ai/ask", { question: text });
    messages.value.push({ role: "assistant", content: res.data.answer });
  } catch {
    messages.value.push({ role: "assistant", content: "Service error. Please refresh." });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

watch(isOpen, (v) => v && scrollToBottom());
</script>

<style scoped>
/* Sticky Bottom-Right */
.chatbot-root {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  font-family: 'Inter', sans-serif;
}

.chat-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
  font-size: 24px;
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.chat-toggle.active {
  background: #1e293b;
  transform: rotate(90deg);
}

.chat-container {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 360px;
  height: 580px;
  background: white;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.chat-header {
  background: #2563eb;
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bot-avatar {
  width: 34px;
  height: 34px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-text h4 {
  margin: 0;
  font-size: 14px;
}

.online-status {
  font-size: 10px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #4ade80;
  border-radius: 50%;
}

.icon-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.7;
}

.chat-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8fafc;
}

.security-banner {
  background: #fef2f2;
  color: #b91c1c;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 11px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #fee2e2;
}

.msg-wrapper {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.assistant {
  align-items: flex-start;
}

.user {
  align-items: flex-end;
}

.bubble {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
}

.assistant .bubble {
  background: white;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 2px;
}

.user .bubble {
  background: #2563eb;
  color: white;
  border-bottom-right-radius: 2px;
}

.bot-label {
  font-size: 10px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 4px;
  display: block;
}

.quick-chips {
  padding: 12px 16px;
  background: #f8fafc;
}

.chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip-grid button {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  color: #475569;
}

.chat-footer {
  padding: 16px;
  background: white;
  border-top: 1px solid #f1f5f9;
}

.input-container {
  display: flex;
  background: #f1f5f9;
  border-radius: 14px;
  padding: 4px 4px 4px 12px;
  align-items: center;
}

input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 0;
  outline: none;
  font-size: 14px;
}

.send-btn {
  background: #2563eb;
  color: white;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pop-enter-active,
.pop-leave-active {
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.msg-wrapper {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.assistant {
  align-items: flex-start;
}

.user {
  align-items: flex-end;
}

.bubble {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
}

/* BOT REPLY STYLES */
.assistant .bubble {
  background: white;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 2px;
  color: #000000;
  /* Bot text color set to black */
}

/* Ensures any bold text inside the bot reply is also black */
.assistant .bubble strong {
  color: #000000;
}

/* USER REPLY STYLES (Keeping these white for contrast) */
.user .bubble {
  background: #2563eb;
  color: white;
  border-bottom-right-radius: 2px;
}

.typing span {
  width: 5px;
  height: 5px;
  background: #cbd5e1;
  display: inline-block;
  border-radius: 50%;
  margin: 0 2px;
  animation: type 1.4s infinite;
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