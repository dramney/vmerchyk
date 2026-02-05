import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/auth/register', formData);
            
            setSuccess(true);
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Щось пішло не так. Спробуй пізніше.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '60px auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '10px' }}>Приєднуйся до Вмерчика! 🦦</h2>
            <p style={{ marginBottom: '30px', opacity: 0.7 }}>Створи акаунт, щоб зберігати свої сайти</p>

            {success ? (
                <div style={{ 
                    padding: '20px', 
                    background: '#d4edda', 
                    color: '#155724', 
                    borderRadius: '12px',
                    border: '1px solid #c3e6cb'
                }}>
                    <h3>Успіх! 🎉</h3>
                    <p>Акаунт створено. Зараз перенаправимо на вхід...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <input 
                        type="text" 
                        name="username"
                        placeholder="Юзернейм (напр. vmerchyk_fan)"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{
                            padding: '15px',
                            borderRadius: '12px',
                            border: '2px solid var(--border-color)',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                    />

                    <input 
                        type="email" 
                        name="email"
                        placeholder="Електронна пошта"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            padding: '15px',
                            borderRadius: '12px',
                            border: '2px solid var(--border-color)',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                    />

                    <input 
                        type="password" 
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            padding: '15px',
                            borderRadius: '12px',
                            border: '2px solid var(--border-color)',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                    />
                    
                    {error && (
                        <div style={{ color: 'var(--dead-color)', fontWeight: 'bold' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" style={{
                        padding: '15px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--text-color)', // Кавовий
                        color: 'white',
                        fontSize: '1rem',
                        marginTop: '10px'
                    }}>
                        Зареєструватися
                    </button>
                </form>
            )}

            <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                Вже є акаунт? <Link to="/login" style={{ color: 'var(--alive-color)', fontWeight: 'bold' }}>Увійти</Link>
            </p>
        </div>
    );
};

export default Register;