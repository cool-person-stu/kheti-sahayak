const USERS_KEY = "kh_users_v1"
const CURRENT_USER_KEY = "kh_current_user"

function getAllUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  } catch {
    return []
  }
}

function saveAllUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function signUp({ name, village, crop, landSize, landUnit, phone, password }) {
  const users = getAllUsers()
  if (users.find((u) => u.name.toLowerCase() === name.toLowerCase() && u.village.toLowerCase() === village.toLowerCase())) {
    return { error: "A farmer with this name already exists in this village" }
  }
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    village: village.trim(),
    crop: crop.trim(),
    landSize: parseFloat(landSize) || 0,
    landUnit: landUnit || "acre",
    phone: phone.trim(),
    password,
    location: null,
    addedAt: new Date().toISOString(),
  }
  users.push(user)
  saveAllUsers(users)
  localStorage.setItem(CURRENT_USER_KEY, user.id)
  return { user }
}

export function logIn({ name, village, password }) {
  const users = getAllUsers()
  const user = users.find(
    (u) => u.name.toLowerCase() === name.toLowerCase() && u.village.toLowerCase() === village.toLowerCase()
  )
  if (!user) return { error: "No farmer found with this name in this village" }
  if (user.password !== password) return { error: "Incorrect password" }
  localStorage.setItem(CURRENT_USER_KEY, user.id)
  return { user }
}

export function logOut() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getCurrentUser() {
  const id = localStorage.getItem(CURRENT_USER_KEY)
  if (!id) return null
  const users = getAllUsers()
  return users.find((u) => u.id === id) || null
}

export function updateCurrentUser(updates) {
  const id = localStorage.getItem(CURRENT_USER_KEY)
  if (!id) return null
  const users = getAllUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return null
  users[idx] = { ...users[idx], ...updates }
  saveAllUsers(users)
  return users[idx]
}

export function getUserById(id) {
  const users = getAllUsers()
  return users.find((u) => u.id === id) || null
}
