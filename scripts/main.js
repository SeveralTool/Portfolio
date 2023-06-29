window.onload = () => {
  if (document.images) {
  }
  const load = document.getElementById("load-window");
  load.style.transition = "all 0.5s";
  load.style.transform = "translateY(-101%)";
  setTimeout(() => {
    //Quitar carga de web
    load.style.display = "none";
  }, 300);

  // setTimeout(() => {
  //   boxNotifi.style.display = "grid";
  //   boxNotifi.style.transform = "translateX(-50%)";
  //   setTimeout(() => {
  //     CloseNotifi();
  //   }, 10000);
  // }, 10000);
};

// elegir idioma
let BtnES = document.getElementById("es");
let BtnEN = document.getElementById("en");
let txtEsp = document.querySelectorAll(".esp");
let txtEng = document.querySelectorAll(".eng");

BtnES.addEventListener("click", () => {
  BtnES.style.backgroundColor = "rgb(27, 120, 226)";
  BtnEN.style.backgroundColor = "#f000";
  txtEng.forEach((txtEn) => {
    txtEn.style.display = "none";
  });
  txtEsp.forEach((txtEs) => {
    txtEs.style.display = "block";
  });
});

BtnEN.addEventListener("click", () => {
  BtnES.style.backgroundColor = "#f000";
  BtnEN.style.backgroundColor = "rgb(27, 120, 226)";
  txtEsp.forEach((txtEs) => {
    txtEs.style.display = "none";
  });
  txtEng.forEach((txtEn) => {
    txtEn.style.display = "block";
  });
});

// Ruta de navegacion dinamica
//HR`S
var hr1 = document.getElementById("hr1");
var hr2 = document.getElementById("hr2");
var hr3 = document.getElementById("hr3");
var hr4 = document.getElementById("hr4");
var hr5 = document.getElementById("hr5");
//ICON
var icon1 = document.getElementById("icon-nav-1");
var icon2 = document.getElementById("icon-nav-2");
var icon3 = document.getElementById("icon-nav-3");
var icon4 = document.getElementById("icon-nav-4");
var icon5 = document.getElementById("icon-nav-5");
var icon6 = document.getElementById("icon-nav-6");

const nivel1 = document.getElementById("html").offsetTop;
const nivel2 = document.getElementById("intro-box").offsetTop;
const nivel3 = document.getElementById("nivel3").offsetTop;
const nivel4 = document.getElementById("nivel4").offsetTop;
const nivel5 = document.getElementById("nivel5").offsetTop-5000;
const nivel6 = document.getElementById("nivel6").offsetTop-5000;



// console.log(nivel1,nivel2,nivel3,nivel4,nivel5,nivel6)

//PINTAR EL PRIMER NIVEL AL INICIO
icon1.style.color = "rgb(27, 120, 226)";

// Función para pintar el icono del nivel activo
function pintarIcono(icono) {
  // Reiniciar color de todos los iconos
  icon1.style.color = "";
  icon2.style.color = "";
  icon3.style.color = "";
  icon4.style.color = "";
  icon5.style.color = "";
  icon6.style.color = "";

  icono.style.color = "rgb(27, 120, 226)";
}

function pintarHr(hrs) {
  hr1.style.borderColor = "";
  hr2.style.borderColor = "";
  hr3.style.borderColor = "";
  hr4.style.borderColor = "";
  hr5.style.borderColor = "";

  hrs.style.borderColor = "rgb(27, 120, 226)";
}

// Función para detectar el nivel activo según la posición de scroll
function detectarNivelActivo() {
  const scrollPos = window.scrollY; // Obtener posición de scroll
  // Comparar posición de scroll con los niveles de offset
  console.log("Pos actual: "+ scrollPos);
  console.log("Nivel1: "+ nivel1);
  console.log("Nivel2: "+ nivel2);
  console.log("Nivel3: "+ nivel3);
  console.log("Nivel4: "+ nivel4);
  console.log("Nivel5: "+ nivel5);
  console.log("Nivel6: "+ nivel6);
  if (scrollPos >= nivel1 && scrollPos < nivel2) {
    pintarIcono(icon1);
    pintarHr(hr1);
  } else if (scrollPos >= nivel2 && scrollPos < nivel3) {
    pintarIcono(icon2);
    pintarHr(hr2);
  } else if (scrollPos >= nivel3 && scrollPos < nivel4) {
    pintarIcono(icon3);
    pintarHr(hr3);
  } else if (scrollPos >= nivel4 && scrollPos < nivel5) {
    pintarIcono(icon4);
    pintarHr(hr4);
  } else if (scrollPos >= nivel5 && scrollPos < nivel6) {
    pintarIcono(icon5);
    pintarHr(hr5);
  } else if (scrollPos >= nivel6) {
    pintarIcono(icon6);
    pintarHr(hr5);
    // console.log("6");
  }
}

