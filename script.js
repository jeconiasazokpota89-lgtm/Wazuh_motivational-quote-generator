// ==================== MESSAGES INTELLIGENTS PAR HUMEUR ====================
const messagesByMood = {
    motivation: [
        "La réussite n'est pas finale, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
        "Le seul moyen de faire du bon travail est d'aimer ce que vous faites.",
        "Chaque jour est une nouvelle opportunité de réussir.",
        "La persévérance est la clé du succès.",
        "Discipline-toi, car personne ne le fera pour toi.",
        "Le succès est la somme de petits efforts répétés jour après jour.",
        "Vous êtes capable de plus que vous ne l'imaginez.",
        "Ne regardez pas l'horloge ; faites ce qu'elle fait. Continuez."
    ],
    inspiration: [
        "Croyez en vous et tout sera possible.",
        "Le succès, c'est d'aller d'échec en échec sans perdre son enthousiasme.",
        "La chute n'est pas un échec. L'échec, c'est de rester là où on est tombé.",
        "Ne laissez pas les échecs d'hier vous empêcher de réussir aujourd'hui.",
        "Votre rêve est plus grand que vos peurs.",
        "Chaque moment est une chance de devenir la personne que vous rêvez d'être.",
        "L'inspiration existe, mais elle doit vous trouver en train de travailler.",
        "Soyez le changement que vous voulez voir dans le monde."
    ],
    confiance: [
        "Vous êtes plus fort que vous ne le pensez.",
        "Votre valeur n'a rien à voir avec vos performances.",
        "Vous méritez d'être heureux et réussi.",
        "Croyez en votre potentiel illimité.",
        "Vous êtes digne de toutes les bonnes choses.",
        "Votre confiance est votre plus grand pouvoir.",
        "Vous avez tout ce qu'il faut pour réussir.",
        "Vous êtes unique et irremplaçable."
    ]
};

// ==================== MODE SOMBRE/CLAIR ====================
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

// ==================== MESSAGES ALÉATOIRES SELON HUMEUR ====================
let messageElement = document.getElementById("message");
let changeButton = document.getElementById("changeMessage");
let currentMood = 'motivation';

function getRandomMessage(mood) {
    const messages = messagesByMood[mood] || messagesByMood['motivation'];
    return messages[Math.floor(Math.random() * messages.length)];
}

function displayRandomMessage() {
    const message = getRandomMessage(currentMood);
    messageElement.textContent = message;
    
    // Sauvegarder la citation dans l'historique
    saveCitationToHistory(message, currentMood);
}

// Fonction pour sauvegarder une citation dans l'historique
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

// Afficher un message au démarrage
displayRandomMessage();

changeButton.addEventListener("click", function() {
    displayRandomMessage();
});

// ==================== SAUVEGARDE DES UTILISATEURS (LOCALSTORAGE) ====================
function getAllUsers() {
    const users = localStorage.getItem('wazuhUsers');
    return users ? JSON.parse(users) : [];
}

function saveUser(user) {
    const users = getAllUsers();
    users.push(user);
    localStorage.setItem('wazuhUsers', JSON.stringify(users));
}

function displayUsers() {
    const users = getAllUsers();
    const usersList = document.getElementById('usersList');
    const usersCount = document.getElementById('usersCount');
    
    usersList.innerHTML = '';
    
    if (users.length === 0) {
        usersCount.textContent = '';
        return;
    }
    
    users.forEach((user, index) => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.textContent = `${index + 1}. ${user.prenom} ${user.name} (${user.email}) - Préférence: ${user.preference}`;
        usersList.appendChild(userItem);
    });
    
    usersCount.textContent = `✅ Total inscrit(s): ${users.length} utilisateur(s)`;
}

function userExists(email) {
    const users = getAllUsers();
    return users.some(user => user.email === email);
}

// Afficher les utilisateurs au chargement
displayUsers();

// ==================== FORMULAIRE D'INSCRIPTION ====================
const form = document.getElementById("form");
const result = document.getElementById("result");
const moodSelect = document.getElementById("préférencemessage");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const preference = moodSelect.value;

    // Validations
    if (!name || !prenom || !email || !password || !confirmPassword) {
        result.textContent = "❌ Tous les champs sont obligatoires.";
        result.style.color = "red";
        return;
    }

    if (!email.includes("@")) {
        result.textContent = "❌ Adresse email invalide.";
        result.style.color = "red";
        return;
    }

    if (password !== confirmPassword) {
        result.textContent = "❌ Les mots de passe ne correspondent pas.";
        result.style.color = "red";
        return;
    }

    if (userExists(email)) {
        result.textContent = "⚠️ Cet email est déjà inscrit!";
        result.style.color = "orange";
        return;
    }

    if (password.length < 6) {
        result.textContent = "❌ Le mot de passe doit contenir au moins 6 caractères.";
        result.style.color = "red";
        return;
    }

    // Sauvegarder l'utilisateur
    const newUser = {
        name: name,
        prenom: prenom,
        email: email,
        password: password,
        preference: preference,
        inscriptionDate: new Date().toLocaleDateString('fr-FR')
    };

    saveUser(newUser);
    currentMood = preference;

    result.textContent = `✅ Bienvenue ${prenom} ${name}! Vous avez été enregistré avec succès!`;
    result.style.color = "green";

    // Afficher la nouvelle liste d'utilisateurs
    displayUsers();
    
    // Afficher un message selon l'humeur choisie
    displayRandomMessage();
    
    // Réinitialiser le formulaire
    form.reset();
    moodSelect.value = 'motivation';
});

// Mettre à jour l'humeur quand le sélect change
moodSelect.addEventListener('change', function() {
    currentMood = this.value;
    displayRandomMessage();
});

// Initialiser le thème au chargement
initTheme();
