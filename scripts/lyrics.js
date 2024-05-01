// Fetch function
function fetchLyricsByArtistAndTitle(artist, title) {
	return fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
		.then((response) => {
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
		displayLyrics(searchResults[title].lyrics, searchResults[title].artist.name, searchResults[title].title)
		return go('byArtistAndTitle')
	}
	if (artist === "titleIsLyrics" && typeof title !== undefined) {
		displayLyrics(title, titleIsLyrics_Artist, titleIsLyrics_Title)
		go('byArtistAndTitle')
		return
	}

	if (!navigator.onLine) return displayLyrics("You're offline.", "", "");

	fetchLyricsByArtistAndTitle(artist, title)
		.then((lyrics) => {
			let result = lyrics.replace(/^Paroles de la chanson.+$/m, '');
			result = result.replace('\r\n', '')

			displayLyrics(result, artist, title)
			go('byArtistAndTitle')
		})
}

function displayLyrics(lyrics, artist, title) {
	app.byArtistAndTitle.result.innerText = lyrics
	app.byArtistAndTitle.artist.value = artist
	app.byArtistAndTitle.title.value = title
}

document.addEventListener('keydown', e => {
	if (e.key == "Enter" && currentScreen === "byArtistAndTitle" && document.activeElement.nodeName === "INPUT") lyrics(app.byArtistAndTitle.artist.value, app.byArtistAndTitle.title.value);
})