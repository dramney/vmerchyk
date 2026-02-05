import { useState } from 'react';
import api from '../api/axios';

const UrlChecker = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await api.get(`/check/check`, {
                params: { url: url } 
            });
            setResult(response.data);
        } catch (err) {
            setError('Щось пішло не так... Може бекенд спить? 😴');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Форма */}
            <form onSubmit={handleCheck} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <input
                    type="url"
                    placeholder="Встав посилання (https://...)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    style={{
                        flex: 1,
                        padding: '15px',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem',
                        outline: 'none',
                        color: 'var(--text-color)',
                        backgroundColor: 'var(--card-bg)'
                    }}
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        padding: '15px 30px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--alive-color)', // Блакитний
                        color: 'white',
                        fontSize: '1rem',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Думаю...' : 'Перевірити'}
                </button>
            </form>

            {/* Помилка */}
            {error && (
                <div style={{ color: 'var(--dead-color)', textAlign: 'center', marginBottom: '20px' }}>
                    {error}
                </div>
            )}

            {/* Результат (Картка) */}
            {result && (
                <div style={{
                    background: 'var(--card-bg)',
                    padding: '25px',
                    borderRadius: '16px',
                    border: '2px solid var(--border-color)',
                    boxShadow: '0 4px 12px rgba(74, 59, 50, 0.05)',
                    textAlign: 'center'
                }}>
                    <h2 style={{ marginTop: 0, color: 'var(--text-color)' }}>
                        {result.url}
                    </h2>
                    
                    <div style={{ margin: '20px 0' }}>
                        <span style={{
                            fontSize: '1.2rem',
                            padding: '8px 20px',
                            borderRadius: '50px',
                            background: result.is_alive ? 'var(--alive-color)' : 'var(--dead-color)',
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            {result.label}
                        </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: '#888' }}>
                        <span>Код: <b>{result.status_code}</b></span>
                        <span>Час: <b>{result.response_time} с</b></span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UrlChecker;