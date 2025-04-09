<!--
 * @Description: 
 * @Author: 
 * @Date: 2025-02-22 10:51:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-22 11:06:14
-->
<template>
  <div class="fanpai-out">
    <div class="game-info">
      <div>积分: <span id="score">0</span></div>
      <div>剩余尝试次数: <span id="attempts"></span></div>
      <div class="attempts-bar">
        <div class="attempts-progress" style="width: 100%"></div>
      </div>
    </div>
    <div class="game-container" id="gameContainer"></div>
  </div>
</template>

<script>
const EMOJIS = [
  "🎮",
  "🎲",
  "🎯",
  "🎨",
  "🎭",
  "🎪",
  "🎫",
  "🎬",
  "🎤",
  "🎧",
  "🎹",
  "🎷",
  "🎸",
  "🎺",
  "🎻",
  "🥁",
  "📱",
  "📷",
  "🎥",
  "📺",
  "🕹️",
  "👾",
  "♟️",
  "🖼️",
  "🎡",
  "🎢",
  "🎠",
  "🏟️",
  "🎆",
  "🎇",
  "🧨",
  "✨",
  "🎈",
  "🎉",
  "🎊",
  "🎁",
  "🎂",
  "🍰",
  "🧁",
  "🎃",
  "🎄",
  "🎋",
  "🎍",
  "🎎",
  "🎏",
  "🎐",
  "🎑",
  "🧧",
  "🎀",
  "🎁",
  "🪀",
  "🪁",
  "🧿",
  "🪄",
  "🪅",
  "🪆",
  "🧸",
  "🧩",
  "♠️",
  "♥️",
  "♦️",
  "♣️",
  "🃏",
  "🀄",
  "🎴",
  "🎭",
  "🖍️",
  "🖌️",
  "📝",
  "🎐",
  "🎿",
  "🛷",
  "🥌",
  "🎯",
  "🪀",
  "🏓",
  "🥏",
  "🎳",
  "🏏",
  "🏸",
  ""
];
export default {
  name: "",
  components: {},
  data() {
    return {
      container: null,
      scoreElement: null,
      attemptsElement: null,
      attemptsProgress: null,
      cards: [],
      flippedCards: [],
      matchedCount: 0,
      level: 2,
      score: 0,
      maxAttempts: 0,
      remainingAttempts: 0
    };
  },
  mounted() {
    this.container = document.getElementById("gameContainer");
    this.scoreElement = document.getElementById("score");
    this.attemptsElement = document.getElementById("attempts");
    this.attemptsProgress = document.querySelector(".attempts-progress");
    this.cards = [];
    this.flippedCards = [];
    this.matchedCount = 0;
    this.level = 2;
    this.score = 0;
    this.maxAttempts = 0;
    this.remainingAttempts = 0;
    this.init();
  },
  methods: {
    init() {
      this.createCards();
      this.updateAttempts();
      this.renderGrid();
      this.showCardsTemporarily();
    },

    createCards() {
      const pairs = this.level;
      const availableEmojis = this.shuffle([...EMOJIS]).slice(0, pairs);
      this.cards = [];
      availableEmojis.forEach((emoji) => {
        this.cards.push(emoji, emoji);
      });
      this.cards = this.shuffle(this.cards);
      this.maxAttempts = pairs * 2;
      this.remainingAttempts = this.maxAttempts;
    },

    shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    },

    renderGrid() {
      const columns = Math.ceil(Math.sqrt(this.level * 2));
      this.container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

      this.container.innerHTML = this.cards
        .map(
          (emoji, index) => `
                        <div class="card" data-value="${emoji}" data-index="${index}">
                            <div class="card-inner">
                                <div class="card-face front"><span>${emoji}</span></div>
                                <div class="card-face back"></div>
                            </div>
                        </div>
                    `
        )
        .join("");

      this.addEventListeners();
    },

    updateAttempts() {
      this.attemptsElement.textContent = `${this.remainingAttempts}/${this.maxAttempts}`;
      const progress = (this.remainingAttempts / this.maxAttempts) * 100;
      this.attemptsProgress.style.width = `${progress}%`;
    },

    showCardsTemporarily() {
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.add("flipped");
      });

      setTimeout(() => {
        document.querySelectorAll(".card").forEach((card) => {
          card.classList.remove("flipped");
        });
        this.enableGame();
      }, 3000);
    },

    addEventListeners() {
      document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", () => this.handleCardClick(card));
      });
    },

    handleCardClick(card) {
      if (this.remainingAttempts <= 0) return;

      if (
        this.flippedCards.length < 2 &&
        !card.classList.contains("flipped") &&
        !this.flippedCards.includes(card)
      ) {
        card.classList.add("flipped");
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
          this.remainingAttempts--;
          this.updateAttempts();
          this.checkMatch();
        }
      }
    },

    checkMatch() {
      const [card1, card2] = this.flippedCards;
      const match = card1.dataset.value === card2.dataset.value;

      if (match) {
        this.score += 100;
        this.matchedCount += 2;
        this.scoreElement.textContent = this.score;

        if (this.matchedCount === this.cards.length) {
          this.score += this.remainingAttempts * 50;
          this.scoreElement.textContent = this.score;
          this.levelUp();
        }
        this.flippedCards = [];
      } else {
        setTimeout(() => {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          this.flippedCards = [];
          if (this.remainingAttempts <= 0) {
            alert(`游戏结束！最终得分：${this.score}`);
            this.resetGame();
          }
        }, 1000);
      }
    },

    levelUp() {
      this.level++;
      this.matchedCount = 0;
      this.createCards();
      this.updateAttempts();
      this.renderGrid();
      this.showCardsTemporarily();
    },

    resetGame() {
      this.level = 2;
      this.score = 0;
      this.scoreElement.textContent = 0;
      this.init();
    },

    enableGame() {
      document.querySelectorAll(".card").forEach((card) => {
        card.style.pointerEvents = "auto";
      });
    }
  }
};
</script>
<style>
.fanpai-out {
  --card-size: 80px; /* 缩小卡片尺寸以适应更多卡片 */
  --gap: 4px; /* 减小间距 */
}

.fanpai-out {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  font-family: "Arial Rounded MT Bold", Arial, sans-serif;
}

.game-info {
  margin: 20px;
  font-size: 1.5em;
  color: #2c3e50;
}

.game-container {
  display: grid;
  gap: var(--gap);
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.card {
  width: var(--card-size);
  height: var(--card-size);
  perspective: 1000px;
  cursor: pointer;
  position: relative;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  border-radius: 12px;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.front {
  background: #ffffff;
  transform: rotateY(180deg);
  border: 3px solid #f8f9fa;
}

.front span {
  font-size: 2.8em;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.1));
}

.back {
  background: linear-gradient(
    45deg,
    #ff6b6b 0%,
    #ff9f43 20%,
    #feca57 40%,
    #2ecc71 60%,
    #54a0ff 80%,
    #5f27cd 100%
  );
  background-size: 600% 600%;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.attempts-bar {
  width: 300px;
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  margin: 10px 0;
  overflow: hidden;
}

.attempts-progress {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #3498db);
  transition: width 0.3s ease;
}
</style>