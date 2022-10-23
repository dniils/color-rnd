const columns = document.querySelectorAll(".col");
const colButtons = document.querySelectorAll(".col button i");

document.addEventListener("keydown", (event) => {
  const keyCodes = ["Space", "Enter", "KeyF"];

  if (keyCodes.includes(event.code)) {
    event.preventDefault();
    setRandomColors();
  } else if (event.code === "KeyL") {
    for (i = 0; i < colButtons.length; i++) {
      colButtons[i].classList.remove("fa-lock-open");
      colButtons[i].classList.add("fa-lock");
    }
  } else if (event.code === "KeyU") {
    for (i = 0; i < colButtons.length; i++) {
      colButtons[i].classList.remove("fa-lock");
      colButtons[i].classList.add("fa-lock-open");
    }
  } else {
    const helpIcon = document.querySelector(".help__icon");

    helpIcon.style.scale = 1.5;

    setTimeout(changeScaleBack, 150);

    function changeScaleBack() {
      helpIcon.style.scale = 1;
    }
  }
});

document.addEventListener("click", (event) => {
  const type = event.target.dataset.type;

  if (type === "lock") {
    const node =
      event.target.tagName.toLowerCase() === "i"
        ? event.target
        : event.target.children[0];
    node.classList.toggle("fa-lock-open");
    node.classList.toggle("fa-lock");
  } else if (type === "copy") {
    copyToClipboard(event.target.textContent);
  }
});

function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

// function genRandomColor() {
//   const hexCodes = "0123456789ABCDEF";
//   let color = "";
//   for (let i = 0; i < 6; i++) {
//     color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
//   }
//   return "#" + color;
// }

function setRandomColors(isInitial) {
  // const colors = [];
  const colors = isInitial ? getColorsFromHash() : [];

  columns.forEach((col, index) => {
    const isLocked = col.querySelector("i").classList.contains("fa-lock");
    const colorCode = col.querySelector("h2");
    const colorNameBox = col.querySelector("h3");
    const colorMatchBox = col.querySelector(".col__color-status");
    const button = col.querySelector("button");

    if (isLocked) {
      colors.push(colorCode.textContent);
      return;
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random().hex()
      : chroma.random().hex();

    if (!isInitial) {
      colors.push(color);
    }

    const colorName = ntc.name(color)[1];
    const colorMatch = ntc.name(color)[2];

    colorCode.textContent = color;
    colorNameBox.textContent = colorName;

    if (colorMatch === true) {
      colorMatchBox.textContent = "solid match";
    } else {
      colorMatchBox.textContent = "approx. match";
    }

    col.style.background = color;

    setTextColor(colorCode, color);
    setTextColor(colorNameBox, color);
    setTextColor(colorMatchBox, color);
    setTextColor(button, color);
  });
  updateHash(colors);
}

function setTextColor(colorCode, color) {
  const luminance = chroma(color).luminance();
  colorCode.style.color = luminance > 0.2 ? "#000" : "#fff";
}

function updateHash(colors = []) {
  // document.location.hash = colors.toString().replace(/(#)|(,#)/g, "-");
  document.location.hash = colors
    .map((col) => col.toString().substring(1))
    .join("-");
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
  return [];
}

setRandomColors(true);