detectarNivelActivo();
// Asignar el evento onscroll a la ventana
window.onscroll = detectarNivelActivo;

///////////////////////////////////////

//Aparicion socials
var i = document.querySelectorAll(".i");

i.forEach((social) => {
  social.addEventListener("mouseover", (social) => {
    setTimeout(() => {
      mouseOver(social);
    }, 5);
  });
});

i.forEach((social) => {
  social.addEventListener("mouseout", (social) => {
    setTimeout(() => {
      mouseOverOut(social);
    }, 5);
  });
});

function mouseOver(social) {
  var t = social.target;
  var t2 = t.parentNode.parentNode;
  var t3 = t2.firstChild.nextElementSibling;
  t3.style.transtition = "all 0.1s";
  t3.style.display = "block";
  t2.style.backgroundColor = "rgba(27, 120, 226, 0.26)";
}

function mouseOverOut(social) {
  var t = social.target;
  var t2 = t.parentNode.parentNode;
  var t3 = t2.firstChild.nextElementSibling;
  t3.style.display = "none";
  t2.style.backgroundColor = "rgba(27, 120, 226, 0)";
  t2.style.backgroundColor = "f000";
}

///////////////////////////////////////

//carrousels
$(document).ready(function () {
  $(".carruseles").slick({
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    fade: true,
  });
});

///////////////////////////////////////

// DYNAMIC PROYECT PICS VIEWER
// const BtnShowPic = document.querySelectorAll(".pic-proyect");
// const BtnClosePic = document.querySelectorAll(".close2");

// BtnShowPic.forEach(function (element) {
//   element.addEventListener("click", function () {
//     var that = $(this).parent();
//     var ocultar = that.find("div")[0];
//     var BtnCerrar = that.find("i")[1];
//     var BtnShow = that.find("i")[0];
//     var imgs = that.find(".img-tec");
//     // console.log(imgs)
//     for (let i = 0; i < imgs.length; i++) {
//       const img = imgs[i];
//       img.style.display = "none";
//     }
//     ocultar.style.display = "none";
//     BtnShow.style.display = "none";
//     var Load = $(this).parent().find("span")[0];
//     Load.style.display = "flex";
//     // console.log(Load)
//     setTimeout(() => {
//       Load.style.display = "none";
//       BtnCerrar.style.display = "block";
//       var mostrar = that.find("div")[1];
//       mostrar.style.display = "block";
//     }, 2000);
//   });
// });

// BtnClosePic.forEach(function (element) {
//   element.addEventListener("click", function () {
//     var that = $(this).parent();
//     var ocultar = that.find("div")[1];
//     var mostrar = that.find("div")[0];
//     var BtnShow = that.find("i")[1];
//     var BtnCerrar = that.find("i")[0];
//     var imgs = that.find(".img-tec");
//     for (let i = 0; i < imgs.length; i++) {
//       const img = imgs[i];
//       img.style.display = "block";
//     }
//     ocultar.style.display = "none";
//     mostrar.style.display = "block";
//     BtnShow.style.display = "none";
//     BtnCerrar.style.display = "block";
//   });
// });

///////////////////////////////////////

// PASS GENERATOR IN JS (NOT PYTHON)
var input = document.getElementById("input-pass");
const generate = document.getElementById("generate");
var init;

generate.addEventListener("click", () => {
  init = function generatePassword(length, useLetters, useNumbers, useSymbols) {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^*()_+=[]{}|</?";
    let chars = "";

    if (useLetters) {
      chars += letters;
    }

    if (useNumbers) {
      chars += numbers;
    }

    if (useSymbols) {
      chars += symbols;
    }

    var password = "";

    for (let i = 0; i < length; i++) {
      const randomChar = chars[Math.floor(Math.random() * chars.length)];
      password += randomChar;
    }
    input.innerText = password;
  };
  timer();
  init(32, true, true, true);
});

