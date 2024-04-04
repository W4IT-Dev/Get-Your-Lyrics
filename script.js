const app = {
	byArtistAndTitle: {
		root: document.querySelector('#artistAndTitle'),
		artist: document.querySelector('#artist'),
		title: document.querySelector('#title'),
		// insteadSearch: document.querySelector('#artistAndTitle .separator'),
		fetchButton: document.querySelector('#fetchLyrics'),
		result: document.querySelector('#lyricsText')
	},
	search: {
		root: document.querySelector('#search'),
		searchInput: document.querySelector('#searchInput'),
		result: document.querySelector('#searchResult')
		// filterToggle: document.querySelector('#filterToggle')
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
let showOnlySongsWithAvaibleLyrics = false;


// KEYDOWN
let searchTypeTimeout, currentScreen, preview = new Audio();
document.addEventListener('keyup', e => {
	const focusedElement = document.activeElement;
	// Go BACK

	if (e.key == "Backspace" && document.activeElement.nodeName !== "INPUT") e.preventDefault(), back()

	// NAVIGATE
	if (e.key == "ArrowDown") nav(1)
	if (e.key == "ArrowUp") nav(-1)

	// SEARCH
	if (focusedElement === app.search.searchInput) {
		if (e.key.includes('Arrow')) return
		if (e.key == "Enter") return clearTimeout(searchTypeTimeout), search(app.search.searchInput.value, true)
		clearTimeout(searchTypeTimeout)
		searchTypeTimeout = setTimeout(() => { search(app.search.searchInput.value, false) }, 1500)
	}

	// Play PREVIEW
	if (e.key == "SoftRight") playPreview();

	// Search
	if (e.key == "SoftLeft") go('search')

})



// open page
function go(target) {
	preview.src = ""
	app.byArtistAndTitle.root.classList.add('hidden')
	app.search.root.classList.add('hidden')
	switch (target) {
		case 'byArtistAndTitle':
			app.byArtistAndTitle.root.classList.remove('hidden')
			app.byArtistAndTitle.result.parentNode.focus();
			currentScreen = "byArtistAndTitle"
			if (preview.src) preview.pause();
			break;
		case 'search':
			app.search.root.classList.remove('hidden')
			app.search.searchInput.focus();
			currentScreen = "search"
			break;

		default:
			app.search.root.classList.remove('hidden')
			app.search.searchInput.focus();
			currentScreen = "search"
			break;
	}
}

function back() {
	if (currentScreen == "byArtistAndTitle") go('search')

}

function nav(move) {
	const currentIndex = document.activeElement;
	const items = document.querySelectorAll('.focusable');
	let currentElemIdx = [...items].indexOf(currentIndex);
	if (move == -1 && currentElemIdx == -1) currentElemIdx = items.length
	const next = currentElemIdx + move;
	let targetElement = items[next];
	if (targetElement) targetElement.focus();
	else document.body.focus();
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
			// console.log(response)
			if (response.status.toString().startsWith('5')) {
				throw new Error('ERROR: Something is wrong with the server')
			}
			if (!response.ok) {
				throw new Error("ERROR: Network response was not ok.\n Lyrics probably not found.");
			}
			return response.json();
		})
		.then((data) => {
			console.log(`Lyrics result when fetching lyrics from  ${artist + "/" + title}: ` + data)
			return data.lyrics; // Return the lyrics data
		})
		.catch((error) => {
			console.warn(`Error when FETCHING LYRICS from ${artist + "/" + title}: ` + error);
			return error.toString()
		});
}

// Get lyrics function
function lyrics(artist, title, titleIsLyrics_Artist, titleIsLyrics_Title) {
	if (artist === "isStoredLyrics" && typeof title !== undefined) {
		// console.log(searchResults[title])
		displayLyrics(searchResults[title].lyrics, searchResults[title].artist.name, searchResults[title].title)
		return go('byArtistAndTitle')
	}
	if (artist === "titleIsLyrics" && typeof title !== undefined) {
		// console.log(title)
		displayLyrics(title, titleIsLyrics_Artist, titleIsLyrics_Title)
		go('byArtistAndTitle')
		return

	}
	fetchLyricsByArtistAndTitle(artist, title)
		.then((lyrics) => {
			let result = lyrics.replace(/^Paroles de la chanson .+$/m, '');
			// console.log(result);

			displayLyrics(result, artist, title)
			go('byArtistAndTitle')
		})
}

function displayLyrics(lyrics, artist, title) {
	app.byArtistAndTitle.result.innerText = lyrics
	app.byArtistAndTitle.artist.value = artist
	app.byArtistAndTitle.title.value = title
}

