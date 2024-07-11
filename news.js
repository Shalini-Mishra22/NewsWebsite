
const API_KEY = "24d9712610a74b77a2eebf34591a7334";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    console.log(`Fetching news for query: ${query}`);
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('Fetched data:', data);
        bindData(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;

function onNavItemClick(id) {
    console.log(`Nav item clicked: ${id}`);
    fetchNews(id);
    const navItem = document.getElementById(id);
    if (curSelectedNav) {
        curSelectedNav.classList.remove('active');
    }
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('search-button');
    const searchText = document.getElementById('search-text');

    searchButton.addEventListener('click', () => {
        const query = searchText.value;
        if (!query) return;
        console.log(`Search query: ${query}`);
        fetchNews(query);
        if (curSelectedNav) {
            curSelectedNav.classList.remove('active');
            curSelectedNav = null;
        }
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (event) => {
            const id = event.target.id;
            onNavItemClick(id);
        });
    });
});
document.getElementById('toggle-note').addEventListener('click', function() {
    const noteContainer = document.getElementById('note-container');
    if (noteContainer.classList.contains('hidden')) {
        noteContainer.classList.remove('hidden');
    } else {
        noteContainer.classList.add('hidden');
    }
});

function addNote() {
    const noteInput = document.getElementById('note-input');
    const notesContainer = document.getElementById('notes');

    if (noteInput.value.trim() !== "") {
        const newNote = document.createElement('div');
        newNote.classList.add('note');
        
        const noteText = document.createElement('span');
        noteText.textContent = noteInput.value;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function() {
            notesContainer.removeChild(newNote);
        };

        newNote.appendChild(noteText);
        newNote.appendChild(deleteButton);
        notesContainer.appendChild(newNote);

        // Clear the input field after adding the note
        noteInput.value = "";
    }
}
/*function changeLanguage() {
    const selectedLanguage = document.getElementById('language-select').value;
    const cardsContainer = document.getElementById('cards-container');

    // Translate existing news content
    const newsCards = cardsContainer.querySelectorAll('.card');
    newsCards.forEach(card => {
        const title = card.querySelector('#news-title').textContent;
        const desc = card.querySelector('#news-desc').textContent;
        
        // Translate the title and description using Google Translate API or another service
        translateText(title, selectedLanguage, translatedTitle => {
            card.querySelector('#news-title').textContent = translatedTitle;
        });
        translateText(desc, selectedLanguage, translatedDesc => {
            card.querySelector('#news-desc').textContent = translatedDesc;
        });
    });
}

function translateText(text, targetLang, callback) {
    // Use Google Translate API or any other translation service
    const apiKey = 'YOUR_GOOGLE_TRANSLATE_API_KEY';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: text,
            target: targetLang,
        }),
    })
    .then(response => response.json())
    .then(data => {
        const translatedText = data.data.translations[0].translatedText;
        callback(translatedText);
    })
    .catch(error => {
        console.error('Error translating text:', error);
    });
}
*/
