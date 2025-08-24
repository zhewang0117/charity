<template>
  <div class="chatbot">
    <div class="chat-icon" @click="toggleChat">
      &#128172;
    </div>
    <div v-if="isChatOpen" class="chat-window">
      <div class="chat-header">
        <h3>Chatbot</h3>
        <button @click="toggleChat">&times;</button>
      </div>
      <div class="chat-body" ref="chatBody">
        <div v-for="(message, index) in messages" :key="index" :class="{'user-message': message.isUser, 'bot-message': !message.isUser}">
          {{ message.text }}
        </div>
        <div v-if="showSuggestedQuestions" class="suggested-questions">
          <p v-if="messages.length <= 2">You can ask me things like:</p>
          <p v-else>Try these questions instead:</p>
          <button v-for="q in currentSuggestedQuestions" :key="q.question" @click="selectQuestion(q.question)">
            {{ q.question }}
          </button>
        </div>
      </div>
      <div class="chat-footer">
        <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Type your question..." />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Import qa.json as a module
const qaData = {
  "faqs": [
    {
      "id": 1,
      "question": "How do I create an account?",
      "keywords": ["register", "sign up", "create account", "new account", "registration"],
      "answer": "Click the 'Register' button in the top right corner of the page. Fill in your name, email, password, and select your role (seeking help or volunteer), then click register to complete your registration."
    },
    {
      "id": 2,
      "question": "How do I log in?",
      "keywords": ["login", "sign in", "log in", "access account"],
      "answer": "Click the 'Login' button on the homepage, enter your registered email and password, then click login."
    },
    {
      "id": 3,
      "question": "What if I forgot my password?",
      "keywords": ["forgot password", "reset password", "password recovery", "lost password"],
      "answer": "Currently, you can contact our customer service team to reset your password. We are developing a self-service password reset feature, please stay tuned."
    },
    {
      "id": 4,
      "question": "How do I apply for food services?",
      "keywords": ["food", "food service", "food assistance", "meals", "nutrition"],
      "answer": "After logging in, select 'Food Service' from the main navigation bar. You can view available food assistance programs and submit applications."
    },
    {
      "id": 5,
      "question": "How do I apply for housing assistance?",
      "keywords": ["housing", "shelter", "accommodation", "housing service", "rent"],
      "answer": "On the 'Housing Service' page, you can browse available housing assistance programs, including temporary shelters and rental subsidies."
    },
    {
      "id": 6,
      "question": "How do I access medical services?",
      "keywords": ["medical", "healthcare", "doctor", "clinic", "health", "medical service"],
      "answer": "Visit the 'Medical Service' page where you can find information about nearby medical facilities, free clinics, and medical assistance programs."
    },
    {
      "id": 7,
      "question": "How do I become a volunteer?",
      "keywords": ["volunteer", "help others", "volunteering", "community service"],
      "answer": "Select 'Volunteer' when registering, or visit the 'Volunteer Service' page to learn about various volunteer opportunities and sign up for projects that suit you."
    },
    {
      "id": 8,
      "question": "How can I donate to support the cause?",
      "keywords": ["donate", "donation", "support", "contribute", "funding"],
      "answer": "Visit the 'Support Us' page where you can choose to make a one-time donation or set up recurring donations to support our work."
    },
    {
      "id": 9,
      "question": "How do I get emergency help?",
      "keywords": ["emergency", "urgent", "crisis", "immediate help", "24/7"],
      "answer": "If you encounter an emergency situation, please visit the 'Emergency Help' page to view 24-hour hotline numbers and emergency service information."
    },
    {
      "id": 10,
      "question": "How do I get career assistance?",
      "keywords": ["job", "career", "employment", "work", "job search", "resume"],
      "answer": "On the 'Career Assistance' page, you can find job guidance, resume editing, interview training, and other employment support services."
    },
    {
      "id": 11,
      "question": "How do I update my personal information?",
      "keywords": ["update", "edit", "profile", "personal info", "change details"],
      "answer": "After logging in, click on your user avatar and select 'Edit Profile' to update your personal information."
    },
    {
      "id": 12,
      "question": "Are the services free?",
      "keywords": ["free", "cost", "price", "payment", "fees"],
      "answer": "Yes, all basic services we provide for immigrants and refugees are free, including food, housing, medical, and employment assistance."
    },
    {
      "id": 13,
      "question": "How do I contact customer support?",
      "keywords": ["contact", "support", "help", "customer service", "assistance"],
      "answer": "You can contact us through the contact information at the bottom of the page, or send an email to our customer service email address."
    },
    {
      "id": 14,
      "question": "What is CareNexus?",
      "keywords": ["carenexus", "about", "what is", "platform", "organization"],
      "answer": "CareNexus is a comprehensive service platform specifically designed for immigrants and refugees, providing food assistance, housing support, medical services, career guidance, and many other services."
    },
    {
      "id": 15,
      "question": "How do I view the map services?",
      "keywords": ["map", "location", "nearby", "directions", "find"],
      "answer": "Click on the 'Map' option in the navigation bar to view the locations and contact information of nearby service organizations."
    }
  ],
  "defaultResponses": [
    "Sorry, I didn't understand your question. You can try describing it in a different way, or check our frequently asked questions.",
    "You can try rephrasing your question, or contact our customer service team for more detailed help.",
    "I'm sorry, I couldn't find relevant information. I suggest you check our help page or contact customer service."
  ],
  "greetings": [
    "Hello! I'm the CareNexus assistant, happy to help you!",
    "Welcome to CareNexus! I can help answer questions about our services.",
    "Hi there! How can I assist you today?"
  ]
};

