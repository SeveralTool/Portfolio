const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^*()_+=[]{}|</?";
const CHARSET = LETTERS + NUMBERS + SYMBOLS;
const PLACEHOLDER = "Password";

function createPassword(length: number) {
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  let password = "";
  for (const value of values) {
    password += CHARSET[value % CHARSET.length];
  }
  return password;
}

export function initPassword() {
  const input = document.getElementById("input-pass");
  const generate = document.getElementById("generate");
  const timerBox = document.getElementById("timer");
  const copyButton = document.getElementById("btn-copy");
  const check = document.getElementById("check");
  const close = document.getElementById("close");
  if (!input || !generate || !timerBox || !copyButton) return;

  let running = false;
  let timeLeft = 10;
  let countdown = 0;

  const startTimer = () => {
    window.clearInterval(countdown);
    running = true;
    timeLeft = 10;
    timerBox.style.display = "block";
    timerBox.textContent = String(timeLeft);
    countdown = window.setInterval(() => {
      timeLeft -= 1;
      timerBox.textContent = String(timeLeft);
      if (timeLeft > 0) return;
      window.clearInterval(countdown);
      timerBox.style.display = "none";
      running = false;
      input.textContent = PLACEHOLDER;
    }, 1000);
  };

  generate.addEventListener("click", () => {
    input.textContent = createPassword(32);
    if (running) {
      window.clearInterval(countdown);
      running = false;
      timerBox.style.display = "none";
    }
    startTimer();
  });

  copyButton.addEventListener("click", async () => {
    const content = input.textContent ?? "";
    if (content.length === 32) {
      try {
        await navigator.clipboard.writeText(content);
      } catch (error) {
        console.error("No se pudo copiar la contraseña.", error);
      }
      if (check) check.style.display = "inline-flex";
      window.setTimeout(() => {
        if (check) check.style.display = "none";
      }, 1000);
      return;
    }

    if (close) close.style.display = "inline-flex";
    window.setTimeout(() => {
      if (close) close.style.display = "none";
    }, 700);
  });
}
