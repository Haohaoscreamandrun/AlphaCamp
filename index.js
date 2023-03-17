const BASE_URL = "https://webdev.alphacamp.io/"
const AllMovie = BASE_URL + "api/movies/"
const poster = BASE_URL + "posters/"
const movies = []
const dataPanel = document.querySelector('#data-panel')

axios
  .get(AllMovie)
  .then((response) => {
    // 80 arrays
    const movieArrary = response.data.results
    console.log(movieArrary)
    // for + push...original method
    //for (const movie of movieArrary) { movies.push(movie.title) }
    //console.log(movies)
    // ... spread operator (ES6)
    movies.push(...movieArrary)
    console.log(movies)
    dataPanel.innerHTML = renderMovieList(movies)
  })

dataPanel.addEventListener('click', event => {
  if (event.target.matches('.btn-show-movie')) {
    renderMovieModal(Number(event.target.dataset.id))
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
              <button class="btn btn-info btn-add-movie">+</button>
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
  axios.get(AllMovie+id).then(response=>{
    const data = response.data.results;
    modalTitle.innerHTML = data.title;
    modalPoster.src = poster + data.image;
    modalDate.innerHTML ='Released on: '+data.release_date;
    modalDescription.innerHTML = data.description;
  })
 }