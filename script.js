const app = {
	byArtistAndTitle: {
		root: document.querySelector('#artistAndTitle'),
		artist: document.querySelector('#artist'),
		title: document.querySelector('#title'),
		insteadSearch: document.querySelector('#artistAndTitle .separator'),
		fetchButton: document.querySelector('#fetchLyrics'),
		result: document.querySelector('#lyricText')
	},
	search: {
		root: document.querySelector('#search'),
		searchInput: document.querySelector('#searchInput'),
		result: document.querySelector('#searchResult')
	},
	softkeys: {
		root: document.querySelector('.softkeys'),
		left: document.querySelector('.softkey-left'),
		center: document.querySelector('.softkey-center'),
		right: document.querySelector('.softkey-right')
	}
}


// ! === OLD CODE ===
// let preview;
// document.addEventListener('keydown', e => {
// 	if (e.key == "ArrowDown") nav(1)
// 	if (e.key == "ArrowUp") nav(-1)
// 	if (e.key == "Enter") {
// 		if (document.activeElement == app.byArtistAndTitle.insteadSearch) openSearch();
// 		if (document.activeElement == app.search.searchInput) clearTimeout(searchTypeTimeout), Fetch(`https://api.lyrics.ovh/suggest/${app.search.searchInput.value}`);
// 		if (document.activeElement.parentNode.id == "searchResult") {
// 			Fetch(`https://api.lyrics.ovh/v1/${document.activeElement.querySelector('.list-item__subtext').innerText}/${document.activeElement.querySelector('.list-item__text').innerText}`)
// 			app.search.searchInput.value = ""
// 			app.search.result.innerHTML = ""
// 		}

// 	}
// 	// PREVIEW
// 	if (e.key == "SoftRight" || e.key == "3") {
// 		if (document.activeElement.parentNode.id == "searchResult") {
// 			if (document.activeElement.dataset.playing == "true") preview.pause(), document.activeElement.dataset.playing = "false"
// 			else {
// 				if (preview && document.activeElement.dataset.playing == "false") preview.play(), document.activeElement.dataset.playing = "true"
// 				else {
// 					document.activeElement.dataset.playing = "true"
// 					if (preview) preview.pause(), preview.currentTime = 0, preview.src = ""
// 					preview = new Audio(results[document.activeElement.tabIndex].preview)
// 					preview.play();
// 				}
// 			}
// 		}
// 	}
// })

// function nav(move) {
// 	const currentIndex = document.activeElement;
// 	const items = document.querySelectorAll('.focusable');
// 	let currentElemIdx = [...items].indexOf(currentIndex);
// 	if (move == -1 && currentElemIdx == -1) currentElemIdx = items.length
// 	const next = currentElemIdx + move;
// 	const targetElement = items[next];
// 	if (targetElement) targetElement.focus();
// 	else items[0].focus();
// }

// // === GET LYRICS by Artist & Title ===
// function fetchLyrics() {
// 	app.byArtistAndTitle.fetchButton.innerText = "Loading..."
// 	Fetch(`https://api.lyrics.ovh/v1/${document.getElementById("artist").value}/${document.getElementById("title").value}`)
// }


// // === SEARCH ===
// let results;
// let resultsCopy;
// function openSearch() {
// 	app.byArtistAndTitle.root.classList.add('hidden')
// 	app.search.root.classList.remove('hidden')
// 	app.search.searchInput.focus();
// }

// // let searchTypeTimeout = null;
// function fetchSearch() {
// 	// if (searchTypeTimeout === null) {
// 	// 	searchTypeTimeout = setTimeout(() => {
// 	// 		Fetch(`https://api.lyrics.ovh/suggest/${app.search.searchInput.value}`)
// 	// 	}, 2000)
// 	// } else {
// 	// 	clearTimeout(searchTypeTimeout)
// 	// 	searchTypeTimeout = setTimeout(() => {
// 	// 		Fetch(`https://api.lyrics.ovh/suggest/${app.search.searchInput.value}`)
// 	// 	}, 2000)
// 	// }

// }
// let onlyAvaibleSongs = true
// function toggleFilter() {
// 	onlyAvaibleSongs = !onlyAvaibleSongs
// 	if (!onlyAvaibleSongs) return console.log(resultsCopy), results = resultsCopy, console.log(resultsCopy), displaySearchResults();
// 	for (let i = 0; i < results.length; i++) {
// 		fetch(`https://api.lyrics.ovh/v1/${results[i].artist.name}/${results[i].title}`)
// 			.then(response => {
// 				if (!response.ok) {
// 					throw new Error('Network response was not ok');
// 				}
// 				return response.json();
// 			})
// 			.then(data => {
// 				// Handle the JSON response data here
// 				console.log(data);
// 			})
// 			.catch(error => {
// 				// Handle any errors that occurred during the fetch
// 				results.shift()
// 				console.log(results)
// 				console.log(resultsCopy)
// 				// console.error('There was a problem with the fetch operation:', error);
// 				displaySearchResults();
// 			});

// 	}
// }

// // FETCH


