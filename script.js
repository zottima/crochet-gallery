const mainImage = document.getElementById("mainImage");
const mainCaption = document.getElementById("mainCaption");
const thumbStrip = document.getElementById("thumbStrip");
const counter = document.getElementById("counter");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const emptyState = document.getElementById("emptyState");
const lastUpdated = document.getElementById("lastUpdated");

let pieces = [];
let activeIndex = 0;

function showPiece(index) {
  if (pieces.length === 0) return;

  // wrap around at either end so left/right browsing never dead-ends
  activeIndex = (index + pieces.length) % pieces.length;
  const piece = pieces[activeIndex];

  mainImage.src = "images/" + piece.file;
  mainImage.alt = piece.title;
  mainCaption.textContent = piece.title;
  counter.textContent = (activeIndex + 1) + " / " + pieces.length;

  const allThumbButtons = thumbStrip.querySelectorAll("button");
  allThumbButtons.forEach(function (button, i) {
    if (i === activeIndex) {
      button.setAttribute("aria-current", "true");
      button.scrollIntoView({ inline: "center", block: "nearest" });
    } else {
      button.removeAttribute("aria-current");
    }
  });
}

function buildThumbnails() {
  pieces.forEach(function (piece, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", piece.title);
    button.addEventListener("click", function () {
      showPiece(index);
    });

    const thumbImg = document.createElement("img");
    thumbImg.src = "images/" + piece.file;
    thumbImg.alt = "";
    thumbImg.loading = "lazy";

    button.appendChild(thumbImg);
    thumbStrip.appendChild(button);
  });
}

prevButton.addEventListener("click", function () {
  showPiece(activeIndex - 1);
});

nextButton.addEventListener("click", function () {
  showPiece(activeIndex + 1);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") showPiece(activeIndex - 1);
  if (event.key === "ArrowRight") showPiece(activeIndex + 1);
});

fetch("manifest.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    pieces = data.pieces;
    lastUpdated.textContent = data.generated_at;
    if (pieces.length === 0) {
      emptyState.hidden = false;
      document.querySelector(".stage").hidden = true;
      counter.hidden = true;
      return;
    }
    buildThumbnails();
    showPiece(0);
  })
  .catch(function (error) {
    emptyState.hidden = false;
    emptyState.textContent = "Could not load manifest.json — has it been built yet?";
    console.error(error);
  });