// == LYRICS by SEARCH ==
// = SEARCH =
let searchResults;;
let searchResultCopy;
function fetchSearchQuery(query) {
	return fetch(`https://api.lyrics.ovh/suggest/${query}`)
		.then((response) => {
			// console.log(response)
			if (response.status.toString().startsWith('5')) throw new Error('ERROR: Something is wrong with the server\nTry again later.')
			if (!response.ok) {
				throw new Error("ERROR: Network response was not ok.");
			}
			return response.json();
		})
		.then((data) => {
			console.log(`Search results to query ${query}: `)
			searchResults = data.data
			searchResultCopy = data.data
			console.log(data)
			return filterSearch(data.data)
		})
		.catch((error) => {
			console.warn(`Error when trying to FETCH SEARCH results to query ${query}: ` + error);
			return error
		});
}

function search(query, focusFirstResult) {
	if (query === "{clearsearch}") return app.search.result.innerHTML = ""
	if (query == "" || query == "") return
	app.search.result.innerHTML = "<h2 style='color:white; text-align: center;'>Searching...</h2>" // TODO
	fetchSearchQuery(query)
		.then((results) => {
			console.log(results)
			displaySearchResults(results, focusFirstResult);
		})
}

function displaySearchResults(results, focusFirstResult) {
	// app.search.filterToggle.innerText = showOnlySongsWithAvaibleLyrics === true ? "Only showing songs with avaible lyrics" : "Showing all results"
	app.search.result.innerHTML = ""
	console.log(typeof results)
	if (typeof results !== "object") {
		console.log('yes')
		app.search.result.innerHTML = `
		<div class="list-item-icon focusable" tabindex="0" onkeyup="if(event.key === 'Enter') { app.search.searchInput.focus(); };" onfocus="softkeys('', 'SEARCH','');" onblur="softkeys();">
    		<img src="/nothing_found.png" alt="" class="list-item-icon__icon" />
    		<div class="list-item-icon__text-container">
        		<p class="list-item__text">${results}</p>
        		<p class="list-item__subtext"></p>
    		</div>
		</div>`
		if (focusFirstResult) app.search.result.querySelector('.list-item-icon').focus();
		return
	}
	for (let i = 0; i < results.length; i++) {
		// GOHERE
		app.search.result.innerHTML += `
		<div class="list-item-icon focusable" tabindex="${i}" onfocus="if (this.dataset.lyrics) {this.dataset.lyrics === 'null' ? softkeys('Search', 'RETRY', 'Preview') : softkeys('Search', 'LYRICS', 'Preview');} else if (!this.dataset.lyrics || this.dataset.lyrics === 'null') {let focusTimeout;softkeys('Search', this.dataset.lyrics === 'null' ? 'RETRY' : '', 'Preview');focusTimeout = setTimeout(() => {let activeElement = document.activeElement;softkeys('Search', 'LOADING...', 'Preview');fetchLyricsByArtistAndTitle(this.dataset.artist, this.dataset.title).then((result) => {if (result.includes('ERROR')) return softkeys('Search', 'RETRY', 'Preview'), this.dataset.lyrics = 'null';if (activeElement === document.activeElement) { softkeys('Search', 'LYRICS', 'Preview'); } this.dataset.lyrics = result.replace(/^Paroles de la chanson .+$/m, '');this.onkeydown = (e) => {if (e.key == 'Enter' && this.dataset.lyrics) {if (this.dataset.lyrics !== 'null') app.byArtistAndTitle.result.parentNode.dataset.preview = this.dataset.preview,lyrics('titleIsLyrics', this.dataset.lyrics, this.dataset.artist, this.dataset.title);}};});}, 650);this.onblur = () => { clearTimeout(focusTimeout); }}"  data-artist="${results[i].artist.name}" data-title="${results[i].title}" data-cover="${results[i].album.cover_small}" data-preview="${results[i].preview}"  data-preview-Playing="false" data-current-preview="false">
    		<img src="${results[i].album.cover_small}" alt="" class="list-item-icon__icon" />
    		<div class="list-item-icon__text-container">
        		<p class="list-item__text">${results[i].title}</p>
        		<p class="list-item__subtext">${results[i].artist.name}</p>
    		</div>
		</div>
		`

		// let item = document.querySelectorAll('.list-item-icon')[i]
		// console.log(item)
		// item.onfocus = () => {
		// 	if (item.dataset.lyrics) {
		// 		item.dataset.lyrics === "null" ? softkeys('Search', '', 'Preview') : softkeys('Search', 'LYRICS', 'Preview');
		// 	} else {
		// 		let focusTimeout;
		// 		softkeys('Search', '', 'Preview');
		// 		focusTimeout = setTimeout(() => {
		// 			let activeElement = document.activeElement
		// 			softkeys('Search', 'LOADING...', 'Preview');
		// 			if (item.dataset.lyrics) { softkeys('Search', 'LYRICS', 'Preview') } else {
		// 				fetchLyricsByArtistAndTitle(item.dataset.artist, item.dataset.title).then((result) => {
		// 					if (result.includes('Something went wrong')) return softkeys('Search', '', 'Preview'), item.dataset.lyrics = "null"
		// 					if (activeElement == document.activeElement) {
		// 						softkeys('Search', 'LYRICS', 'Preview');
		// 					}
		// 					item.dataset.lyrics = result.replace(/^Paroles de la chanson .+$/m, '');

		// 					item.onkeydown = (e) => {
		// 						if (e.key == "Enter" && item.dataset.lyrics) {
		// 							if (item.dataset.lyrics !== "null") lyrics('titleIsLyrics', item.dataset.lyrics, item.dataset.artist, item.dataset.title)
		// 						}
		// 					}
		// 				})
		// 			}
		// 		}, 650)

		// 		item.onblur = () => {
		// 			clearTimeout(focusTimeout)
		// 		}
		// 	}
		// }
	}
	if (focusFirstResult) app.search.result.querySelector('.list-item-icon').focus();

}
let filteredSongList = [];

