/* script.js */

const APILINK = '/api/movies';
const IMG_PATH = 'https://image.tmdb.org/t/p/original';
const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?&api_key=eb235cb686049d81abc6049b6b518e2f&query=';
const DEFAULT_IMG = 'https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg';

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

// Load popular movies on page load
returnMovies(APILINK);

function returnMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(function (data) {
            console.log(data.results);
            data.results.forEach(element => {
                const div_card = document.createElement('div');
                div_card.setAttribute('class', 'card');

                const div_row = document.createElement('div');
                div_row.setAttribute('class', 'row');

                const div_column = document.createElement('div');
                div_column.setAttribute('class', 'column');

                const image = document.createElement('img');
                image.setAttribute('class', 'thumbnail');
                image.setAttribute('id', 'image');

                const title = document.createElement('h3');
                title.setAttribute('id', 'title');

                title.innerHTML = `${element.title}<br><a href="movie.html?id=${element.id}&title=${element.title}">reviews</a>`;
                image.src = image.src = element.poster_path ? (IMG_PATH + element.poster_path) : DEFAULT_IMG;

                div_card.appendChild(image);
                div_card.appendChild(title);
                div_column.appendChild(div_card);
                div_row.appendChild(div_column);

                main.appendChild(div_row);
            });
        });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    main.innerHTML = '';

    const searchItem = search.value;

    if (searchItem) {
        // Use query parameter for search
        returnMovies(`${APILINK}?query=${encodeURIComponent(searchItem)}`);
        search.value = '';
    }
});

// Enable search using Ctrl K or Command K

document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        search.focus();
    }
});