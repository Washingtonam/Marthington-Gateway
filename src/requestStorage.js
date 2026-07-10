const STORAGE_KEY = 'ninRequests';

function loadRequests() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to parse request storage', error);
    return [];
  }
}

function saveRequests(requests) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function getRequests() {
  return loadRequests();
}

export function getRequestById(id) {
  return loadRequests().find((item) => item.id === id) || null;
}

export function addRequest(request) {
  const requests = loadRequests();
  requests.push(request);
  saveRequests(requests);
}

export function updateRequest(id, updates) {
  const requests = loadRequests().map((item) => {
    if (item.id !== id) return item;
    return { ...item, ...updates };
  });
  saveRequests(requests);
}
