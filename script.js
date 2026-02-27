var currentCode = "";
var correctCode = "18012026";
var audio = document.getElementById("love-song");
// Si el <audio> no existe por alguna razón, evitamos que el script se quiebre
if (!audio) {
  audio = new Audio();
}

var playBtn = document.getElementById("play-pause-btn");
var playerWrapper = $('.music-player-wrapper');

$(document).ready(function () {

  createHearts();

  $('#heart-lock').click(function () {
    $('#safe-modal').fadeIn();
    $('.main-center-container').fadeOut();
  });

  $('#close-letter').click(function () {
    $('#letter-container').fadeOut();
    resetSafe();
    $('.main-center-container').fadeIn();
    $('.cadeado').removeClass('fadeOutUp').addClass('pulse');
  });

  $(document).keydown(function (e) {
    if ($('#safe-modal').is(':visible')) {
      var key = e.key;
      if (key >= '0' && key <= '9') pressKey(key);
      else if (key === 'Backspace' || key === 'Delete') pressKey('C');
      else if (key === 'Enter') checkPassword();
    }
  });

});

$(document).ready(function () {

  let toastTimer;
  const $toast = $("#toast");

  // 🔥 Mata cualquier handler viejo que cierre la carta
  $("#close-letter").off("click");

  // ✅ Nuevo comportamiento: NO cerrar, solo toast bonito
  $("#close-letter").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Reinicia animación para que NO sea brusca
    clearTimeout(toastTimer);
    $toast.removeClass("show");      // resetea
    void this.offsetWidth;           // fuerza reflow (truco anti-brusco)
    $toast.addClass("show");

    toastTimer = setTimeout(() => {
      $toast.removeClass("show");
    }, 6000);

    lanzarCorazones(15);
  });

});

function lanzarCorazones(n = 12) {
  for (let i = 0; i < n; i++) {
    const h = document.createElement("div");
    h.textContent = "💖";
    h.style.position = "fixed";
    h.style.left = (window.innerWidth / 2 + (Math.random() * 200 - 100)) + "px";
    h.style.bottom = "80px";
    h.style.fontSize = (16 + Math.random() * 18) + "px";
    h.style.zIndex = 9999;
    h.style.transition = "transform 1.2s ease, opacity 1.2s ease";
    document.body.appendChild(h);

    requestAnimationFrame(() => {
      h.style.transform = `translateY(-${120 + Math.random() * 120}px)`;
      h.style.opacity = "0";
    });

    setTimeout(() => h.remove(), 1300);
  }
}

function pressKey(key) {
  var screen = $('#screen-text');
  if (key === 'C') {
    currentCode = "";
    screen.text("DD / MM / AAAA");
    return;
  }
  if (screen.text() === "DD / MM / AAAA" || screen.text() === "Ups! No 💔") {
    currentCode = "";
  }
  if (currentCode.length < 8) {
    currentCode += key;
    screen.text(currentCode);
  }
}

function checkPassword() {
  var screen = $('#screen-text');
  if (currentCode === correctCode) {
    screen.text("¡Te Amo! ❤");
    screen.css("color", "#ff4351");
    setTimeout(function () {
      $('#safe-modal').fadeOut();
      setTimeout(function () {
        $('#letter-container').fadeIn();
        audio.play();
      }, 500);
    }, 1000);
  } else {
    screen.text("Ups! No 💔");
    currentCode = "";
    $('.safe-inner-wrapper').addClass('animated shake');
    setTimeout(function () {
      $('.safe-inner-wrapper').removeClass('animated shake');
      $('#screen-text').text("DD / MM / AAAA");
    }, 1200);
  }
}

function resetSafe() {
  currentCode = "";
  $('#screen-text').text("DD / MM / AAAA").css("color", "#ff4351");
  $('#safe-modal').hide();
}

function createHearts() {
  setInterval(function () {
    var heart = $('<div class="floating-heart"></div>');

    var size = Math.random() * 20 + 10;

    var leftPosition = (Math.random() + Math.random()) / 2 * 100;

    var duration = Math.random() * 5 + 5;
    var opacity = Math.random() * 0.6 + 0.4;
    var colorVar = Math.random() > 0.5 ? '#ff4351' : '#ff9a9e';

    heart.css({
      'width': size + 'px',
      'height': size + 'px',
      'left': leftPosition + '%',
      'animation-duration': duration + 's',
      'background-color': colorVar,
      'opacity': opacity,
      'filter': 'blur(' + (Math.random() * 1) + 'px)'
    });

    $('#hearts-container').append(heart);

    setTimeout(function () {
      heart.remove();
    }, duration * 1000);

  }, 150);
}