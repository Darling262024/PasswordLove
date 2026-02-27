var currentCode = "";
var correctCode = "18012026";

var audio = null;

$(document).ready(function () {

  // Asegurar audio después de que exista el DOM
  audio = document.getElementById("love-song");
  if (!audio) audio = new Audio();

  createHearts();

  // Abrir modal del candado
  $('#heart-lock').click(function () {
    $('#safe-modal').fadeIn();
    $('.main-center-container').fadeOut();
  });

  // ✅ Guardar Carta: NO cierra, solo toast+corazones+email
  let toastTimer;
  const $toast = $("#toast");

  $('#close-letter').off('click').on('click', function (e) {
    e.preventDefault();

    // Toast suave
    clearTimeout(toastTimer);
    $toast.addClass('show');
    toastTimer = setTimeout(() => {
      $toast.removeClass('show');
    }, 7000);

    // Corazones (los que salen al guardar)
    lanzarCorazones(15);

    // Email (anti-spam 1 vez por navegador)
    if (localStorage.getItem("carta_guardada") !== "1") {
      localStorage.setItem("carta_guardada", "1");

      // desactivar botón para evitar spam
      this.disabled = true;
      this.style.opacity = "0.7";

      const params = {
        name: "Jenni",
        time: new Date().toLocaleString(),
        page: window.location.href
      };
    }

    descargarCartaPDF();
  });

  function descargarCartaPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4"
    });

    // Márgenes
    const margin = 18;
    let y = 25;

    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Para ti, mi amor <3", margin, y);
    y += 12;

    // Subtítulo / fecha
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const fecha = new Date().toLocaleString();
    doc.text(`Fecha: ${fecha}`, margin, y);
    y += 10;

    // Cuerpo de la carta (editá este texto a tu gusto)
    doc.setFontSize(14);

    const carta = 
    `Jenni,

Solo queria decirte algo simple pero real:
TE AMO.

Gracias por estar conmigo, por tu forma de ser,
por tu paciencia, por tus detalles y por hacerme
sentir bien incluso desde lejos.

Esto no es solo una carta,
es una promesa de seguir eligiendote.

Con amor,
Alex`
      .trim();

    // Ajuste de texto a varias líneas
    const maxWidth = 210 - margin * 2; // ancho útil en A4 (mm)
    const lines = doc.splitTextToSize(carta, maxWidth);
    doc.text(lines, margin, y);

    // Guardar/descargar
    doc.save("Carta-para-Jenni.pdf");
  }

  // Teclado físico para ingresar clave
  $(document).keydown(function (e) {
    if ($('#safe-modal').is(':visible')) {
      var key = e.key;
      if (key >= '0' && key <= '9') pressKey(key);
      else if (key === 'Backspace' || key === 'Delete') pressKey('C');
      else if (key === 'Enter') checkPassword();
    }
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

        // Autoplay al desbloquear
        try {
          audio.currentTime = 0;
          audio.muted = false;
          audio.play().catch(console.log);
        } catch (e) { }

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