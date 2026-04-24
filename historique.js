// ==================== GESTION DU THÈME ====================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const button = document.getElementById('toggleTheme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        button.textContent = '☀️ Clair';
    } else {
        document.body.classList.remove('dark-mode');
        button.textContent = '🌙 Sombre';
    }
    
    button.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isLightMode = !document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        button.textContent = isLightMode ? '🌙 Sombre' : '☀️ Clair';
    });
}

// ==================== GESTION DES CITATIONS ====================
function saveCitationToHistory(citation, mood) {
    let history = localStorage.getItem('citationsHistory');
    let citations = history ? JSON.parse(history) : [];
    
    citations.push({
        text: citation,
        mood: mood,
        date: new Date().toLocaleString('fr-FR')
    });
    
    localStorage.setItem('citationsHistory', JSON.stringify(citations));
}

function getCitationsHistory() {
    let history = localStorage.getItem('citationsHistory');
    return history ? JSON.parse(history) : [];
}

function displayCitations(filterMood = 'all') {
    const citations = getCitationsHistory();
    const citationsList = document.getElementById('citationsList');
    const emptyMessage = document.getElementById('emptyMessage');
    
    citationsList.innerHTML = '';
    
    let filteredCitations = citations;
    if (filterMood !== 'all') {
        filteredCitations = citations.filter(c => c.mood === filterMood);
    }
    
    if (filteredCitations.length === 0) {
        emptyMessage.style.display = 'block';
        return;
    }
    
    emptyMessage.style.display = 'none';
    
    // Afficher en ordre inverse (plus récent d'abord)
    filteredCitations.reverse().forEach(citation => {
        const card = document.createElement('div');
        card.className = 'citation-card';
        
        const moodEmoji = {
            'motivation': '🎯 Motivation',
            'inspiration': '✨ Inspiration',
            'confiance': '💪 Confiance'
        };
        
        card.innerHTML = `
            <p class="citation-text">"${citation.text}"</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="citation-mood">${moodEmoji[citation.mood] || citation.mood}</span>
                <small style="color: #999;">${citation.date}</small>
            </div>
        `;
        
        citationsList.appendChild(card);
    });
}

// ==================== GESTION DES FILTRES ====================
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        displayCitations(this.dataset.mood);
    });
});

// ==================== EFFACER L'HISTORIQUE ====================
document.getElementById('clearBtn').addEventListener('click', function() {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique des citations?')) {
        localStorage.removeItem('citationsHistory');
        displayCitations();
    }
});

// ==================== INITIALISATION ====================
initTheme();
displayCitations();
