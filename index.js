const BASE_URL = "https://webdev.alphacamp.io/"
const AllMovie = BASE_URL + "api/movies/"
const poster = BASE_URL + "posters/"
const movies = []
const moviesPerPage = 12
let prevPage = 1;
let complySearch = []
let keyValue = '';
let renderMode = 'Card';
const dataPanel = document.querySelector('#data-panel')
const searchBar = document.querySelector('#search-form')
const inputBar = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const renderToggle = document.querySelector('#render-toggle')

axios
  .get(AllMovie)
  .then((response) => {
    // 80 arrays
    const movieArrary = response.data.results
    // for + push...original method
    //for (const movie of movieArrary) { movies.push(movie.title) }
    //console.log(movies)
    // ... spread operator (ES6)
    movies.push(...movieArrary)
    renderPage(1)
  })


//Event Listener

dataPanel.addEventListener('click', event => {
  if (event.target.matches('.btn-show-movie')) {
    renderMovieModal(Number(event.target.dataset.id))
    // also listen to plus sign
  } else if (event.target.matches('.btn-add-movie')) {
    addToFavorite(Number(event.target.dataset.id))
    // event.target.classList.remove("btn-info")
    // event.target.innerHTML = ""
    // It should reflect localstorage
  }

})

searchBar.addEventListener('submit', event => {
  event.preventDefault()
  // take the input and store
  const inputValue = inputBar.value.trim().toLowerCase()
  // alert if empty
  if (!inputValue.length) { alert("Please input string!") }
  //filter through movies, filter (should use return)
  complySearch = movies.filter(value => {
    return value.title.toLowerCase().includes(inputValue)
  })
  //alert if no comply
  if (!complySearch.length) { alert(`Cannot find matches of input string: ${inputValue}`) }

  //render new movies list
  renderPage(1)
})

//How to get the input value realtime?
inputBar.addEventListener('keyup', event => {
  keyValue = inputBar.value.trim().toLowerCase()
  complySearch = movies.filter(value => value.title.toLowerCase().includes(keyValue))
  renderPage(1)
})

paginator.addEventListener('click', event => {
  if (event.target.tagName !== "A") return
  let page = event.target.dataset.page
  if (page !== 'p' && page !== 'n') {
    page = Number(page)
  }
  renderPage(page)
})

renderToggle.addEventListener('click', event => {
  if(event.target.id === 'render-bar'){
    renderMode = 'Bar'
  } else if (event.target.id === 'render-card'){
    renderMode = 'Card'
  }
  renderPage(prevPage)
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
  dataPanel.innerHTML = rawHTML;
}

function renderMovieBar(data) {
  let rawHTML = '<div class="container text-start">'
  data.forEach(element => {
    rawHTML +=
    `
    <div class="row align-items-start mt-2 mb-2 pt-2 border-top border-top-info border-top-2">
      <div class="col-6">
        <h5 class="card-title">${element.title}</h5>
      </div>
      <div class="col-6 text-end">
        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
            data-bs-target="#movie-modal" data-id="${element.id}">More</button>
        <button class="btn btn-info btn-add-movie" data-id="${element.id}">+</button>
      </div>
    </div>
    `
  })
  rawHTML += '</div>'
  dataPanel.innerHTML = rawHTML;
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

function getMoviesByPage(currentPage) {
  const data = keyValue.length? complySearch : movies
  const totalPages = Math.ceil(data.length / moviesPerPage);
  switch (currentPage) {
    case 'p':
      if (prevPage === 1) {
        alert("You're now at the first page!")
      }
      prevPage = Math.max(1, prevPage-1)
      break;
    case 'n':
      if (prevPage === totalPages) {
        alert("You're at the last page!")
      }
      prevPage = Math.min(totalPages, prevPage + 1)
      break;
    default:
      if (!isNaN(currentPage)) {
        prevPage = currentPage
        }
      break;
      
  }
  const startIndex = (prevPage - 1) * moviesPerPage;
  const pageGroup = data.slice(startIndex, startIndex + moviesPerPage);
  return pageGroup;
}



function renderPagination() {
  //Are users searching something?
  const data = keyValue.length ? complySearch : movies
  //How many pages?
  const numberOfPages = Math.ceil(data.length / moviesPerPage)
  // declaration
  let pageHTML = '<li class="page-item"><a class="page-link" href="#" data-page="p">Previous</a></li>'
  // loop
  for (let page = 1; page <= numberOfPages; page++) {
    pageHTML +=
      `
     <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }
  pageHTML += `<li class="page-item"><a class="page-link" href="#" data-page="n">Next</a></li>`
  // render
  paginator.innerHTML = pageHTML
}

function renderPage (page){
  if (renderMode === 'Card') {
    renderMovieList(getMoviesByPage(page))
  } else if (renderMode === 'Bar') {
    renderMovieBar(getMoviesByPage(page))
  }
  renderPagination()
}