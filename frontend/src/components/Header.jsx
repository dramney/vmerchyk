import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
    const { token, logout } = useContext(AuthContext);

    return (
        <header style={{
            backgroundColor: 'var(--card-bg)',
            borderBottom: '2px solid var(--border-color)',
            padding: '15px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* Логотип */}
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)' }}>
                    Вмерчик<span style={{ color: 'var(--dead-color)' }}>.</span>
                </div>
            </Link>

            {/* Права частина */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                
                {token ? (
                    <>
                        {/* Якщо залогінений: Кнопка Дашборд + Аватарка */}
                        <Link to="/dashboard" style={{ 
                            textDecoration: 'none', 
                            color: 'var(--text-color)',
                            fontWeight: '600' 
                        }}>
                            Мої сайти
                        </Link>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Імітація аватарки - кружечок з буквою */}
                            <div style={{
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--alive-color)',
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: 'bold'
                            }}>
                                👤
                            </div>
                            <button 
                                onClick={logout}
                                style={{
                                    background: 'none',
                                    color: 'var(--dead-color)',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Вийти
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Якщо НЕ залогінений: Вхід / Реєстрація */}
                        <Link to="/login" style={{ 
                            textDecoration: 'none', 
                            color: 'var(--text-color)', 
                            fontWeight: 'bold' 
                        }}>
                            Увійти
                        </Link>
                        
                        <Link to="/register">
                            <button style={{
                                backgroundColor: 'var(--text-color)',
                                color: 'white',
                                padding: '8px 20px',
                                borderRadius: '20px',
                                fontSize: '0.9rem'
                            }}>
                                Реєстрація
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;