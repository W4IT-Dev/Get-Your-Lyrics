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
	offline: {
		root: document.querySelector('#offline'),
		settingsButton: document.querySelector('#offline button')
	},
	softkeys: {
		root: document.querySelector('.softkeys'),
		left: document.querySelector('.softkey-left'),
		center: document.querySelector('.softkey-center'),
		right: document.querySelector('.softkey-right')
	}
}

if (!navigator.onLine) {
	go('offline')
}

window.onoffline = (event) => {
	console.log(event)
	showToast("You're offline<br>Press 0 to open settings.", 2000, '323232')
};

window.ononline = (e) => {
	console.log(e)
	showToast("You're back online", 2000, '323232')
}

document.addEventListener('keydown', e => {
	if (e.key == "#") window.open('/about.html')
	if (e.key == "0" && !navigator.onLine) {
		let request = new MozActivity({
			name: 'configure',
			data: {
				target: 'device',
				section: 'wifi'
			},
		});
	}
})

// KEYDOWN
let searchTypeTimeout, currentScreen, HUDvisible = false, preview = new Audio();
if (preview.mozAudioChannelManager) preview.mozAudioChannelManager.volumeControlChannel = 'content'
let searchTimeout;
app.search.searchInput.onkeydown = (e) => {
	if (e.key == 'Enter') clearTimeout(searchTimeout), search(app.search.searchInput.value, true);
}

app.search.searchInput.oninput = () => {
	if (app.search.searchInput.value.length === 0) {
		clearTimeout(searchTimeout);
		app.search.result.innerHTML = '<h2 style=\'text-align: center; color: white;\'>Search artist or title</h2>'
	} else {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => { search(app.search.searchInput.value) }, 1400)
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
	if (e.key == "Backspace" && document.activeElement.nodeName !== "INPUT") e.preventDefault(), back()

	// NAVIGATE
	if (e.key == "ArrowDown") nav(1);
	if (e.key == "ArrowUp") nav(-1);

	// Play PREVIEW
	if (e.key == "SoftRight" || e.key == "F4") playPreview();

	// Search
	if (e.key == "SoftLeft" || e.key == "F2") go('search')

})



// open page
function go(target) {
	preview.src = ""
	app.byArtistAndTitle.root.classList.add('hidden')
	app.search.root.classList.add('hidden')
	app.offline.root.classList.add('hidden')
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
		case 'offline':
			app.offline.root.classList.remove('hidden')
			app.offline.settingsButton.focus();
			currentScreen = "offline"
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
}

// set softkeys
function softkeys(left, center, right) {
	if (left === "{hideSoftkeys}") app.softkeys.root.classList.add('hidden')
	else app.softkeys.root.classList.remove('hidden')
	if (center) center = center.toUpperCase();
	if (left !== "{old}") app.softkeys.left.innerHTML = left || ''
	if (center !== "{old}") app.softkeys.center.innerHTML = center || ''
	if (right !== "{old}") app.softkeys.right.innerHTML = right || ''
}

document.addEventListener('visibilitychange', () => {
	if (document.visibilityState === "visible") go(currentScreen)
})

// PREVIEW
function playPreview() {
	const focusedElement = document.activeElement;
	if (focusedElement === app.byArtistAndTitle.result.parentNode) {
		if (preview.src !== searchResultCopy[focusedElement.dataset.index].preview) preview.src = searchResultCopy[focusedElement.dataset.index].preview, softkeys('{old}', '{old}', 'Loading...');

		preview.oncanplaythrough = () => {
			softkeys('{old}', '{old}', '{old}')
			preview.play();
		}
		preview.paused ? (preview.play(), softkeys('{old}', '{old}', 'Pause')) : (preview.pause(), softkeys('{old}', '{old}', 'Play'))
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
			// if(preview.paused === true) {
			// 	preview.play();
			// 	focusedElement.dataset.previewPlaying = "false";
			// }
			preview.paused === true ? (preview.play(), focusedElement.dataset.previewPlaying = "false", softkeys('{old}', '{old}', 'Pause')) : (preview.pause(), focusedElement.dataset.previewPlaying = "true", softkeys('{old}', '{old}', 'Play'));
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