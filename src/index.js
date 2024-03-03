import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

document.addEventListener('DOMContentLoaded', function () {
  let apiKey = '42558172-f5e0f85868a75f219a6a2f1b6';
  let baseUrl = 'https://pixabay.com/api/';
  let currentPage = 1;
  let searchQuery = '';
  let totalHits = 0;

  const galleryContainer = document.querySelector('.gallery');

  function notiflixNotify(message, type = 'success') {
    Notiflix.Notify[type](message, {
      position: 'center',
      timeout: 3000,
    });
  }

  document
    .getElementById('search-form')
    .addEventListener('submit', function (event) {
      event.preventDefault();
      searchQuery = this.querySelector('input[name="searchQuery"]').value;
      currentPage = 1;
      performSearch();
    });

  function performSearch() {
    galleryContainer.innerHTML = '';
    document.querySelector('.load-more').addEventListener('click', function () {
      currentPage++;
      performSearch();
    });

    fetch(
      `${baseUrl}?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}`
    )
      .then(response => response.json())
      .then(data => {
        if (data.hits.length > 0) {
          totalHits = data.totalHits;
          displayImages(data.hits);
          document.querySelector('.load-more').style.display = 'block';
          notiflixNotify(`Hooray! We found ${totalHits} images.`);
          if (currentPage === 1) {
            initSimpleLightbox();
          } else {
            simpleLightbox.refresh();
          }
        } else {
          notiflixNotify(
            'Sorry, there are no images matching your search query. Please try again.',
            'failure'
          );
        }

        if (currentPage * 40 >= data.totalHits) {
          document.querySelector('.load-more').style.display = 'none';
          notiflixNotify(
            "We're sorry, but you've reached the end of search results.",
            'failure'
          );
        }

        scrollPageSmoothly();
      })
      .catch(() => {
        notiflixNotify(
          'An error occurred during the search. Please try again.',
          'failure'
        );
      });
  }

  function displayImages(images) {
    images.forEach(function (image) {
      let card = `
        <a href="${image.largeImageURL}" class="photo-card" data-lightbox="gallery">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </a>
      `;
      galleryContainer.insertAdjacentHTML('beforeend', card);
    });
  }

  function scrollPageSmoothly() {
    const { height: cardHeight } =
      galleryContainer.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }

  let simpleLightbox;

  function initSimpleLightbox() {
    simpleLightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }

  initSimpleLightbox();
});
