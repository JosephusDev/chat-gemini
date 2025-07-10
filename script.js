// Configure sua chave da API do Gemini aqui
const API_KEY = 'AIzaSyBLnxyC0-SusTvPEf2scw1Hkd0uKxT49q4';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const loading = document.getElementById('loading');

let conversationHistory = [];

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = content.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    chatMessages.appendChild(errorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    if (!API_KEY) {
        showError('Por favor, configure sua chave da API do Gemini no código JavaScript.');
        return;
    }

    // Adiciona mensagem do usuário
    addMessage(message, true);
    conversationHistory.push({ role: 'user', content: message });
    
    // Limpa o input
    messageInput.value = '';
    
    // Mostra loading
    loading.classList.add('active');
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            const botResponse = data.candidates[0].content.parts[0].text;
            addMessage(botResponse);
            conversationHistory.push({ role: 'bot', content: botResponse });
        } else {
            console.log(data)
            throw new Error('Resposta inválida da API');
        }
        
    } catch (error) {
        console.error('Erro ao chamar API:', error);
        showError('Erro ao conectar com o Gemini. Verifique sua chave da API e conexão.');
    } finally {
        loading.classList.remove('active');
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Foco inicial no input
messageInput.focus();