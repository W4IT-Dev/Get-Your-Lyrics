const app = {
	byArtistAndTitle: {
		root: document.querySelector('#artistAndTitle'),
		artist: document.querySelector('#artist'),
		title: document.querySelector('#title'),
		fetchButton: document.querySelector('#fetchLyrics'),
		result: document.querySelector('#lyricsText')
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



// KEYDOWN
let searchTypeTimeout, currentScreen, HUDvisible = false, preview = new Audio();
if (preview.mozAudioChannelManager) preview.mozAudioChannelManager.volumeControlChannel = 'content'
let searchTimeout;
app.search.searchInput.onkeydown = (e) => {
	if (e.key == 'Enter') clearTimeout(searchTimeout), search(app.search.searchInput.value);
}

app.search.searchInput.oninput = () => {
	if (app.search.searchInput.value.length === 0) {
		clearTimeout(searchTimeout);
		app.search.result.innerHTML = '<h2 style=\'text-align: center; color: white;\'>Search artist or title</h2>'
	} else {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => { search(app.search.searchInput.value) }, 1650)
	}
}

document.addEventListener('keyup', e => {
	const focusedElement = document.activeElement;
	// Go BACK

	if (focusedElement.dataset.preview && navigator.volumeManager) {
		if (e.key == "1") HUDvisible = true, navigator.volumeManager.requestDown(), setTimeout(() => { HUDvisible = false }, 2001);
		if (e.key == "3") HUDvisible = true, navigator.volumeManager.requestUp(), setTimeout(() => { HUDvisible = false }, 2001);
	}
	if (HUDvisible) return
	if (e.key == "Backspace" && document.activeElement.nodeName !== "INPUT" && currentScreen === "byArtistAndTitle") e.preventDefault(), back()

	// NAVIGATE
	if (e.key == "ArrowDown") nav(1);
	if (e.key == "ArrowUp") nav(-1);

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
	let currentElemIdx = [...items].indexOf(currentIndex)

	// if (move == -1 && currentElemIdx == -1) currentElemIdx = items.length
	const next = currentElemIdx + move;
	let targetElement = items[next];
	if (targetElement) targetElement.focus();
	else document.body.focus();
}

// set softkeys
function softkeys(left, center, right) {
	if (left === "{hideSoftkeys}") app.softkeys.root.classList.add('hidden')
	else app.softkeys.root.classList.remove('hidden')
	if (left !== "{old}") app.softkeys.left.innerHTML = left || ''
	if (center !== "{old}") app.softkeys.center.innerHTML = center.toUpperCase() || ''
	if (right !== "{old}") app.softkeys.right.innerHTML = right || ''
}

document.addEventListener('visibilitychange', () => {
	if (document.visibilityState === "visible") go(currentScreen)
})


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
	if (typeof results !== "object") {
		app.search.result.innerHTML = `
		<div class="list-item-icon focusable" tabindex="0" onkeyup="if(event.key === 'Enter') { app.search.searchInput.focus(); };" onfocus="softkeys('', '${translate('search')}','');" onblur="softkeys();">
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
		<div class="list-item-icon focusable" tabindex="${i}"
    onfocus="if (this.dataset.lyrics) {this.dataset.lyrics === 'null' ? softkeys('${translate('search')}', '${translate('retry')}', '${translate('preview')}') : softkeys('${translate('search')}', '${translate('lyrics')}', '${translate('preview')}');} else if (!this.dataset.lyrics || this.dataset.lyrics === 'null') {let focusTimeout;softkeys('${translate('search')}', this.dataset.lyrics === 'null' ? '${translate('retry')}' : '', '${translate('preview')}');focusTimeout = setTimeout(() => {let activeElement = document.activeElement;softkeys('${translate('search')}', '${translate('search')}', '${translate('search')}');fetchLyricsByArtistAndTitle(this.dataset.artist, this.dataset.title).then((result) => {if (result.includes('ERROR')) return softkeys('${translate('search')}', '${translate('retry')}', '${translate('preview')}'), this.dataset.lyrics = 'null';if (activeElement === document.activeElement) { softkeys('${translate('search')}', '${translate('lyrics')}', '${translate('preview')}'); } this.dataset.lyrics = result.replace(/^Paroles de la chanson .+$/m, '');this.onkeydown = (e) => {if (e.key == 'Enter' && this.dataset.lyrics) {if (this.dataset.lyrics !== 'null') app.byArtistAndTitle.result.parentNode.dataset.index = this.tabIndex, app.byArtistAndTitle.result.parentNode.dataset.preview = this.dataset.preview,lyrics('titleIsLyrics', this.dataset.lyrics, this.dataset.artist, this.dataset.title);}};});}, 650);this.onblur = () => { clearTimeout(focusTimeout); }}"
    data-artist="${results[i].artist.name}" data-title="${results[i].title}"
    data-cover="${results[i].album.cover_small}" data-preview="${results[i].preview}" data-preview-Playing="false"
    data-current-preview="false">
    <img src="${results[i].album.cover_small}" alt="" class="list-item-icon__icon" />
    <div class="list-item-icon__text-container">
        <p class="list-item__text">${results[i].title}</p>
        <p class="list-item__subtext">${results[i].artist.name}</p>
    </div>
</div>
		`


	}
	if (focusFirstResult) app.search.result.querySelector('.list-item-icon').focus();

}
let filteredSongList = [];
let showOnlySongsWithAvaibleLyrics = false;

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
	if (focusedElement === app.byArtistAndTitle.result.parentNode) {
		if (preview.src !== searchResultCopy[focusedElement.dataset.index].preview) preview.src = searchResultCopy[focusedElement.dataset.index].preview, softkeys('{old}', '{old}', 'Loading...');

		preview.oncanplaythrough = () => {
			softkeys('{old}', '{old}', 'Preview')
			preview.src.paused ? (preview.play(), softkeys('{old}', '{old}', 'Pause')) : (preview.pause(), softkeys('{old}', '{old}', 'Play'))
		}
		return
	}
	if (focusedElement.dataset.previewPlaying) { // check if song item
		if (preview.src) { // ALREADY SOURCE
			if (focusedElement.dataset.currentPreview === "false") {
				console.warn('focused new song') // FOCUSED new song
				preview.pause(); console.log('pause old song') //pause old song


				preview.src = focusedElement.dataset.preview, softkeys('{old}', '{old}', 'Loading...'); console.log('set new source') // set new source
				preview.oncanplaythrough = () => {
					softkeys('{old}', '{old}', 'Play')
					preview.play(), softkeys('{old}', '{old}', 'Pause'); console.log('play new song') // play new song
					let a = document.querySelector("[data-preview-playing='true']")
					let b = document.querySelector("[data-current-preview='true']")
					if (a) a.dataset.previewPlaying = "false", console.log('set old previewPlaying to false') // set old song properties to false
					if (b) b.dataset.currentPreview = "false", console.log('set old currentPreview to false')// set old song properties to false
					focusedElement.dataset.previewPlaying = "true"; console.log('set NEW previewPlaying')// set NEW song properties to TRUE
					focusedElement.dataset.currentPreview = "true"; console.log('set NEW currentPreview') // set NEW song properties to TRUE
					return // get out of here
				}
			}
			// currentPreview === "true"; focused playing song: play/pause
			preview.paused === true ? (preview.play(), focusedElement.dataset.previewPlaying = "false", softkeys('Search', 'SAVE', 'Pause')) : (preview.pause(), focusedElement.dataset.previewPlaying = "true", softkeys('Search', 'SAVE', 'Play'));
		} else {//no source given
			preview.src = focusedElement.dataset.preview, softkeys('{old}', '{old}', 'Loading...')//set source
			preview.oncanplaythrough = () => {
				softkeys('{old}', '{old}', 'Play')
				preview.play(), softkeys('{old}', '{old}', 'Pause');//play song
				focusedElement.dataset.currentPreview = "true"// set propoerties
				focusedElement.dataset.previewPlaying = "true"
			}
		}
	}
}