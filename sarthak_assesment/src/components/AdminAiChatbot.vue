<template>
  <div class="chatbot-container">
    <button class="chat-toggle" :class="{ 'toggle-active': isOpen }" @click="isOpen = !isOpen">
      <span v-if="!isOpen">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
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
              <p class="bot-name">Platform Guide</p>
              <p class="bot-status">Online • Intelligence v2.0</p>
            </div>
          </div>
        </div>

        <div class="chat-messages" ref="messageContainer">
          <div class="welcome-box">
            <p>Welcome to <strong>AdminOS</strong>. Explore our platform features or ask about student data below.</p>
          </div>

          <div v-for="(msg, index) in messages" :key="index" 
               :class="['message', msg.role === 'user' ? 'user-msg' : 'bot-msg']">
            <div class="msg-content" v-html="formatResponse(msg.content)"></div>
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
            <input 
              v-model="userInput" 
              placeholder="Ask anything..." 
              :disabled="isLoading"
            />
            <button type="submit" :disabled="isLoading || !userInput.trim()" class="send-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
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

// Your specific visitor questions
const chips = [
  "How it works?", 
  "How to add students?", 
  "Update student details", 
  "View student records"
];

const messages = ref([
  { role: 'assistant', content: "Hello! I'm your platform guide. How can I help you explore AdminOS today?" }
]);

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

// Helper for chip clicks
const handleChip = (text: string) => {
  userInput.value = text;
  sendMessage();
};

// Helper for clean formatting
const formatResponse = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
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
    const botReply = response.data.answer;
    messages.value.push({ role: 'assistant', content: botReply });
  } catch (error) {
    console.error("AI Error:", error);
    messages.value.push({ 
      role: 'assistant', 
      content: "**Error:** Could not connect to service. Please verify backend is active." 
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

watch(isOpen, (val) => { if (val) scrollToBottom(); });
</script>

<style scoped>
/* Main Container & Button */
.chatbot-container { position: fixed; bottom: 30px; right: 30px; z-index: 2000; font-family: 'Inter', system-ui, sans-serif; }

.chat-toggle {
  width: 56px; height: 56px; border-radius: 18px;
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
  color: white; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 20px rgba(168, 85, 247, 0.3);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.chat-toggle:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(168, 85, 247, 0.4); }
.toggle-active { background: #1a1a1a; transform: rotate(90deg); }

/* Chat Window */
.chat-window {
  position: absolute; bottom: 75px; right: 0;
  width: 380px; height: 620px; max-height: 80vh;
  background: #0a0a0a; border: 1px solid #1f1f1f;
  border-radius: 28px; display: flex; flex-direction: column;
  overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

/* Header */
.chat-header { padding: 1.25rem; background: #111111; border-bottom: 1px solid #1f1f1f; }
.header-info { display: flex; align-items: center; gap: 12px; }
.avatar-wrapper { position: relative; }
.bot-avatar { 
  width: 38px; height: 38px; background: #1f1f1f; 
  border-radius: 12px; display: flex; align-items: center; 
  justify-content: center; font-weight: 800; color: #a855f7; font-size: 0.75rem;
}
.status-indicator { 
  position: absolute; bottom: -2px; right: -2px;
  width: 10px; height: 10px; background: #22c55e; 
  border: 2px solid #111; border-radius: 50%; 
}
.bot-name { font-weight: 600; font-size: 0.95rem; margin: 0; color: #fff; letter-spacing: -0.01em; }
.bot-status { font-size: 0.75rem; color: #71717a; margin: 0; }

/* Messages Area */
.chat-messages { flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth; }
.chat-messages::-webkit-scrollbar { width: 5px; }
.chat-messages::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }

.welcome-box { background: #111; border: 1px dashed #222; padding: 12px; border-radius: 16px; font-size: 0.8rem; color: #71717a; line-height: 1.5; margin-bottom: 10px; }

.message { max-width: 85%; padding: 0.9rem 1.1rem; border-radius: 20px; font-size: 0.9rem; line-height: 1.5; }
.bot-msg { background: #161616; color: #e4e4e7; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid #222; }
.user-msg { background: #a855f7; color: white; align-self: flex-end; border-bottom-right-radius: 4px; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2); }

/* Suggestion Chips */
.chips-container { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 1.25rem 1rem; }
.chip { 
  background: transparent; border: 1px solid #27272a; color: #a1a1aa; 
  padding: 6px 14px; border-radius: 100px; font-size: 0.75rem; 
  cursor: pointer; transition: 0.2s; 
}
.chip:hover { border-color: #a855f7; color: #fff; background: #161616; }

/* Input Area */
.chat-input-area { padding: 1.25rem; background: #0a0a0a; border-top: 1px solid #1f1f1f; }
.input-wrapper { display: flex; background: #161616; border: 1px solid #27272a; border-radius: 16px; padding: 4px; }
.chat-input-area input {
  flex: 1; background: transparent; border: none;
  padding: 0.75rem 1rem; color: white; outline: none; font-size: 0.85rem;
}
.send-btn {
  background: #a855f7; color: white; border: none;
  width: 40px; height: 40px; border-radius: 12px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: 0.2s;
}
.send-btn:hover { background: #9333ea; }
.send-btn:disabled { background: #27272a; opacity: 0.5; }

/* Typing Animation */
.typing-dots { display: flex; gap: 4px; height: 1.5rem; align-items: center; }
.typing-dots span { 
  font-size: 1.5rem; line-height: 0; animation: blink 1.4s infinite; color: #a855f7;
}
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(30px) scale(0.9); opacity: 0; }
</style>