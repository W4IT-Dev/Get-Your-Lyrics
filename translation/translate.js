const supportedLanguages = ["de", "en", "es", "fr", "ru"];
let translations = {};
const userLanguage = navigator.language || navigator.userLanguage;
let languageCode = userLanguage.split("-")[0];

const loadLanguageFile = a => new Promise((e, t) => {
        let s = new XMLHttpRequest;
        s.open("GET", `/translation/${a}.json`, !0), s.onreadystatechange = () => {
            if (4 === s.readyState) {
                if (200 === s.status) try {
                    translations = JSON.parse(s.responseText);
                } catch (l) {
                    t(`Error parsing language file: ${l}`)
                } else t(`Error loading language file: ${s.statusText}`)
            }
        }, s.send()
    }),
    translate = a => translations[a] || a,
    updateUIWithTranslations = () => {
        Array.from(document.querySelectorAll("[data-translate]")).forEach(a => {
            let e = a.getAttribute("data-translate");
        })
    },
    isLanguageSupported = a => supportedLanguages.includes(a),
    loadAndTranslate = a => {
        isLanguageSupported(a) ? loadLanguageFile(a).then(updateUIWithTranslations).catch(a => console.error(a)) : console.error(`Unsupported language: ${a}`)
    };
loadAndTranslate(languageCode);