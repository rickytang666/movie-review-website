/* movie.js */

const APILINK = '/api/v1/reviews/';
const IMG_PATH = 'https://image.tmdb.org/t/p/original';
const DEFAULT_IMG = 'https://moviereelist.com/wp-content/uploads/2019/07/poster-placeholder.jpg';

const main = document.getElementById("section");

// Get movie ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const movieTitle = urlParams.get('title');

if (movieId) {
    showMovieDetails(movieId, movieTitle);
    loadReviews(movieId);
} else {
    main.innerHTML = '<h2>Movie not found</h2>';
}

function showMovieDetails(id, title) {
    const movieSection = document.createElement('div');
    movieSection.innerHTML = `
        <h2>${title}</h2>
        <div id="reviews-container">
            <h3>Reviews</h3>
            <div id="reviews-list"></div>
        </div>
        <div id="add-review">
            <h4>Add a Review</h4>
            <form id="review-form">
                <div class="form-field">
                    <label for="review">Review:</label>
                    <textarea id="review" name="review" rows="5" placeholder="Share your thoughts about this movie..." required></textarea>
                </div>
                <div class="form-field">
                    <label for="user">Username:</label>
                    <input type="text" id="user" name="user" placeholder="Enter your name" required>
                </div>
                <div class="form-field">
                    <button type="submit" class="submit-btn">🎬 Submit Review</button>
                </div>
            </form>
        </div>
    `;
    main.appendChild(movieSection);
    
    // Add form submit handler
    document.getElementById('review-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitReview(id);
    });
}

function loadReviews(movieId) {
    fetch(`${APILINK}movie/${movieId}`)
        .then(res => res.json())
        .then(reviews => {
            const reviewsList = document.getElementById('reviews-list');
            reviewsList.innerHTML = '';
            
            if (reviews.length === 0) {
                reviewsList.innerHTML = '<p>No reviews yet. Be the first to review this movie!</p>';
                return;
            }
            
            reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.setAttribute('class', 'review');
                reviewDiv.innerHTML = `
                    <div class="review-header">
                        <strong>${review.user}</strong>
                        <button class="delete-btn" onclick="deleteReview('${review._id}')">Delete</button>
                    </div>
                    <p>${review.review}</p>
                    <button class="edit-btn" onclick="editReview('${review._id}', '${review.user}', '${review.review}')">Edit</button>
                    <hr>
                `;
                reviewsList.appendChild(reviewDiv);
            });
        })
        .catch(err => {
            console.error('Error loading reviews:', err);
            document.getElementById('reviews-list').innerHTML = '<p>Error loading reviews</p>';
        });
}

function submitReview(movieId) {
    const user = document.getElementById('user').value;
    const review = document.getElementById('review').value;
    
    fetch(`${APILINK}new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            movieId: parseInt(movieId),
            user: user,
            review: review
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('review-form').reset();
            loadReviews(movieId); // Reload reviews
        } else {
            alert('Error submitting review');
        }
    })
    .catch(err => {
        console.error('Error submitting review:', err);
        alert('Error submitting review');
    });
}

function deleteReview(reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        fetch(`${APILINK}${reviewId}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                loadReviews(movieId); // Reload reviews
            } else {
                alert('Error deleting review');
            }
        })
        .catch(err => {
            console.error('Error deleting review:', err);
            alert('Error deleting review');
        });
    }
}

function editReview(reviewId, currentUser, currentReview) {
    const newUser = prompt('Edit name:', currentUser);
    const newReview = prompt('Edit review:', currentReview);
    
    if (newUser !== null && newReview !== null) {
        fetch(`${APILINK}${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: newUser,
                review: newReview
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                loadReviews(movieId); // Reload reviews
            } else {
                alert('Error updating review');
            }
        })
        .catch(err => {
            console.error('Error updating review:', err);
            alert('Error updating review');
        });
    }
}