const TimerBox = document.getElementById("timer");
let running = false;
let timeLeft;
let countdownTimer;
const defaul = "Password";

function timer() {
  if (running === false) {
    running = true;
    timeLeft = 10; // tiempo en segundos
    TimerBox.style.display = "block";
    TimerBox.innerHTML = timeLeft;

    countdownTimer = setInterval(() => {
      timeLeft--;
      TimerBox.innerHTML = timeLeft;
      if (timeLeft === 0) {
        clearInterval(countdownTimer);
        TimerBox.innerHTML = timeLeft;
        TimerBox.style.display = "none";
        running = false;
        timeLeft = 10;
        input.innerText = defaul;
      }
    }, 1000);
  } else if (running === true) {
    clearInterval(countdownTimer);
    TimerBox.style.display = "none";
    running = false;
    timeLeft = 10;
    input.innerText = defaul;
    init;
    timer();
  }
}

///////////////////////////////////////

//FUNCION PARA COPIAR PASSWORD
const btnCopy = document.getElementById("btn-copy");
const Check = document.getElementById("check");
const Close = document.getElementById("close");

btnCopy.addEventListener("click", () => {
  const contenido = input.innerText;
  if (contenido.length == 32) {
    // Copiar el texto seleccionado al portapapeles
    navigator.clipboard
      .writeText(contenido)
      .then(() => {
        //   console.log(contenido)
        //   console.log('Texto copiado al portapapeles');
      })
      .catch((error) => {
        console.error(
          "Error al copiar el texto, seguramente tu navegador no sea compatible con la funciona de clipboard, por lo cual se tendra que copiar manualmente: ",
          error
        );
      });
    Check.style.display = "inline-flex";
    setTimeout(() => {
      Check.style.display = "none";
    }, 1000);
  } else {
    Close.style.display = "inline-flex";
    setTimeout(() => {
      Close.style.display = "none";
    }, 700);
  }
});

///////////////////////////////////////

//SUAVIZAR MOVIMIENTOS
// Seleccionar todos los enlaces internos
const links = document.querySelectorAll('a[href^="#"]');
// Iterar a través de todos los enlaces internos
links.forEach((link) => {
  // Escuchar eventos de clic
  link.addEventListener("click", function (e) {
    // Prevenir el comportamiento predeterminado del enlace
    e.preventDefault();

    // Obtener la ubicación del elemento al que se hace referencia
    const target = this.getAttribute("href");
    const targetPosition = document.querySelector(target).offsetTop;

    // Calcular la distancia de desplazamiento y la duracion de la animación
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800; // ajustar la duracion segin sea necesario

    // Crear una variable para guardar el tiempo de inicio
    let start = null;

    // Crear una función para la animacion
    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Crear una función para la curva de aceleracion
    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }
    // Llamar a la función de animación
    requestAnimationFrame(animation);
  });
});

//ScrollReveal.js
function animated() {
  ScrollReveal({
    delay: 100,
    reset: true,
    duration: 500,
    distance: "200px",
    easing: "ease-in-out",
    reset: false,
  });

  // ScrollReveal().reveal(".intro-txt", { origin: "left" });
  // ScrollReveal().reveal(".skills-txt", { origin: "right" });
  // ScrollReveal().reveal(".left", { origin: "left" });
  // ScrollReveal().reveal(".right", { origin: "right" });
  // ScrollReveal().reveal("#face", { origin: "right" });
  // ScrollReveal().reveal(".passGenerator", { origin: "right" });
  // ScrollReveal().reveal(".intro-pass", { origin: "left" });
}
animated();

//NOTIFICACION

function CloseNotifi() {
  boxNotifi.style.transition = "all 0.3s";
  boxNotifi.style.transform = "translate(-50%,10px)";
  setTimeout(() => {
    boxNotifi.style.transition = "all 1s";
    boxNotifi.style.transform = "translate(-50%,-200px)";
  }, 300);
  setTimeout(() => {
    boxNotifi.style.display = "none";
  }, 800);
}

//Funcion para cerrar notificacion
// const boxNotifi = document.getElementById("box-notifi");
// document.getElementById("close-notifi").addEventListener("click", () => {
//   CloseNotifi();
// });
