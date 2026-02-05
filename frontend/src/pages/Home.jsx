import UrlChecker from '../components/UrlChecker';

const Home = () => {
    return (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            {/* Великий заголовок */}
            <h1 style={{ fontSize: '3.5rem', marginBottom: '10px', color: 'var(--text-color)' }}>
                Вмерчик <span style={{ color: 'var(--dead-color)' }}>.</span>
            </h1>
            
            <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '50px' }}>
                Дізнайся, чи живий твій сайт, поки п'єш каву ☕
            </p>

            {/* Вставляємо наш компонент перевірки */}
            <UrlChecker />
        </div>
    );
};

export default Home;