import axios from 'axios';

const api = axios.create({
    baseURL: 'https://aplication-backend-mkdg.onrender.com/api',
});

// Enviar token en cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

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

// Interceptor de RESPUESTA: si el backend devuelve 401, cerrar sesión automáticamente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expirado o inválido → limpiar sesión y redirigir al login
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('currentUser');

            // Redirigir al login (funciona con HashRouter)
            if (!window.location.hash.includes('/login')) {
                window.location.hash = '#/login';
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default api;
