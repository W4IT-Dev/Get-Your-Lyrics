// byArtistAndTitle screen
app.byArtistAndTitle.artist.onfocus = () => { softkeys(translate('search'), translate('lyrics'),) }
app.byArtistAndTitle.title.onfocus = () => { softkeys(translate('search'), translate('lyrics'),) }
app.byArtistAndTitle.fetchButton.onfocus = () => { softkeys('', translate('lyrics'),) }
app.byArtistAndTitle.result.parentNode.onfocus = () => { softkeys(translate('search'), translate('save'), preview.src === document.activeElement.dataset.preview ? ((preview.paused ? translate('play') : translate('pause'))) : (translate('preview'))) }

// search screen
app.search.searchInput.onfocus = () => { softkeys('', translate('search_verb')) }

