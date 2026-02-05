import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Неправильний логін або пароль 🥺');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '80px auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '30px' }}>З поверненням! 👋</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Email або Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        padding: '15px',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        outline: 'none'
                    }}
                />
                <input 
                    type="password" 
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: '15px',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        outline: 'none'
                    }}
                />
                
                {error && <div style={{ color: 'var(--dead-color)' }}>{error}</div>}

                <button type="submit" style={{
                    padding: '15px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--alive-color)',
                    color: 'white',
                    fontSize: '1rem',
                    marginTop: '10px'
                }}>
                    Увійти
                </button>
            </form>
        </div>
    );
};

export default Login;