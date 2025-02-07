const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []
let page = 1

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const displayModeControl = document.querySelector('#display-mode-control')

// render table
function renderMovieList(data) {
  let rawHTML= ''

  data.forEach((item) => {
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

// render list
function renderListView(data) {
  let rawHTML= ''

  rawHTML += '<ul class="list-group list-group-flush">'
  data.forEach((item) => {
    rawHTML += `<li class="list-group-item d-flex justify-content-between">
                  <h5 class="card-title">${item.title}</h5>
                  <div class="text-muted">
                    <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal"
                      data-id="${item.id}">More</button>
                    <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                  </div>
                </li>`
  })
  rawHTML += '</ul>'

  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page ++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

function getMoviesByPage (page) {
  const data = filteredMovies.length ? filteredMovies : movies

  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
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

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  page = Number(event.target.dataset.page)

  if (dataPanel.innerHTML.includes('list-group')) {
    renderListView(getMoviesByPage(page))
  }else if (dataPanel.innerHTML.includes('card')) {
    renderMovieList(getMoviesByPage(page))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  if (!keyword.length) {
    return alert('Please enter a valid string')
  }

  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))

  if (dataPanel.innerHTML.includes('list-group')) {
    renderPaginator(filteredMovies.length)
    renderListView(getMoviesByPage(page))
  }else if (dataPanel.innerHTML.includes('card')) {
    renderPaginator(filteredMovies.length)
    renderMovieList(getMoviesByPage(page))
  }
})

displayModeControl.addEventListener('click', function changeDisplayMode(event) {
  if (event.target.id === 'list-mode') {
    renderPaginator(movies.length)
    renderListView(getMoviesByPage(page))
  }else if (event.target.id === 'table-mode') {
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(page))
  }
})

axios.get(INDEX_URL)
.then((response) => {
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(page))
})
.catch((error) => console.log(error))