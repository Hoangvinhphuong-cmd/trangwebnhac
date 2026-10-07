"use strict";

const songs = [
  {
    id: "co-chang-trai-viet-len-cay",
    title: "Có Chàng Trai Viết Lên Cây",
    artist: "Phan Mạnh Quỳnh",
    album: "Mắt Biếc OST",
    cover: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=600&h=600&q=85",
    audio: "music/song-1.mp3",
    duration: "4:36"
  },
  {
    id: "nang-tho",
    title: "Nàng Thơ",
    artist: "Hoàng Dũng",
    album: "25",
    cover: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&h=600&q=85",
    audio: "music/song-2.mp3",
    duration: "4:18"
  },
  {
    id: "buoc-qua-nhau",
    title: "Bước Qua Nhau",
    artist: "Vũ.",
    album: "Bước Qua Nhau",
    cover: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&h=600&q=85",
    audio: "music/song-3.mp3",
    duration: "4:02"
  },
  {
    id: "em-gi-oi",
    title: "Em Gì Ơi",
    artist: "Jack & K-ICM",
    album: "Em Gì Ơi",
    cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=600&h=600&q=85",
    audio: "music/song-4.mp3",
    duration: "4:47"
  },
  {
    id: "thang-tu-la-loi-noi-doi-cua-em",
    title: "Tháng Tư Là Lời Nói Dối Của Em",
    artist: "Hà Anh Tuấn",
    album: "Fragile",
    cover: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=600&h=600&q=85&sat=-35",
    audio: "music/song-5.mp3",
    duration: "5:12"
  }
];

const playlists = [
  { name: "Chill & Relax", count: 24, cover: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=260&h=260&q=80", songIds: ["buoc-qua-nhau", "nang-tho", "co-chang-trai-viet-len-cay"] },
  { name: "Nhạc Việt Hay Nhất", count: 32, cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=260&h=260&q=80", songIds: ["co-chang-trai-viet-len-cay", "nang-tho", "buoc-qua-nhau"] },
  { name: "Lofi Study", count: 18, cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=260&h=260&q=80", songIds: ["buoc-qua-nhau", "thang-tu-la-loi-noi-doi-cua-em", "nang-tho"] },
  { name: "Top Hits", count: 40, cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=260&h=260&q=80", songIds: ["em-gi-oi", "nang-tho", "co-chang-trai-viet-len-cay"] }
];

const artists = [
  { name: "Sơn Tùng M-TP", image: "photo-1500648767791-00dcc994a43e" },
  { name: "Vũ.", image: "photo-1506794778202-cad84cf45f1d" },
  { name: "Đen", image: "photo-1501196354995-cbb51c65aaea" },
  { name: "Hoàng Dũng", image: "photo-1507003211169-0a1dd7228f2d" },
  { name: "Hà Anh Tuấn", image: "photo-1507591064344-4c6ce005b128" },
  { name: "Mỹ Tâm", image: "photo-1534528741775-53994a69daeb" }
];

const songGrid = document.querySelector("#featured-grid");
const playlistGrid = document.querySelector("#playlist-grid");
const artistGrid = document.querySelector("#artist-grid");
const audio = document.querySelector("#audio-player");
const player = document.querySelector(".player");
const playButton = document.querySelector("#play-button");
const progressSlider = document.querySelector("#progress-slider");
const volumeSlider = document.querySelector("#volume-slider");
const searchInput = document.querySelector("#search-input");
const searchClear = document.querySelector("#search-clear");
const toast = document.querySelector("#toast");
let currentSongIndex = -1;
let filteredSongs = [...songs];
let history = [];
let isShuffle = false;
let repeatMode = 0;
let toastTimer;

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function renderSongs(list = songs) {
  songGrid.innerHTML = list.map((song) => `
    <article class="song-card" data-song-id="${song.id}">
      <div class="cover-wrap">
        <img class="cover-image" src="${song.cover}" alt="Ảnh bìa ${escapeHtml(song.album)}" loading="lazy">
        <span class="cover-shade" aria-hidden="true"></span>
        <button class="cover-play" type="button" data-play-song="${song.id}" aria-label="Phát ${escapeHtml(song.title)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>
        </button>
      </div>
      <div class="card-bottom">
        <div class="card-copy"><h3 title="${escapeHtml(song.title)}">${escapeHtml(song.title)}</h3><p>${escapeHtml(song.artist)}</p></div>
        <button class="card-like" type="button" data-like-song="${song.id}" aria-label="Thêm ${escapeHtml(song.title)} vào yêu thích" aria-pressed="false">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10a4.7 4.7 0 0 1 8.8-2.3 4.7 4.7 0 0 1 8.8 2.3Z"/></svg>
        </button>
      </div>
    </article>`).join("");
  songGrid.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => { image.src = fallbackCover; }, { once: true });
  });
  songGrid.querySelectorAll("[data-like-song]").forEach(updateLikeButton);
  document.querySelector("#empty-state").hidden = list.length > 0;
}

function renderPlaylists() {
  playlistGrid.innerHTML = playlists.map((playlist, index) => `
    <article class="playlist-card">
      <div class="playlist-cover"><img src="${playlist.cover}" alt="" loading="lazy"></div>
      <div class="playlist-info"><h3>${playlist.name}</h3><p>${playlist.count} bài hát · Tuyển chọn</p></div>
      <button class="playlist-play" type="button" data-playlist="${index}" aria-label="Phát playlist ${playlist.name}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>
      </button>
    </article>`).join("");
  playlistGrid.querySelectorAll("img").forEach((image) => image.addEventListener("error", () => { image.src = fallbackCover; }, { once: true }));
}

function renderArtists() {
  artistGrid.innerHTML = artists.map((artist) => `
    <button class="artist-card" type="button" data-artist="${escapeHtml(artist.name)}" aria-label="Tìm nhạc của ${escapeHtml(artist.name)}">
      <span class="artist-image-wrap"><img src="https://images.unsplash.com/${artist.image}?auto=format&fit=crop&w=240&h=240&q=80" alt="" loading="lazy"></span>
      <span>${escapeHtml(artist.name)}</span>
    </button>`).join("");
  artistGrid.querySelectorAll("img").forEach((image) => image.addEventListener("error", () => { image.src = fallbackCover; }, { once: true }));
}

const fallbackCover = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&h=600&q=80";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3000);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function getCurrentSong() {
  return currentSongIndex >= 0 ? songs[currentSongIndex] : null;
}

