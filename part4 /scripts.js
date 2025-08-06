const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
const API_PLACES_URL = `${API_BASE_URL}/places`;
const API_AUTH_URL = `${API_BASE_URL}/auth/login`;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

function setAuthToken(token) {
  document.cookie = `token=${token}; path=/; SameSite=Strict; Secure`;
}

function getAuthToken() {
  return getCookie('token');
}

function isUserLoggedIn() {
  return !!getAuthToken();
}

function displayError(elementId, message, color = 'red') {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.color = color;
  } else {
    console.error(`Element with id ${elementId} not found`);
  }
}

async function fetchAPI(url, options = {}) {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const data = await fetchAPI(API_AUTH_URL, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ email, password }),
    });
    
    console.log('Login successful');
    setAuthToken(data.access_token);
    window.location.href = 'index.html';
    return data;
  } catch (error) {
    displayError('login-error', error.message || 'Invalid credentials');
    throw error;
  }
}

async function fetchPlaces() {
  try {
    return await fetchAPI(API_PLACES_URL);
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
}

async function fetchPlacesFromDatabase() {
  try {
    const places = await fetchAPI('http://localhost:5000/api/places');
    console.log('Places retrieved from database:', places);
    return places;
  } catch (error) {
    console.error('Error fetching places from database:', error);
    return [];
  }
}

async function addPlaceToDatabase(placeData) {
  try {
    const newPlace = await fetchAPI('http://localhost:5000/api/places', {
      method: 'POST',
      body: JSON.stringify(placeData),
    });
    console.log('New place added to database:', newPlace);
    return newPlace;
  } catch (error) {
    console.error('Error adding place to database:', error);
    throw error;
  }
}

function setupStarRating() {
  const stars = document.querySelectorAll('.rating .star');
  if (!stars.length) return;
  
  let selectedRating = 0;
  
  function highlightStars(rating) {
    stars.forEach((star, index) => {
      star.classList.toggle('active', index < rating);
    });
  }
  
  function resetStars() {
    highlightStars(0);
  }
  
  stars.forEach((star, index) => {
    star.addEventListener('mouseover', () => highlightStars(index + 1));
    
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      highlightStars(selectedRating);
      console.log(`Rating selected: ${selectedRating}`);
    });
    
    star.addEventListener('mouseout', () => {
      highlightStars(selectedRating);
    });
  });
}

async function displayPlaces() {
  try {
    const places = await fetchPlaces();
    const placesContainer = document.getElementById('places-list');
    
    if (!placesContainer) {
      console.error('Element with id places-list not found');
      return;
    }
    
    placesContainer.innerHTML = '';
    
    if (places && Array.isArray(places) && places.length > 0) {
      const fragment = document.createDocumentFragment();
      
      places.forEach(place => {
        const placeElement = document.createElement('div');
        placeElement.className = 'place-card';
        placeElement.innerHTML = `
          <h3>${place.name || 'Unnamed Place'}</h3>
          <p>Host: ${place.host || 'Unknown'}</p>
          <p>Price per night: ${place.price || 'Not specified'}</p>
          <p>Description: ${place.description || 'No description'}</p>
          <p>Amenities: ${place.amenities || 'None listed'}</p>
        `;
        fragment.appendChild(placeElement);
      });
      
      placesContainer.appendChild(fragment);
    } else {
      placesContainer.innerHTML = '<p>No places to display.</p>';
    }
  } catch (error) {
    console.error('Error displaying places:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginLink = document.querySelector('.login-button');
  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'login.html';
    });
  }
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      
      if (!emailInput || !passwordInput) {
        displayError('login-error', 'Required form elements are missing');
        return;
      }
      
      try {
        await loginUser(emailInput.value, passwordInput.value);
      } catch (error) {
        console.error('Login attempt failed:', error);
      }
    });
  }
  
  setupStarRating();
  
  if (document.getElementById('places-list')) {
    displayPlaces();
  }
});
