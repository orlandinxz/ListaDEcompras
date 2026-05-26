const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const listItems = document.getElementById('listItems');
const emptyState = document.getElementById('emptyState');
const clearBtn = document.getElementById('clearBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const filterBtns = document.querySelectorAll('.filter-btn');
const toast = document.getElementById('toast');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalConfirm = document.getElementById('modalConfirm');
const modalCancel = document.getElementById('modalCancel');
const particleContainer = document.getElementById('particleContainer');

const STORAGE_KEY = 'galaxyYellowShoppingList';
let items = [];
let currentFilter = 'todos';
let pendingAction = null;
let toastTimer = null;

function init() {
    loadItems();
    renderList();
    setupEvents();
}

function setupEvents() {
    addBtn.addEventListener('click', addItem);
    itemInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addItem();
        }
    });

    clearBtn.addEventListener('click', () => {
        showConfirm('Limpar Concluídos', 'Remover todos os itens concluídos?', clearCompleted);
    });

    deleteAllBtn.addEventListener('click', () => {
        showConfirm('Limpar Tudo', 'Remover todos os itens da lista?', deleteAll);
    });

    filterBtns.forEach((button) => {
        button.addEventListener('click', () => {
            filterBtns.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderList();
        });
    });

    listItems.addEventListener('change', (event) => {
        if (event.target.classList.contains('checkbox')) {
            const id = Number(event.target.dataset.id);
            toggleItem(id);
        }
    });

    listItems.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-item-delete')) {
            const id = Number(event.target.dataset.id);
            deleteItem(id);
        }
    });

    modalCancel.addEventListener('click', closeModal);
    modalConfirm.addEventListener('click', confirmAction);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
}

function addItem() {
    const text = itemInput.value.trim();
    if (!text) {
        showToast('Digite um item para iniciar a missão!');
        return;
    }

    if (text.length > 120) {
        showToast('Use até 120 caracteres.');
        return;
    }

    items.unshift({
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toLocaleString('pt-BR')
    });

    saveItems();
    renderList();
    showToast('Item adicionado com sucesso!');
    createParticles(addBtn);
    itemInput.value = '';
    itemInput.focus();
}

function toggleItem(id) {
    items = items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
    );
    saveItems();
    renderList();
    if (items.find((item) => item.id === id).completed) {
        showToast('Item marcado como concluído!');
        createParticles(document.querySelector(`input[data-id="${id}"]`));
    }
}

function deleteItem(id) {
    showConfirm('Remover Item', 'Deseja excluir este item?', () => {
        items = items.filter((item) => item.id !== id);
        saveItems();
        renderList();
        showToast('Item removido.');
    });
}

function clearCompleted() {
    const completedCount = items.filter((item) => item.completed).length;
    if (completedCount === 0) {
        showToast('Nenhum item concluído para limpar.');
        return;
    }
    items = items.filter((item) => !item.completed);
    saveItems();
    renderList();
    showToast('Itens concluídos limpos!');
}

function deleteAll() {
    if (items.length === 0) {
        showToast('A lista já está vazia.');
        return;
    }
    items = [];
    saveItems();
    renderList();
    showToast('Tudo removido!');
}

function renderList() {
    listItems.innerHTML = '';
    const filtered = items.filter((item) => {
        if (currentFilter === 'pendentes') return !item.completed;
        if (currentFilter === 'concluidos') return item.completed;
        return true;
    });

    if (filtered.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
        filtered.forEach((item) => listItems.appendChild(createListItem(item)));
    }

    updateStats();
    updateButtons();
}

function createListItem(item) {
    const li = document.createElement('li');
    li.className = `list-item ${item.completed ? 'completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.dataset.id = item.id;
    checkbox.checked = item.completed;

    const text = document.createElement('span');
    text.className = 'item-text';
    text.innerHTML = escapeHtml(item.text);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-item-delete';
    deleteBtn.dataset.id = item.id;
    deleteBtn.textContent = 'Excluir';

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);

    return li;
}

function updateStats() {
    const total = items.length;
    const completed = items.filter((item) => item.completed).length;
    animateValue(totalCount, Number(totalCount.textContent), total);
    animateValue(completedCount, Number(completedCount.textContent), completed);
}

function animateValue(element, from, to) {
    if (from === to) {
        element.textContent = to;
        return;
    }
    const duration = 200;
    const steps = 10;
    const increment = (to - from) / steps;
    let current = from;
    let step = 0;

    const interval = setInterval(() => {
        step += 1;
        current += increment;
        element.textContent = Math.round(current);
        if (step >= steps) {
            clearInterval(interval);
            element.textContent = to;
        }
    }, duration / steps);
}

function updateButtons() {
    clearBtn.disabled = !items.some((item) => item.completed);
    deleteAllBtn.disabled = items.length === 0;
}

function showConfirm(title, message, action) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    pendingAction = action;
    modalOverlay.classList.add('active');
}

function confirmAction() {
    if (pendingAction) {
        pendingAction();
    }
    closeModal();
}

function closeModal() {
    pendingAction = null;
    modalOverlay.classList.remove('active');
}

function showToast(message, duration = 2600) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function createParticles(origin) {
    const rect = origin.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const emojis = ['✨', '🌟', '💫', '☄️'];

    for (let i = 0; i < 10; i += 1) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;

        const angle = Math.random() * Math.PI * 2;
        const radius = 60 + Math.random() * 40;
        particle.style.setProperty('--tx', `${Math.cos(angle) * radius}px`);
        particle.style.setProperty('--ty', `${Math.sin(angle) * radius}px`);

        particleContainer.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove());
    }
}

function saveItems() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadItems() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
        items = JSON.parse(saved);
    } catch (error) {
        console.error('Falha ao carregar itens:', error);
        items = [];
    }
}

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}

window.addEventListener('DOMContentLoaded', init);