function updateLikeButton(button) {
  const liked = localStorage.getItem(`may-liked-${button.dataset.likeSong}`) === "true";
  button.classList.toggle("liked", liked);
  button.setAttribute("aria-pressed", String(liked));
  button.setAttribute("aria-label", `${liked ? "Xóa" : "Thêm"} ${songs.find((song) => song.id === button.dataset.likeSong)?.title ?? "bài hát"} ${liked ? "khỏi" : "vào"} yêu thích`);
}

function syncLikeState() {
  const song = getCurrentSong();
  const liked = song ? localStorage.getItem(`may-liked-${song.id}`) === "true" : false;
  document.querySelector("#player-like").classList.toggle("liked", liked);
  document.querySelector("#player-like").setAttribute("aria-pressed", String(liked));
  document.querySelector("#player-like").setAttribute("aria-label", liked ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích");
}

function updatePlayer(song) {
  document.querySelector("#player-title").textContent = song.title;
  document.querySelector("#player-artist").textContent = song.artist;
  const cover = document.querySelector("#player-cover");
  cover.src = song.cover;
  cover.alt = `Ảnh bìa ${song.album}`;
  cover.onerror = () => { cover.src = fallbackCover; };
  document.querySelector("#current-time").textContent = "0:00";
  document.querySelector("#duration-time").textContent = song.duration;
  progressSlider.value = "0";
  progressSlider.style.setProperty("--range-progress", "0%");
  syncLikeState();
}

async function playSong(index, shouldPlay = true) {
  if (!songs[index]) return;
  currentSongIndex = index;
  const song = songs[index];
  updatePlayer(song);
  if (!history.includes(song.id)) history.unshift(song.id);
  audio.src = song.audio;
  audio.load();
  if (!shouldPlay) return;
  try {
    await audio.play();
    player.classList.add("is-playing");
    playButton.setAttribute("aria-label", "Tạm dừng");
  } catch (error) {
    player.classList.remove("is-playing");
    playButton.setAttribute("aria-label", "Phát");
    if (error.name === "NotSupportedError" || error.name === "NotAllowedError") {
      showToast(`Chưa phát được "${song.title}". Hãy thêm file ${song.audio} vào thư mục music/.`);
      return;
    }
    showToast("Không thể phát bài hát. Kiểm tra lại file nhạc trong thư mục music/.");
  }
}

function togglePlayback() {
  if (currentSongIndex < 0) {
    playSong(filteredSongs.length ? songs.indexOf(filteredSongs[0]) : 0);
  } else if (audio.paused) {
    audio.play().then(() => {
      player.classList.add("is-playing");
      playButton.setAttribute("aria-label", "Tạm dừng");
    }).catch(() => showToast(`Hãy thêm file ${getCurrentSong().audio} vào thư mục music/ để nghe bài này.`));
  } else {
    audio.pause();
  }
}

function playNext(direction = 1) {
  const playlist = filteredSongs.length ? filteredSongs : songs;
  const current = getCurrentSong();
  let index = playlist.findIndex((song) => song.id === current?.id);
  if (isShuffle && playlist.length > 1) {
    let nextIndex = index;
    while (nextIndex === index) nextIndex = Math.floor(Math.random() * playlist.length);
    index = nextIndex;
  } else {
    index = (index + direction + playlist.length) % playlist.length;
  }
  playSong(songs.indexOf(playlist[index]));
}

function setRangeFill(input, percent) {
  input.style.setProperty("--range-progress", `${Math.max(0, Math.min(100, percent))}%`);
}

songGrid.addEventListener("click", (event) => {
  const playTarget = event.target.closest("[data-play-song]");
  if (playTarget) {
    const index = songs.findIndex((song) => song.id === playTarget.dataset.playSong);
    if (index >= 0) playSong(index);
    return;
  }
  const likeTarget = event.target.closest("[data-like-song]");
  if (likeTarget) {
    const liked = localStorage.getItem(`may-liked-${likeTarget.dataset.likeSong}`) === "true";
    localStorage.setItem(`may-liked-${likeTarget.dataset.likeSong}`, String(!liked));
    updateLikeButton(likeTarget);
    syncLikeState();
    showToast(!liked ? "Đã thêm vào bài hát yêu thích." : "Đã xóa khỏi bài hát yêu thích.");
  }
});

playlistGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-playlist]");
  if (!button) return;
  const playlist = playlists[Number(button.dataset.playlist)];
  filteredSongs = playlist.songIds.map((id) => songs.find((song) => song.id === id)).filter(Boolean);
  renderSongs(filteredSongs);
  const firstSong = filteredSongs[0];
  if (firstSong) playSong(songs.indexOf(firstSong));
  document.querySelector("#featured-title").textContent = playlist.name;
  document.querySelector("#featured").scrollIntoView({ behavior: "smooth", block: "start" });
});

