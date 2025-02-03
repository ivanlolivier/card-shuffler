class QuestionCardsApp {
  constructor() {
    this.questions = [];
    this.initializeElements();
    this.addEventListeners();
    this.isShuffling = false;
  }

  initializeElements() {
    // Screens
    this.definitionScreen = document.getElementById("definition-screen");
    this.mainScreen = document.getElementById("main-screen");

    // Forms and inputs
    this.questionForm = document.getElementById("question-form");
    this.questionInput = document.getElementById("question-input");
    this.questionsList = document.getElementById("questions-list");

    // Buttons
    this.proceedBtn = document.getElementById("proceed-btn");
    this.shuffleBtn = document.getElementById("shuffle-btn");
    this.backBtn = document.getElementById("back-btn");

    // Cards container
    this.cardsContainer = document.getElementById("cards-container");
  }

  addEventListeners() {
    this.questionForm.addEventListener("submit", (e) =>
      this.handleQuestionSubmit(e)
    );
    this.proceedBtn.addEventListener("click", () => this.showMainScreen());
    this.shuffleBtn.addEventListener("click", () => this.shuffleCards());
    this.backBtn.addEventListener("click", () => this.showDefinitionScreen());
    this.questionInput.addEventListener("input", () => {
      const text = this.questionInput.value.trim();

      this.proceedBtn.disabled = text === "";
      if (text.length > 100) {
        this.questionInput.value = text.slice(0, 100);
      }

      document.querySelector("#text-length").textContent = text.length;
    });
  }

  handleQuestionSubmit(e) {
    e.preventDefault();
    const question = this.questionInput.value.trim();

    if (question) {
      this.questions.push(question);
      this.addQuestionToList(question);
      this.questionInput.value = "";
      this.proceedBtn.disabled = false;
    }
  }

  addQuestionToList(question) {
    const li = document.createElement("li");
    li.textContent = question;
    this.questionsList.appendChild(li);
  }

  showMainScreen() {
    this.definitionScreen.classList.add("hidden");
    this.mainScreen.classList.remove("hidden");
    this.renderCards();
  }

  showDefinitionScreen() {
    this.mainScreen.classList.add("hidden");
    this.definitionScreen.classList.remove("hidden");
  }

  renderCards() {
    this.cardsContainer.innerHTML = "";
    this.questions.forEach((question, index) => {
      const card = this.createCard(question, index);
      this.cardsContainer.appendChild(card);
    });
  }

  createCard(question, index) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <div class="card-inner">
                <div class="card-face">Hidden Question ${index + 1}</div>
                <div class="card-face card-back">${question}</div>
            </div>
        `;

    card.addEventListener("click", () => {
      if (!this.isShuffling) {
        card.classList.toggle("flipped");
      }
    });

    return card;
  }

  async shuffleCards() {
    if (this.isShuffling) return;
    this.isShuffling = true;

    // Add shuffling class to button and cards
    this.shuffleBtn.classList.add("shuffling");
    const cards = this.cardsContainer.querySelectorAll(".card");
    cards.forEach((card) => card.classList.add("shuffling"));

    // Fisher-Yates shuffle algorithm
    for (let i = this.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questions[i], this.questions[j]] = [
        this.questions[j],
        this.questions[i],
      ];
    }

    // Wait for animation to complete
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Remove shuffling classes and render new order
    this.shuffleBtn.classList.remove("shuffling");
    cards.forEach((card) => card.classList.remove("shuffling"));
    this.renderCards();

    this.isShuffling = false;
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  new QuestionCardsApp();
});
