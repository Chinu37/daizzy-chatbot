const BASE_URL = "http://localhost:8001";

// ─── AUTH ───────────────────────────────────────────
export const registerUser = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
}) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ─── PRODUCTS ───────────────────────────────────────
export const getAllProducts = async () => {
  const res = await fetch(`${BASE_URL}/products/`);
  return res.json();
};

export const filterProducts = async (params: {
  category?: string;
  occasion?: string;
  style?: string;
  gender?: string;
  min_price?: number;
  max_price?: number;
  tag?: string;
}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
  ).toString();
  const res = await fetch(`${BASE_URL}/products/filter?${query}`);
  return res.json();
};

// ─── CART ────────────────────────────────────────────
export const getCart = async (user_id: string) => {
  const res = await fetch(`${BASE_URL}/cart/${user_id}`);
  return res.json();
};

export const addToCart = async (data: {
  user_id: string;
  product_id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}) => {
  const res = await fetch(`${BASE_URL}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const removeFromCart = async (user_id: string, product_id: string) => {
  const res = await fetch(`${BASE_URL}/cart/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, product_id }),
  });
  return res.json();
};

// ─── ORDERS ──────────────────────────────────────────
export const placeOrder = async (data: {
  user_id: string;
  items: any[];
  address: string;
  payment_method: string;
}) => {
  const res = await fetch(`${BASE_URL}/orders/place`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getUserOrders = async (user_id: string) => {
  const res = await fetch(`${BASE_URL}/orders/user/${user_id}`);
  return res.json();
};

// ─── CHAT ────────────────────────────────────────────
export const sendChatMessage = async (data: {
  user_id: string;
  message: string;
  history: { role: string; content: string }[];
}) => {
  const res = await fetch(`${BASE_URL}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ─── OUTFIT ──────────────────────────────────────────
export const buildOutfit = async (data: {
  user_id: string;
  occasion: string;
  gender: string;
  style?: string;
  max_budget?: number;
}) => {
  const res = await fetch(`${BASE_URL}/outfit/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ─── QUIZ ────────────────────────────────────────────
export const submitQuiz = async (data: {
  user_id: string;
  answers: { question_id: string; answer: string }[];
}) => {
  const res = await fetch(`${BASE_URL}/quiz/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};