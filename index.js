const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data) {
  let rawHTML= ''

  data.forEach((item) => {
    //title, image
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer text-muted">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
  </div>`
  })

  dataPanel.innerHTML = rawHTML
}

function showMovieModal (id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id)
  .then((response) => {
    const data = response.data.results
    
    modalTitle.innerText = data.title
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="=img-fuid">`
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    })

  .catch((error) => console.log(error))
}

function addToFavorite (id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中!')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')){
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')){
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  let filteredMovies = []

  if (!keyword.length) {
    return alert('Please enter a valid string')
  }

  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))

  renderMovieList(filteredMovies)
})

axios.get(INDEX_URL)
.then((response) => {
  movies.push(...response.data.results)
  renderMovieList(movies)
})
.catch((error) => console.log(error))