artistGrid.addEventListener("click", (event) => {
  const artist = event.target.closest("[data-artist]")?.dataset.artist;
  if (!artist) return;
  searchInput.value = artist;
  filterSongs(artist);
  document.querySelector("#featured").scrollIntoView({ behavior: "smooth", block: "start" });
});

playButton.addEventListener("click", togglePlayback);
document.querySelector("#next-button").addEventListener("click", () => playNext(1));
document.querySelector("#previous-button").addEventListener("click", () => {
  if (audio.currentTime > 3) audio.currentTime = 0;
  else playNext(-1);
});
document.querySelector("#shuffle-button").addEventListener("click", (event) => {
  isShuffle = !isShuffle;
  event.currentTarget.classList.toggle("active", isShuffle);
  event.currentTarget.setAttribute("aria-pressed", String(isShuffle));
  showToast(isShuffle ? "Phát ngẫu nhiên đang bật." : "Đã tắt phát ngẫu nhiên.");
});
document.querySelector("#repeat-button").addEventListener("click", (event) => {
  repeatMode = (repeatMode + 1) % 3;
  audio.loop = repeatMode === 2;
  event.currentTarget.classList.toggle("active", repeatMode > 0);
  event.currentTarget.classList.toggle("repeat-one-active", repeatMode === 2);
  event.currentTarget.setAttribute("aria-label", ["Lặp lại", "Lặp lại danh sách", "Lặp lại một bài"][repeatMode]);
  showToast(["Đã tắt lặp lại.", "Đang lặp lại danh sách.", "Đang lặp lại một bài."][repeatMode]);
});
document.querySelector("#player-like").addEventListener("click", () => {
  const song = getCurrentSong();
  if (!song) return showToast("Chọn một bài hát trước nhé.");
  const liked = localStorage.getItem(`may-liked-${song.id}`) === "true";
  localStorage.setItem(`may-liked-${song.id}`, String(!liked));
  syncLikeState();
  songGrid.querySelectorAll(`[data-like-song="${song.id}"]`).forEach(updateLikeButton);
  showToast(!liked ? "Đã thêm vào bài hát yêu thích." : "Đã xóa khỏi bài hát yêu thích.");
});
document.querySelector("#volume-button").addEventListener("click", (event) => {
  audio.muted = !audio.muted;
  event.currentTarget.classList.toggle("active", audio.muted);
  event.currentTarget.setAttribute("aria-label", audio.muted ? "Bật tiếng" : "Tắt tiếng");
});
volumeSlider.addEventListener("input", () => {
  audio.volume = Number(volumeSlider.value);
  audio.muted = audio.volume === 0;
  setRangeFill(volumeSlider, audio.volume * 100);
  document.querySelector("#volume-button").classList.toggle("active", audio.muted);
});
progressSlider.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) audio.currentTime = Number(progressSlider.value) / 100 * audio.duration;
});
audio.addEventListener("play", () => {
  player.classList.add("is-playing");
  playButton.setAttribute("aria-label", "Tạm dừng");
});
audio.addEventListener("pause", () => {
  player.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "Phát");
});
audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration)) return;
  const progress = audio.currentTime / audio.duration * 100;
  progressSlider.value = String(progress);
  setRangeFill(progressSlider, progress);
  document.querySelector("#current-time").textContent = formatTime(audio.currentTime);
});
audio.addEventListener("loadedmetadata", () => {
  if (Number.isFinite(audio.duration)) document.querySelector("#duration-time").textContent = formatTime(audio.duration);
});
audio.addEventListener("ended", () => {
  if (repeatMode !== 2) playNext(1);
});
audio.addEventListener("error", () => {
  if (getCurrentSong()) showToast(`Chưa tìm thấy ${getCurrentSong().audio}. Hãy thêm file MP3 tương ứng vào thư mục music/.`);
});

