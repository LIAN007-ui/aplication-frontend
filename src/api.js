import axios from 'axios';

const api = axios.create({
    baseURL: 'https://aplication-backend-mkdg.onrender.com/api', // Apunta a tu servidor Express
});

// Enviar token en cada petición
api.interceptors.request.use((config) => {
    // Intentamos obtener el token directamente
    const token = localStorage.getItem('token');

    // O si está dentro del objeto currentUser de CoreUI template (a veces pasa)
    const storedUser = localStorage.getItem('currentUser');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (e) { }
    }

    return config;
});

export default api;