function levenshtein(a: string, b: string): number {
  const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function calculateSimilarity(a: string, b: string): number {
  const distance = levenshtein(a.toLowerCase(), b.toLowerCase());
  const maxLength = Math.max(a.length, b.length);
  return maxLength === 0 ? 1 : 1 - (distance / maxLength);
}

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter(token => token.length > 2);
}

function jaccardSimilarity(a: string, b: string): number {
  const tokensA = new Set(tokenize(a));
  const tokensB = new Set(tokenize(b));
  
  if (tokensA.size === 0 && tokensB.size === 0) return 1;
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  
  const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);
  
  return intersection.size / union.size;
}

function keywordMatch(userInput: string, question: string): number {
  const userWords = tokenize(userInput);
  const questionWords = tokenize(question);
  
  let matches = 0;
  for (const word of userWords) {
    if (questionWords.some(qw => qw.includes(word) || word.includes(qw))) {
      matches++;
    }
  }
  
  return matches / Math.max(userWords.length, questionWords.length);
}

export default defineComponent({
  name: 'ChatbotWidget',
  data() {
    return {
      isChatOpen: false,
      userInput: '',
      messages: [] as Array<{ text: string; isUser: boolean }>,
      qaData: qaData,
      showSuggestedQuestions: false,
      currentSuggestedQuestions: [] as Array<{ id: number; question: string; answer: string; keywords: string[] }>
    };
  },
  computed: {
    // Remove the old suggestedQuestions computed property
  },
  mounted() {
    console.log('Chatbot component mounted!');
    this.initializeChat();
  },
  methods: {
    initializeChat() {
      // Show a random greeting
      const randomGreeting = this.qaData.greetings[Math.floor(Math.random() * this.qaData.greetings.length)];
      this.messages = [
        { text: randomGreeting, isUser: false }
      ];
      this.updateSuggestedQuestions();
    },
    toggleChat() {
      this.isChatOpen = !this.isChatOpen;
      // Show suggestions only on first open when there are no other messages
      if (this.isChatOpen && this.messages.length === 1) {
        this.showSuggestedQuestions = true;
      }
    },
    updateSuggestedQuestions() {
      // Shuffle the qa array and pick 4 random questions
      const shuffled = [...this.qaData.faqs].sort(() => 0.5 - Math.random());
      this.currentSuggestedQuestions = shuffled.slice(0, 4);
    },
    selectQuestion(question: string) {
      this.userInput = question;
      this.sendMessage();
    },
    findBestMatch(userInput: string) {
      const input = userInput.toLowerCase();
      let bestMatch = null;
      let highestScore = 0;

      for (const faq of this.qaData.faqs) {
        let score = 0;

        // Check keyword matches
        for (const keyword of faq.keywords) {
          if (input.includes(keyword.toLowerCase())) {
            score += 2; // High weight for keyword matches
          }
        }

        // Check question similarity
        const questionSimilarity = this.calculateStringSimilarity(input, faq.question.toLowerCase());
        score += questionSimilarity;

        if (score > highestScore && score > 1) { // Minimum threshold
          highestScore = score;
          bestMatch = faq;
        }
      }

      return { match: bestMatch, score: highestScore };
    },
    calculateStringSimilarity(str1: string, str2: string): number {
      const words1 = str1.split(/\s+/);
      const words2 = str2.split(/\s+/);
      let matches = 0;

      for (const word1 of words1) {
        for (const word2 of words2) {
          if (word1.length > 2 && word2.length > 2) {
            if (word1.includes(word2) || word2.includes(word1)) {
              matches++;
            }
          }
        }
      }

      return matches / Math.max(words1.length, words2.length);
    },
    sendMessage() {
      if (this.userInput.trim() === '') return;

      const userMessage = this.userInput.trim();
      
      // Add user message
      this.messages.push({ text: userMessage, isUser: true });
      this.showSuggestedQuestions = false; // Hide questions

      // Find the best match using the new structure
      const { match, score } = this.findBestMatch(userMessage);

      if (match && score > 1.5) {
        // Good match found
        this.messages.push({ text: match.answer, isUser: false });
      } else if (match && score > 1) {
        // Moderate match
        this.messages.push({ 
          text: `I think you might be asking about: "${match.question}"\n\n${match.answer}`, 
          isUser: false 
        });
      } else {
        // No good match found
        const randomResponse = this.qaData.defaultResponses[Math.floor(Math.random() * this.qaData.defaultResponses.length)];
        this.messages.push({ text: randomResponse, isUser: false });
        
        // Show suggested questions
        this.$nextTick(() => {
          this.currentSuggestedQuestions = [...this.qaData.faqs]
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          this.showSuggestedQuestions = true;
        });
      }

      // Clear user input
      this.userInput = '';

      this.$nextTick(() => {
        const chatBody = this.$refs.chatBody as HTMLElement;
        if (chatBody) {
          chatBody.scrollTop = chatBody.scrollHeight;
        }
      });
    }
  }
});
</script>