function normalizeSearchText(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLocaleLowerCase("vi");
}

function filterSongs(query) {
  const normalized = normalizeSearchText(query.trim());
  filteredSongs = songs.filter((song) => normalizeSearchText(`${song.title} ${song.artist} ${song.album}`).includes(normalized));
  renderSongs(filteredSongs);
  document.querySelector("#featured-title").textContent = normalized ? "Kết quả tìm kiếm" : "Nhạc nổi bật";
}

searchInput.addEventListener("input", () => {
  searchClear.hidden = !searchInput.value;
  filterSongs(searchInput.value);
});
searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchClear.hidden = true;
  filterSongs("");
  searchInput.focus();
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  } else if (event.code === "Space" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    togglePlayback();
  }
});

document.querySelectorAll("[data-view]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const view = link.dataset.view;
    document.querySelectorAll("[data-view]").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
    if (view === "favorites") {
      filteredSongs = songs.filter((song) => localStorage.getItem(`may-liked-${song.id}`) === "true");
      renderSongs(filteredSongs);
      document.querySelector("#featured-title").textContent = "Bài hát yêu thích";
      document.querySelector("#featured").scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (view === "history") {
      filteredSongs = history.map((id) => songs.find((song) => song.id === id)).filter(Boolean);
      renderSongs(filteredSongs);
      document.querySelector("#featured-title").textContent = "Lịch sử nghe";
      document.querySelector("#featured").scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (view === "albums") {
      filteredSongs = [...songs];
      renderSongs(filteredSongs);
      document.querySelector("#featured-title").textContent = "Album";
      document.querySelector("#featured").scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (view === "artists") {
      document.querySelector("#artists").scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (view === "playlists") {
      document.querySelector("#playlists").scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (view === "discover") {
      filteredSongs = [...songs];
      renderSongs(filteredSongs);
      document.querySelector("#featured-title").textContent = "Khám phá";
      document.querySelector("#featured").scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (view === "home") {
      filteredSongs = [...songs];
      renderSongs(filteredSongs);
      document.querySelector("#featured-title").textContent = "Nhạc nổi bật";
      document.querySelector("#home").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (link.getAttribute("href") === "#discover") event.preventDefault();
  });
});

document.querySelector("#notification-button").addEventListener("click", () => showToast("Bạn đã cập nhật với những giai điệu mới nhất."));
audio.volume = Number(volumeSlider.value);
setRangeFill(volumeSlider, audio.volume * 100);
renderSongs();
renderPlaylists();
renderArtists();
syncLikeState();
