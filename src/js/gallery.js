import refs from './refs';
import { PixabayAPI } from './pixabay-api';
import { createGalleryCard } from './createMarkup';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });

const pixabayApi = new PixabayAPI();

refs.form.addEventListener('submit', onSubmitForm);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

async function onSubmitForm(event) {
  event.preventDefault();
  const searchQuery = event.currentTarget.elements['search-query'].value.trim();
  pixabayApi.query = searchQuery;
  pixabayApi.page = 1;
  refs.list.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');

  if (searchQuery === '') {
    return alert('Запит не повинен бути пустим!');
  }

  try {
    const response = await pixabayApi.getPhotosByQuery();
    const markup = createGalleryCard(response.data.hits);

    if (response.data.hits.length === 0) {
      return alert(
        `Sorry, there are no images matching your search query ${searchQuery}. Please try again.`
      );
    }

    alert(`Hooray! We found ${response.data.totalHits} images.`);

    refs.list.insertAdjacentHTML('beforeend', markup);
    gallery.refresh()

    if (response.data.totalHits < pixabayApi.perPage) {
      return;
    }
    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    console.error(error);
  }
}

async function onLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
  pixabayApi.page += 1;
  try {
    const response = await pixabayApi.getPhotosByQuery();
    const markup = createGalleryCard(response.data.hits);

    refs.list.insertAdjacentHTML('beforeend', markup);
    gallery.refresh()

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    const lastPage = Math.ceil(response.data.totalHits / pixabayApi.perPage);

    if(lastPage === pixabayApi.page) {
        return alert("We're sorry, but you've reached the end of search results.")
    }

    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    console.error(error);
  }
}
