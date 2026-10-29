/**
 * Authentication API Service
 * Centralizes HTTP communication with backend authentication endpoints.
 */

const API_BASE = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/+$/, '');

/**
 * Parses and normalizes API error responses.
 */
async function parseResponse(response) {
  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON response or empty body
  }

  if (!response.ok) {
    let message = 'An unexpected server error occurred.';
    if (data?.message) {
      message = data.message;
    } else if (data?.error) {
      message = data.error;
    } else if (response.status === 429) {
      message = 'Too many requests. Please wait a moment before trying again.';
    } else if (response.status === 503) {
      message = 'Database service is temporarily unavailable. Please try again shortly.';
    } else if (response.status === 401) {
      message = 'Invalid email or password.';
    } else if (response.status === 403) {
      message = 'Access forbidden. Your account may be deactivated.';
    }

    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Authenticate existing user with email and password.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{ success: boolean, token: string, user: { id: string, name: string, email: string, role: string } }>}
 */
export async function loginApi({ email, password }) {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return await parseResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netError = new Error('Cannot connect to authentication service. Ensure backend is running.');
      netError.status = 0;
      throw netError;
    }
    throw error;
  }
}

/**
 * Register a new Citizen account.
 * Note: Role is strictly CITIZEN on public registration.
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<{ success: boolean, token: string, user: { id: string, name: string, email: string, role: string } }>}
 */
export async function registerApi({ name, email, password }) {
  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return await parseResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netError = new Error('Cannot connect to authentication service. Ensure backend is running.');
      netError.status = 0;
      throw netError;
    }
    throw error;
  }
}

/**
 * Fetch profile of currently authenticated user using JWT token.
 * @param {string} token - JWT bearer token
 * @returns {Promise<{ success: boolean, user: { id: string, name: string, email: string, role: string } }>}
 */
export async function getMeApi(token) {
  if (!token) {
    throw new Error('Authentication token is required.');
  }

  try {
    const response = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await parseResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netError = new Error('Cannot connect to authentication service.');
      netError.status = 0;
      throw netError;
    }
    throw error;
  }
}
