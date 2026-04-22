(function() {
  // Create widget HTML
  const widget = document.createElement('div');
  widget.innerHTML = `
    <div id="chat-bubble" style="position:fixed;bottom:24px;right:24px;width:56px;height:56px;background:#1a3c5e;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:9999;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
    </div>
    <div id="chat-window" style="display:none;position:fixed;bottom:90px;right:24px;width:340px;height:480px;background:white;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.2);z-index:9999;flex-direction:column;overflow:hidden;">
      <div style="background:#1a3c5e;padding:16px;color:white;">
        <div style="font-weight:bold;font-size:16px;">Sarah</div>
        <div style="font-size:12px;opacity:0.8;">Meridian Property Group</div>
      </div>
      <div id="chat-messages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;height:340px;"></div>
      <div style="padding:12px;border-top:1px solid #eee;display:flex;gap:8px;">
        <input id="chat-input" type="text" placeholder="Type a message..." style="flex:1;padding:8px 12px;border:1px solid #ddd;border-radius:20px;outline:none;font-size:14px;">
        <button id="chat-send" style="background:#1a3c5e;color:white;border:none;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:18px;">↑</button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  const bubble = document.getElementById('chat-bubble');
  const chatWindow = document.getElementById('chat-window');
  const input = document.getElementById('chat-input');
  const send = document.getElementById('chat-send');
  const messages = document.getElementById('chat-messages');

  let conversationHistory = [];
  let isOpen = false;

  // Toggle chat window
  bubble.addEventListener('click', () => {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    if (isOpen && conversationHistory.length === 0) {
      addMessage('assistant', "Hi there! I'm Sarah from Meridian Property Group. Are you looking to buy or sell in the North Shore area?");
      conversationHistory.push({
        role: 'assistant',
        content: "Hi there! I'm Sarah from Meridian Property Group. Are you looking to buy or sell in the North Shore area?"
      });
    }
  });

  // Send message
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addMessage('user', text);
    conversationHistory.push({ role: 'user', content: text });

    addMessage('assistant', '...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory })
      });

      const data = await response.json();
      const reply = data.content[0].text;

      // Remove typing indicator
      const typing = messages.lastChild;
      messages.removeChild(typing);

      addMessage('assistant', reply);
      conversationHistory.push({ role: 'assistant', content: reply });

    } catch (error) {
      const typing = messages.lastChild;
      messages.removeChild(typing);
      addMessage('assistant', 'Sorry, something went wrong. Please try again.');
    }
  }

  function addMessage(role, text) {
    const msg = document.createElement('div');
    msg.style.cssText = `
      max-width:80%;
      padding:8px 12px;
      border-radius:12px;
      font-size:14px;
      line-height:1.4;
      ${role === 'user' 
        ? 'background:#1a3c5e;color:white;align-self:flex-end;margin-left:auto;' 
        : 'background:#f0f0f0;color:#333;align-self:flex-start;'}
    `;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();
