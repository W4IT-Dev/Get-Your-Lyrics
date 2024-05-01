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
    const isWhitespaceString = str => !str.replace(/\s/g, '').length
    if (isWhitespaceString(query)) return console.log('only whitespace')
    if (query == "" || query == "") return
    app.search.result.innerHTML = "<h2 style='color:white; text-align: center;'>Searching...</h2>"
    if (!navigator.onLine) return displaySearchResults("You're offline.", focusFirstResult);

    fetchSearchQuery(query)
        .then((results) => {
            console.log(results)
            displaySearchResults(results, focusFirstResult);
        })
}

function displaySearchResults(results, focusFirstResult) {
    app.search.result.innerHTML = ""
    if (typeof results !== "object") {
        app.search.result.innerHTML = `
		<div class="list-item-icon focusable" tabindex="0" onkeyup="if(event.key === 'Enter') { app.search.searchInput.focus(); };" onfocus="softkeys('', 'Search','');" onblur="softkeys();">
    		<img src="/assets/images/nothing_found.png" alt="" class="list-item-icon__icon" />
    		<div class="list-item-icon__text-container">
        		<p class="list-item__text">${results}</p>
        		<p class="list-item__subtext"></p>
    		</div>
		</div>`
        if (focusFirstResult) app.search.result.querySelector('.list-item-icon').focus();
        return
    }
    for (let i = 0; i < results.length; i++) {
        var connection = navigator.connection;
        var type = connection.type;
        var isCellular = false;
        if (type != null && type.localeCompare("wifi") != 0) {
            isCellular = true;
        }
            if (isCellular) {
                app.search.result.innerHTML += `
<div class="list-item focusable" tabindex="${i}" onfocus="if (this.dataset.lyrics) {
			this.dataset.lyrics === 'null' ? softkeys('Search', '', 'Preview') : softkeys('Search', 'LYRICS', 'Preview');
			} else if (!this.dataset.lyrics || this.dataset.lyrics === 'null') {
				let focusTimeout;
				softkeys('Search', this.dataset.lyrics === 'null' ? '' : '', 'Preview');
				focusTimeout = setTimeout(() => {
					let activeElement = document.activeElement;softkeys('Search', 'LOADING', 'Preview');
				fetchLyricsByArtistAndTitle(this.dataset.artist, this.dataset.title)
				.then((result) => {
					
					if (activeElement === document.activeElement) { softkeys('Search', 'LYRICS', 'Preview');
                    if (result.includes('ERROR')) return showToast('No lyrics found', 1750,'ee1102'), softkeys('Search', '', 'Preview'), this.dataset.lyrics = 'null';
					 } 
					 this.dataset.lyrics = result.replace(/^Paroles de la chanson .+$/m, '')
					 this.onkeydown = (e) => {
						if (e.key == 'Enter' && this.dataset.lyrics) {
						if (this.dataset.lyrics !== 'null') app.byArtistAndTitle.result.parentNode.dataset.index = this.tabIndex, app.byArtistAndTitle.result.parentNode.dataset.preview = this.dataset.preview,lyrics('titleIsLyrics', this.dataset.lyrics, this.dataset.artist, this.dataset.title);
						}};
						});
						}, 650);
						this.onblur = () => { clearTimeout(focusTimeout); }}" data-artist="${results[i].artist.name}"
            data-title="${results[i].title}" data-cover="${results[i].album.cover_small}"
            data-preview="${results[i].preview}" data-preview-Playing="false" data-current-preview="false">
            <p class="list-item__text">${results[i].title}</p>
  <p class="list-item__subtext">${results[i].artist.name}</p>
</div>
`
            } else {
                app.search.result.innerHTML += `
		<div class="list-item-icon focusable" tabindex="${i}" onfocus="if (this.dataset.lyrics) {
			this.dataset.lyrics === 'null' ? softkeys('Search', '', 'Preview') : softkeys('Search', 'LYRICS', 'Preview');
			} else if (!this.dataset.lyrics || this.dataset.lyrics === 'null') {
				let focusTimeout;
				softkeys('Search', this.dataset.lyrics === 'null' ? '' : '', 'Preview');
				focusTimeout = setTimeout(() => {
					let activeElement = document.activeElement;softkeys('Search', 'LOADING', 'Search');
				fetchLyricsByArtistAndTitle(this.dataset.artist, this.dataset.title)
				.then((result) => {
					
					if (activeElement === document.activeElement) { softkeys('Search', 'LYRICS', 'Preview');
                    if (result.includes('ERROR')) return showToast('No lyrics found', 1750,'ee1102'), softkeys('Search', '', 'Preview'), this.dataset.lyrics = 'null';
					 } 
					 this.dataset.lyrics = result.replace(/^Paroles de la chanson .+$/m, '');
					 this.onkeydown = (e) => {
						if (e.key == 'Enter' && this.dataset.lyrics) {
						if (this.dataset.lyrics !== 'null') app.byArtistAndTitle.result.parentNode.dataset.index = this.tabIndex, app.byArtistAndTitle.result.parentNode.dataset.preview = this.dataset.preview,lyrics('titleIsLyrics', this.dataset.lyrics, this.dataset.artist, this.dataset.title);
						}};
						});
						}, 650);
						this.onblur = () => { clearTimeout(focusTimeout); }}" data-artist="${results[i].artist.name}"
            data-title="${results[i].title}" data-cover="${results[i].album.cover_small}"
            data-preview="${results[i].preview}" data-preview-Playing="false" data-current-preview="false">
            <img src="${results[i].album.cover_small}" alt="" class="list-item-icon__icon" />
            <div class="list-item-icon__text-container">
                <p class="list-item__text">${results[i].title}</p>
                <p class="list-item__subtext">${results[i].artist.name}</p>
            </div>
        </div>
		`
            }

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