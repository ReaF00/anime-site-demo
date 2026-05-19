const defaultAnimeList = [
  {
    title: 'Город звёзд',
    genre: 'Фэнтези',
    rating: 8.9,
    year: 2026,
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=800&q=80',
    text: 'Подборка атмосферных фэнтези-историй с красивой визуальной эстетикой и сильной драматургией.'
  },
  {
    title: 'Школа после дождя',
    genre: 'Романтика',
    rating: 8.4,
    year: 2025,
    image: 'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?auto=format&fit=crop&w=800&q=80',
    text: 'Нежная подборка романтических историй о взрослении, дружбе и первых чувствах.'
  },
  {
    title: 'Клинок рассвета',
    genre: 'Экшен',
    rating: 9.1,
    year: 2026,
    image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=800&q=80',
    text: 'Динамичные экшен-проекты с яркими боями, турнирами и героическими арками персонажей.'
  },
  {
    title: 'Тихое лето',
    genre: 'Драма',
    rating: 8.7,
    year: 2024,
    image: 'https://images.unsplash.com/photo-1612404819070-77c6da472e68?auto=format&fit=crop&w=800&q=80',
    text: 'Драматические истории с акцентом на персонажей, эмоции и жизненные выборы.'
  }
];

let animeList = JSON.parse(localStorage.getItem('animeList')) || defaultAnimeList;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentGenre = 'all';

const grid = document.getElementById('animeGrid');
const search = document.getElementById('search');
const sort = document.getElementById('sort');
const filters = document.getElementById('filters');

function renderCards() {
  const query = search.value.toLowerCase().trim();

  let items = animeList.filter(item => {
    const matchesGenre = currentGenre === 'all' || item.genre === currentGenre;
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.genre.toLowerCase().includes(query);

    return matchesGenre && matchesSearch;
  });

  if (sort.value === 'rating') items.sort((a, b) => b.rating - a.rating);
  if (sort.value === 'title') items.sort((a, b) => a.title.localeCompare(b.title, 'ru'));

  grid.innerHTML = items.map(item => `
    <article class="anime-card" onclick="openModal(${animeList.indexOf(item)})">
      <img class="poster" src="${item.image}" alt="${item.title}">
      <div class="anime-body">
        <h3>${item.title}</h3>
        <div class="meta">${item.genre} • ${item.year} • <span class="rating">★ ${item.rating}</span></div>
        <p>${item.text}</p>
        <br>
        <button class="btn secondary" onclick="event.stopPropagation(); addFavorite('${item.title}')">
          В избранное
        </button>
      </div>
    </article>
  `).join('') || '<p style="color: var(--muted);">Ничего не найдено. Попробуйте другой запрос.</p>';
}

filters.addEventListener('click', event => {
  if (!event.target.classList.contains('chip')) return;

  document.querySelectorAll('.chip').forEach(chip => chip.classList.remove('active'));
  event.target.classList.add('active');

  currentGenre = event.target.dataset.genre;
  renderCards();
});

search.addEventListener('input', renderCards);
sort.addEventListener('change', renderCards);

function openModal(index) {
  const item = animeList[index];

  document.getElementById('modalTitle').textContent = item.title;
  document.getElementById('modalMeta').textContent = `${item.genre} • ${item.year} • Рейтинг ${item.rating}`;
  document.getElementById('modalText').textContent = item.text;
  document.getElementById('modal').classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

function addFavorite(title) {
  if (!favorites.includes(title)) {
    favorites.push(title);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
  alert('Добавлено в избранное: ' + title);
}

function renderFavorites() {
  const block = document.getElementById('favoritesList');
  if (!block) return;

  block.innerHTML = favorites.length
    ? favorites.map(title => `
      <div style="display:flex; justify-content:space-between; gap:12px; align-items:center; margin-bottom:10px;">
        <span>⭐ ${title}</span>
        <button class="chip" onclick="removeFavorite('${title}')">Удалить</button>
      </div>
    `).join('')
    : 'Пока ничего не добавлено. Нажмите «В избранное» в карточке каталога.';
}

function removeFavorite(title) {
  favorites = favorites.filter(item => item !== title);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

function clearFavorites() {
  if (!confirm('Очистить всё избранное?')) return;

  favorites = [];
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

function saveProfile(event) {
  event.preventDefault();

  const name = document.getElementById('username').value || 'Гость';
  const status = document.getElementById('userStatus').value;

  localStorage.setItem('profile', JSON.stringify({ name, status }));
  alert('Профиль сохранён: ' + name + ' — ' + status);
}

function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('profile'));
  if (!profile) return;

  document.getElementById('username').value = profile.name;
  document.getElementById('userStatus').value = profile.status;
}

function resetProfile() {
  if (!confirm('Сбросить профиль?')) return;

  localStorage.removeItem('profile');
  document.getElementById('username').value = 'Senpai_404';
  document.getElementById('userStatus').value = 'Смотрю онгоинги';

  alert('Профиль сброшен');
}

function addAnime(event) {
  event.preventDefault();

  animeList.push({
    title: document.getElementById('adminTitle').value,
    genre: document.getElementById('adminGenre').value,
    rating: Number(document.getElementById('adminRating').value),
    year: Number(document.getElementById('adminYear').value),
    image: document.getElementById('adminImage').value || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    text: document.getElementById('adminText').value
  });

  localStorage.setItem('animeList', JSON.stringify(animeList));

  event.target.reset();
  renderCards();
  location.hash = '#catalog';

  alert('Карточка добавлена в каталог');
}

function resetAllData() {
  if (!confirm('Сбросить профиль, избранное и добавленные карточки?')) return;

  localStorage.removeItem('animeList');
  localStorage.removeItem('favorites');
  localStorage.removeItem('profile');

  animeList = [...defaultAnimeList];
  favorites = [];

  document.getElementById('username').value = 'Senpai_404';
  document.getElementById('userStatus').value = 'Смотрю онгоинги';

  renderFavorites();
  renderCards();

  alert('Все данные сброшены');
}

document.getElementById('modal').addEventListener('click', event => {
  if (event.target.id === 'modal') closeModal();
});

loadProfile();
renderFavorites();
renderCards();