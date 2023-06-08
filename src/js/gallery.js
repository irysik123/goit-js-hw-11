import refs from "./refs";
import { PixabayAPI } from "./pixabay-api";
import { createGalleryCard } from "./createMarkup";

const pixabayApi = new PixabayAPI ();

refs.form.addEventListener('submit', onSubmitForm);

async function onSubmitForm(event) {
    event.preventDefault();
    const searchQuery = event.currentTarget.elements['search-query'].value.trim();
    pixabayApi.query = searchQuery;
    pixabayApi.page = 1;
    refs.list.innerHTML = "";
    refs.loadMoreBtn.classList.add('is-hidden')

    if(searchQuery === '') {
        return alert('Запит не повинен бути пустим!')
    }

    try {
        const response = await pixabayApi.getPhotosByQuery();
        const markup = createGalleryCard(response.data.hits)

        if(response.data.hits.length === 0) {
            return alert(`Sorry, there are no images matching your search query ${searchQuery}. Please try again.`)
        }

        alert(`Hooray! We found ${response.data.totalHits} images.`)

        refs.list.insertAdjacentHTML("beforeend", markup)

        if(response.data.totalHits < pixabayApi.perPage) {
            return
        }
        refs.loadMoreBtn.classList.remove('is-hidden')
      } catch (error) {
        console.error(error);
      }
 }

