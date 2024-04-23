// byArtistAndTitle screen
app.byArtistAndTitle.artist.onfocus = () => { softkeys('Search', 'LYRICS',) }
app.byArtistAndTitle.title.onfocus = () => { softkeys('Search', 'LYRICS',) }
app.byArtistAndTitle.fetchButton.onfocus = () => { softkeys('', 'LYRICS',) }
app.byArtistAndTitle.result.parentNode.onfocus = () => { softkeys('Search', '', preview.src === document.activeElement.dataset.preview ? ((preview.paused ? 'Play' : 'Pause')) : ('Preview')) }

// search screen
app.search.searchInput.onfocus = () => { softkeys('', 'Search', '') }