// function Fetch(link) {
// 	console.log(link)
// 	let isSearch = link.includes('suggest')
// 	if (!isSearch) {
// 		if (app.byArtistAndTitle.root.classList.contains('hidden')) {
// 			app.byArtistAndTitle.artist.value = document.activeElement.querySelector('.list-item__subtext').innerText
// 			app.byArtistAndTitle.title.value = document.activeElement.querySelector('.list-item__text').innerText
// 		}
// 		app.byArtistAndTitle.result.innerText = "Fetching lyrics.."
// 		app.byArtistAndTitle.fetchButton.innerText = "Loading..."
// 		app.search.root.classList.add('hidden')
// 		app.byArtistAndTitle.root.classList.remove('hidden')
// 	}
// 	fetch(link)
// 		.then((response) => {
// 			if (!response.ok) {
// 				throw new Error("Network response was not ok");
// 			}
// 			return response.json();
// 		})
// 		.then((data) => {
// 			if (isSearch) {
// 				results = data.data;
// 				resultsCopy = data.data;
// 				console.log(resultsCopy)
// 				filter(results)
// 				displaySearchResults();
// 			} else {
// 				console.log('get lyrics')
// 				app.byArtistAndTitle.result.innerText = data.lyrics
// 				app.byArtistAndTitle.fetchButton.innerText = "Get lyrics"
// 			}
// 			// Work with the JSON data here
// 			// console.log(data);
// 		})
// 		.catch((error) => {
// 			console.error("There was a problem with the fetch operation:", error);
// 			if (isSearch) {
// 				app.search.result.innerText = "nothing found..."
// 			} else {
// 				app.byArtistAndTitle.fetchButton.innerText = "Get lyrics"
// 				app.byArtistAndTitle.result.innerText = "Nothing found"
// 			}

// 		});
// }






// // FILTER
// function filter(data) {
// 	if (!onlyAvaibleSongs) return data
// 	for (let i = 0; i < data.length; i++) {
// 		fetch(`https://api.lyrics.ovh/v1/${results[i].artist.name}/${results[i].title}`)
// 			.then((response) => {
// 				if (!response.ok) {
// 					throw new Error("Network response was not ok");
// 				}
// 				return response.json();
// 			})
// 			.then((data) => {
// 				results[i].lyrics = data.lyrics
// 				console.log('Lyric', data); // OK
// 				displaySearchResults();

// 			})
// 			.catch((error) => {
// 				console.error("No lyrics", error);
// 				results = results.filter(song => song !== data[i]);
// 			});

// 	}
// }

// ! ==== REWRITE ====

// == APP ==
// variables
let showOnlySongsWithAvaibleLyrics = true;


// keydown
let searchTypeTimeout;
document.addEventListener('keydown', e => {
	if (document.activeElement === app.search.searchInput) {
		clearTimeout(searchTypeTimeout)
		searchTypeTimeout = setTimeout(() => { search(app.search.searchInput.value) }, 1500)
	}
})

// open page
function go(target) {
	app.byArtistAndTitle.classList.add('hidden')
	app.search.classList.add('hidden')
	switch (target) {
		case 'byArtistAndTitle':
			app.byArtistAndTitle.classList.remove('hidden')
			break;
		case 'search':
			app.search.classList.remove('hidden')
			break;

		default:
			app.search.classList.remove('hidden')
			break;
	}
}

// set softkeys
function softkeys(left, center, right) {
	if (left === "hideSoftkeys") app.softkeys.root.classList.add('hidden')
	else app.softkeys.root.classList.remove('hidden')
	app.softkeys.left.innerHTML = left || ''
	app.softkeys.center.innerHTML = center || ''
	app.softkeys.right.innerHTML = right || ''
}

// == LYRICS by ARTIST & TITLE ==
// Fetch function
function fetchLyricsByArtistAndTitle(artist, title) {
	return fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			console.log(`Lyrics result when fetching lyrics from  ${artist + "/" + title}: ` + data)
			return data.lyrics; // Return the lyrics data
		})
		.catch((error) => {
			console.error(`Error when fetching lyrics from ${artist + "/" + title}: ` + error);
			return "Something went wrong. \n The lyrics might not be available. Try searching.";
		});
}

// Get lyrics function
function getLyrics(artist, title) {
	fetchLyricsByArtistAndTitle(artist, title)
		.then((lyrics) => {
			console.log(lyrics);
		})
}

// == LYRICS by SEARCH ==
// = SEARCH =
function fetchSearchQuery(query) {
	return fetch(`https://api.lyrics.ovh/suggest/${query}`) // TODO: USE DEEZER LINK and 30
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			console.log(`Search results to query ${query}: ` + data)
			if (showOnlySongsWithAvaibleLyrics) return filterSearch(data.data)
			else return data.data
		})
		.catch((error) => {
			console.error(`Error when trying to fetch search results to query ${query}: ` + error);
			return "Nothing found"
		});
}

function search(query) {
	if (query === "") return
	fetchSearchQuery(query)
		.then((results) => {
			displaySearchResults(results);
		})
}

function displaySearchResults(results) {
	app.search.result.innerHTML = ""
	for (let i = 0; i < results.length; i++) {
		app.search.result.innerHTML += `
		<div class="list-item-icon focusable" tabindex="${i}" onfocus="softkeys('Back', 'LYRICS','Preview');">
			<img src="${results[i].album.cover_small}" alt="" class="list-item-icon__icon" />
			<div class="list-item-icon__text-container">
  				<p class="list-item__text">${results[i].title}</p>
  				<p class="list-item__subtext">${results[i].artist.name}</p>
			</div>
		</div>
		`
	}
}

function filterSearch(songList) {
	console.log('filter');
	let filteredSongList = [];

	let fetchPromises = [];

	for (let i = 0; i < songList.length; i++) {
		fetchPromises.push(
			fetchLyricsByArtistAndTitle(songList[i].artist.name, songList[i].title)
				.then((result) => {
					if (result.includes('Something went wrong.')) {
						console.warn('No lyrics found. Song needs to be ejected');
					} else {
						console.log('Lyrics found. Song can stay');
						filteredSongList.push(songList[i]);
					}
				})
				.catch((error) => {
					console.warn('Error fetching lyrics:', error);
				})
		);
	}

	return Promise.all(fetchPromises)
		.then(() => {
			console.log(filteredSongList.length)
			return filteredSongList;
		});
}
