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
    // also listen to delete sign
  } else if (event.target.matches('.btn-delete-movie')){
    deleteFavMovie(Number(event.target.dataset.id))
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
              <button class="btn btn-danger btn-delete-movie" data-id="${element.id}">X</button>
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

function deleteFavMovie(deId) {
  // bug control - should not be execute if there's no fav movie
  if (!movies || !movies.length) return 
  //find the index of deId movie
  const delMovieIndex = movies.findIndex(movie => movie.id === deId)
  //bug control - don't delete if no match (findIndex will return -1 if nothing's found)
  if (delMovieIndex === -1) return
  //splice it from movies list
  movies.splice(delMovieIndex,1)
  //tug back to storage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  //render the screen
  dataPanel.innerHTML = renderMovieList(movies)
}