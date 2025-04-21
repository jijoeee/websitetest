
document.addEventListener("DOMContentLoaded", function () {
  const introText = document.getElementById("intro-text");
  const introScreen = document.getElementById("intro");
  const mainContent = document.getElementById("main-content");

  const words = ["Hello", "Bonjour", "Ciao"];
  let index = 0;

  function showNextWord() {
    if (index < words.length) {
      introText.textContent = words[index];
      introText.style.animation = "none";
      void introText.offsetWidth;
      introText.style.animation = "fadeInOut 2s ease forwards";

      index++;
      setTimeout(showNextWord, 2000);
    } else {
      introScreen.style.display = "none";
      mainContent.style.display = "block";
    }
  }

  showNextWord();
});