function filterSearch(songList, toggleByHTML) {
	if (songList.length === 0) {
		return "Nothing found"
	}
	return new Promise((resolve, reject) => {
		if (toggleByHTML && filteredSongList.length !== 0) {
			console.error('not filtering');
			if (!showOnlySongsWithAvaibleLyrics) {
				console.error('early return');
				resolve(searchResultCopy);
				return;
			}
			console.error('early return');
			resolve(filteredSongList);
			return;
		}

		filteredSongList = [];
		console.log('filter: ');
		console.log(showOnlySongsWithAvaibleLyrics);
		if (!showOnlySongsWithAvaibleLyrics) return resolve(searchResultCopy)
		let fetchPromises = [];
		for (let i = 0; i < songList.length; i++) {
			fetchPromises.push(
				fetchLyricsByArtistAndTitle(songList[i].artist.name, songList[i].title)
					.then((result) => {
						if (result.includes('Something went wrong.')) {
							console.log('NO LYRICS FOUND. Song needs to be ejected');
						} else {
							console.log('Lyrics found. Song can stay');
							searchResults[i].lyrics = result.replace(/^Paroles de la chanson .+$/m, '');
							filteredSongList.push(songList[i]);
						}
					})
					.catch((error) => {
						console.error('WTF HAPPENED; Error fetching lyrics:', error);
					})
			);
		}

		Promise.all(fetchPromises)
			.then(() => {
				console.debug(filteredSongList.length);
				if (!filteredSongList) {
					filteredSongList = "ERROR";
				}
				console.debug(filteredSongList);
				resolve(filteredSongList);
			})
			.catch((error) => {
				reject(error);
			});
	});
}


// PREVIEW
function playPreview() {
	const focusedElement = document.activeElement;
	if (focusedElement.id === "lyricsText") {
		if (!preview.src === searchResultCopy[focusedElement.dataset.index].preview) preview.src = searchResultCopy[focusedElement.dataset.index].preview
		preview.paused ? preview.play() : preview.pause()
	}
	if (focusedElement.dataset.previewPlaying || focusedElement === app.byArtistAndTitle.result.parentNode) { // check if song item
		// console.log('exist')
		if (preview.src && preview.src === app.byArtistAndTitle.result.parentNode.dataset.preview) { // ALREADY SOURCE
			// console.log('Src exist')
			if (focusedElement.dataset.currentPreview === "false") {
				console.warn('focused new song') // FOCUSED new song
				// console.log('playing == false')
				preview.pause(); console.log('pause old song') //pause old song
				preview.src = focusedElement.dataset.preview; console.log('set new source') // set new source
				preview.play(); console.log('play new song') // play new song
				let a = document.querySelector("[data-preview-playing='true']")
				let b = document.querySelector("[data-current-preview='true']")
				if (a) a.dataset.previewPlaying = "false", console.log('set old previewPlaying to false') // set old song properties to false
				if (b) b.dataset.currentPreview = "false", console.log('set old currentPreview to false')// set old song properties to false
				focusedElement.dataset.previewPlaying = "true"; console.log('set NEW previewPlaying')// set NEW song properties to TRUE
				focusedElement.dataset.currentPreview = "true"; console.log('set NEW currentPreview') // set NEW song properties to TRUE
				return // get out of here
			}
			// console.log('playing == true')
			// currentPreview === "true"; focused playing song: play/pause
			preview.paused === true ? (preview.play(), focusedElement.dataset.previewPlaying = "false") : (preview.pause(), focusedElement.dataset.previewPlaying = "true");
		} else {//no source given
			// console.log('no src')
			preview.src = focusedElement.dataset.preview//set source
			preview.play();//play song
			focusedElement.dataset.currentPreview = "true"// set propoerties
			focusedElement.dataset.previewPlaying = "true"
		}
	}
}
// GOHERE


// FOCUS
