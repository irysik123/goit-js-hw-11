import refs from "./refs";

const { height: viewportHeight } =
  refs.bodyEl.firstElementChild.getBoundingClientRect();

window.onscroll = function () {
  scrollY >= viewportHeight
    ? refs.arrowTopEl.classList.remove('is-hidden')
    : refs.arrowTopEl.classList.add('is-hidden');
};