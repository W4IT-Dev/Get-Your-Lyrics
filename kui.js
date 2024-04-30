let classesWithColoredParents =
  /checkbox-container__input|radio-container__input|input-container__input|textarea-container__textarea|button-container|slider-container__slider/g;
let classesWithCheckboxes = /radio-container__input|checkbox-container__input/g

const callFunction = (callback, e) => {
  let element = e.target;
  //if element has any of those classes in regex then its parent will change class.
  if (element.className && element.className.match(classesWithColoredParents))
    callback(element.parentElement);
};

const blur = (element) => (element.classList.remove("selected"), softkeys('{hideSoftkeys}'));

const focus = (element) => element.classList.add("selected");

window.addEventListener("focus", (e) => callFunction(focus, e), true);
window.addEventListener("blur", (e) => callFunction(blur, e), true);

function showToast(text, time, color) {
  const toast = document.querySelector(".kui-toast")
  toast.style.background = "#" + color
  document.querySelector("meta[name=theme-color]").setAttribute("content", '#' + color);
  setTimeout(() => {
    toast.style.display = "block";
    document.querySelector(".kui-pri").innerHTML = text;
  }, 82)
  setTimeout(function () {
    toast.classList.add("byetoast")
    setTimeout(function () {
      toast.style.display = "none";
      toast.classList.remove("byetoast");
    }, 500);
    setTimeout(() => {
      document.querySelector("meta[name=theme-color]").setAttribute("content", '#0f1126');
    }, 49);
  }, time + 82);
}