<style scoped>
.chatbot {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 9999;
  font-family: 'Inter', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
}

.chat-icon {
  background: var(--color-primary);
  color: #fff;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  font-size: 2rem;
  transition: box-shadow 0.2s, transform 0.2s;
}

.chat-icon:hover {
  box-shadow: var(--shadow-lg);
  transform: scale(1.08);
}

.chat-window {
  width: 380px;
  height: 500px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 30px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.4s cubic-bezier(.4,2,.3,1);
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.chat-window:hover {
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2), 0 10px 40px rgba(0, 0, 0, 0.15);
}

.chat-header {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  padding: 16px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  font-size: 1.15rem;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.2);
}

.chat-header button {
  background: rgba(255,255,255,0.12);
  border: none;
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
  border-radius: 8px;
  padding: 4px 8px;
  transition: background 0.2s, color 0.2s;
}

.chat-header button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.chat-body {
  flex: 1;
  padding: 18px 22px;
  overflow-y: auto;
  background: #ffffff;
  scrollbar-width: thin;
  scrollbar-color: #007bff #f8f9fa;
}

.user-message {
  text-align: right;
  margin: 10px 0;
  color: #ffffff;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  display: inline-block;
  padding: 12px 18px;
  border-radius: 18px 18px 4px 18px;
  max-width: 80%;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
  font-size: 1.08rem;
  animation: bubbleIn 0.25s;
  align-self: flex-end;
  font-weight: 500;
}

.bot-message {
  text-align: left;
  margin: 10px 0;
  color: #333333;
  background: #f8f9fa;
  display: inline-block;
  padding: 12px 18px;
  border-radius: 18px 18px 18px 4px;
  max-width: 80%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-size: 1.08rem;
  animation: bubbleIn 0.25s;
  align-self: flex-start;
  border: 1px solid #e9ecef;
}

.suggested-questions {
  padding: 10px 22px;
  text-align: left;
}

.suggested-questions p {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

.suggested-questions button {
  background: #ffffff;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 10px 16px;
  margin: 4px 0;
  cursor: pointer;
  font-size: 0.95rem;
  color: #007bff;
  transition: all 0.2s;
  display: block;
  width: 100%;
  text-align: left;
  font-weight: 500;
}

.suggested-questions button:hover {
  background: #f8f9fa;
  border-color: #007bff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
}

@keyframes bubbleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.chat-footer {
  display: flex;
  padding: 16px 22px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  background: #ffffff;
  border-top: 1px solid #e9ecef;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.chat-footer input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1.05rem;
  outline: none;
  background: #ffffff;
  color: #333333;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.chat-footer input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
}

.chat-footer button {
  margin-left: 10px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
  transition: all 0.2s;
}

.chat-footer button:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.3);
}
</style>
