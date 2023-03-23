const BASE_URL = "https://webdev.alphacamp.io/"
const AllMovie = BASE_URL + "api/movies/"
const poster = BASE_URL + "posters/"
const movies = []
const dataPanel = document.querySelector('#data-panel')
const searchBar = document.querySelector('#search-form')
const inputBar = document.querySelector('#search-input')


const movieArrary = JSON.parse(localStorage.getItem('favoriteMovies')) || []   
movies.push(...movieArrary)
dataPanel.innerHTML = renderMovieList(movies)

dataPanel.addEventListener('click', event => {
  if (event.target.matches('.btn-show-movie')) {
    renderMovieModal(Number(event.target.dataset.id))
    // also listen to plus sign
  } else if (event.target.matches('.btn-add-movie')) {
    addToFavorite(Number(event.target.dataset.id))
  }

})


//Function
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(element => {
    rawHTML +=
      `
      <div class="col-sm-3">
        <div class="mb-3">
          <div class="card">
            <img
              src="${poster}${element.image}"
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${element.title}</h5>
            </div>
            <div class="card-footer text-muted">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id="${element.id}">More</button>
              <button class="btn btn-info btn-add-movie" data-id="${element.id}">+</button>
            </div>
          </div>
        </div>
      </div>
      `
  });
  return rawHTML;
}

function renderMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title');
  const modalPoster = document.querySelector('#movie-modal-poster');
  const modalDate = document.querySelector('#movie-modal-date');
  const modalDescription = document.querySelector('#movie-modal-description');
  axios.get(AllMovie + id).then(response => {
    const data = response.data.results;
    modalTitle.innerHTML = data.title;
    modalPoster.src = poster + data.image;
    modalDate.innerHTML = 'Released on: ' + data.release_date;
    modalDescription.innerHTML = data.description;
  })  
}



function addToFavorite(favId) {

  function isIdMatch(movie) {
    return movie.id === favId
  }
  // Target is to store the movie into local storage
  // Get the movie id you click on
  const favMovie = movies.find(isIdMatch)
  // Reach out to the local storage for favorite movies(return empty array if no)
  const favList = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  // Logic to tell if the click on movie already in favList
  if (favList.some(isIdMatch)) {
    return alert("Movie already in favorite list!")
  } else {
    // If not in list, store it in the list
    favList.push(favMovie)
    localStorage.setItem('favoriteMovies', JSON.stringify(favList))
  }
}