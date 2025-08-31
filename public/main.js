document.addEventListener("DOMContentLoaded", () => {
  function updateStory(data){
    // Show choices
    if (data.choices && Array.isArray(data.choices)) {
      // Clear previous choices
  
      const buttons = choicesContainer.getElementsByClassName('choice-btn');
  
      // Add new choice buttons
      data.choices.forEach((choiceText, i) => {
        buttons[i].textContent = choiceText;
        buttons[i].style.display = 'flex'
      });
  
      choicesContainer.style.display = 'flex';
    }
    if(data.narrative){
      addAssistantMessage(data.narrative)
    }
  }
  function addAssistantMessage(message){
    const assistantDiv = document.createElement('div');
    assistantDiv.className = 'message assistant';
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-content';
    assistantDiv.appendChild(messageDiv);

    const p = document.createElement("p");
    p.textContent = message;
    messageDiv.appendChild(p);

    document.getElementById('messages').appendChild(assistantDiv);

  }

    const startModal = document.getElementById("startModal");
    const choicesContainer = document.getElementById("choices");
    const messagesContainer = document.getElementById("messages");

    choicesContainer.style.display = 'none';
    const buttons = choicesContainer.getElementsByClassName('choice-btn');

    // Loop through them and make it invisible
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.display = 'none';
      buttons[i].addEventListener('click', async () => {
        const choice = buttons[i].textContent;
        // Call backend
        const response = await fetch("/api/story/choice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            choice: choice
          })
        });
        const data = await response.json();
        updateStory(data);
      });
    }
  
    const form = startModal.querySelector('form');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const theme = document.getElementById("adventureTheme").value;
      if(theme === ""){
        // Let browser show validation error
        return;
      }
      // Hide modal
      startModal.style.display = "none";

      // Call backend
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme })
      });

      const data = await response.json();
      updateStory(data);
    });
  });
