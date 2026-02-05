import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [loading, setLoading] = useState(true);

    // Стани для додавання сайту
    const [addingGroupId, setAddingGroupId] = useState(null);
    const [newSiteUrl, setNewSiteUrl] = useState('');

    // Стани для перевірки
    const [checkingGroupId, setCheckingGroupId] = useState(null);
    const [checkResults, setCheckResults] = useState({});

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await api.get('/groups/');
            setGroups(response.data);
        } catch (error) {
            console.error("Не вдалося завантажити групи", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!newGroupName.trim()) return;

        try {
            await api.post('/groups/', { name: newGroupName });
            setNewGroupName('');
            fetchGroups();
        } catch (error) {
            toast.error('Не вдалося створити групу');
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Точно видалити цю групу разом із сайтами? 😬")) return;
        toast.promise(
            api.delete(`/groups/${groupId}`).then(() => fetchGroups()),
            {
                loading: 'Видаляю...',
                success: 'Групу видалено 🗑️',
                error: 'Помилка видалення',
            }
        );
    };

    const handleAddSite = async (e, groupId) => {
        e.preventDefault();
        if (!newSiteUrl.trim()) return;

        try {
            await api.post(`/groups/${groupId}/sites`, null, {
                params: { url: newSiteUrl }
            });
            setAddingGroupId(null);
            setNewSiteUrl('');
            fetchGroups(); 
        } catch (error) {
            const msg = error.response?.data?.detail || 'Не вдалося додати сайт';
            toast.error(msg, { id: loadingToast });
        }
    };

    // 👇 ФУНКЦІЯ ВИДАЛЕННЯ САЙТУ
    const handleRemoveSite = async (groupId, siteId) => {
        if (!window.confirm("Прибрати цей сайт з групи?")) return;
        try {
            await api.delete(`/groups/${groupId}/sites/${siteId}`);
            fetchGroups();
        } catch (error) {
            console.error(error);
            alert("Не вдалося видалити сайт");
        }
    };

    const handleCheckGroup = async (groupId) => {
        setCheckingGroupId(groupId);
        try {
            const response = await api.get(`/check/groups/${groupId}`);
            const newResults = {};
            response.data.forEach(result => {
                newResults[result.url] = result;
            });
            setCheckResults(prev => ({ ...prev, ...newResults }));
        } catch (error) {
            console.error(error);
            alert("Не вдалося перевірити групу");
        } finally {
            setCheckingGroupId(null);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ marginBottom: '30px' }}>Мої Групи 📦</h1>

            {/* Форма створення групи */}
            <form onSubmit={handleCreateGroup} style={{ 
                marginBottom: '40px', 
                display: 'flex', 
                gap: '10px',
                background: 'var(--card-bg)',
                padding: '20px',
                borderRadius: '16px',
                border: '2px solid var(--border-color)'
            }}>
                <input
                    type="text"
                    placeholder="Назва нової групи (напр. Універ)"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem' }}
                />
                <button type="submit" style={{ backgroundColor: 'var(--text-color)', color: 'white', padding: '12px 25px', borderRadius: '10px' }}>
                    + Створити
                </button>
            </form>

            {/* Список груп */}
            {loading ? (
                <p>Завантажую...</p>
            ) : (
                <div style={{ display: 'grid', gap: '30px' }}>
                    {groups.length === 0 ? (
                        <p style={{ opacity: 0.6, textAlign: 'center' }}>У тебе ще немає груп.</p>
                    ) : (
                        groups.map(group => (
                            <div key={group.id} style={{
                                background: 'var(--card-bg)', padding: '25px', borderRadius: '16px', border: '2px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{group.name}</h3>
                                        {/* 🗑️ КНОПКА ВИДАЛЕННЯ ГРУПИ */}
                                        <button 
                                            onClick={() => handleDeleteGroup(group.id)}
                                            title="Видалити групу"
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                opacity: 0.4,
                                                transition: 'opacity 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.opacity = 1}
                                            onMouseLeave={(e) => e.target.style.opacity = 0.4}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleCheckGroup(group.id)}
                                        disabled={checkingGroupId === group.id}
                                        style={{
                                            backgroundColor: checkingGroupId === group.id ? '#ccc' : 'var(--text-color)',
                                            color: 'white',
                                            padding: '8px 20px',
                                            borderRadius: '20px',
                                            fontSize: '0.9rem',
                                            cursor: checkingGroupId === group.id ? 'wait' : 'pointer',
                                            transition: 'background 0.3s'
                                        }}
                                    >
                                        {checkingGroupId === group.id ? 'Перевіряю... ⏳' : 'Перевірити групу ⚡'}
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {group.sites && group.sites.length > 0 ? (
                                        group.sites.map(site => {
                                            const result = checkResults[site.url];
                                            let statusColor = '#ccc';
                                            if (result) {
                                                statusColor = result.is_alive ? 'var(--alive-color)' : 'var(--dead-color)';
                                            }

                                            return (
                                                <div key={site.id} style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '12px', backgroundColor: 'var(--bg-color)', borderRadius: '8px'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <div style={{
                                                            width: '12px', height: '12px', borderRadius: '50%',
                                                            backgroundColor: statusColor,
                                                            transition: 'background-color 0.5s ease'
                                                        }}></div>
                                                        
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ fontWeight: 'bold' }}>{site.title || site.url}</span>
                                                            <a href={site.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--alive-color)', textDecoration: 'none' }}>
                                                                {site.url}
                                                            </a>
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        {result && (
                                                            <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                                                                <div style={{ fontWeight: 'bold', color: result.is_alive ? 'var(--alive-color)' : 'var(--dead-color)' }}>
                                                                    {result.label}
                                                                </div>
                                                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                                                                    {result.status_code} • {result.response_time}с
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {/* ❌ КНОПКА ВИДАЛЕННЯ САЙТУ */}
                                                        <button 
                                                            onClick={() => handleRemoveSite(group.id, site.id)}
                                                            title="Прибрати сайт"
                                                            style={{
                                                                background: 'none',
                                                                color: 'var(--dead-color)',
                                                                fontSize: '1.4rem',
                                                                fontWeight: 'bold',
                                                                opacity: 0.3,
                                                                padding: '0 5px',
                                                                lineHeight: '1'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.opacity = 1}
                                                            onMouseLeave={(e) => e.target.style.opacity = 0.3}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        addingGroupId !== group.id && (
                                            <div style={{ opacity: 0.5, fontStyle: 'italic', fontSize: '0.9rem' }}>У цій групі ще пусто...</div>
                                        )
                                    )}
                                </div>

                                <div style={{ marginTop: '15px', textAlign: 'right' }}>
                                    {addingGroupId === group.id ? (
                                        <form onSubmit={(e) => handleAddSite(e, group.id)} style={{ display: 'flex', gap: '10px' }}>
                                            <input type="url" placeholder="https://..." autoFocus required value={newSiteUrl} onChange={(e) => setNewSiteUrl(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--alive-color)', outline: 'none' }} />
                                            <button type="submit" style={{ backgroundColor: 'var(--alive-color)', color: 'white', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem' }}>Зберегти</button>
                                            <button type="button" onClick={() => setAddingGroupId(null)} style={{ color: 'var(--dead-color)', background: 'none', fontSize: '0.9rem' }}>Скасувати</button>
                                        </form>
                                    ) : (
                                        <button onClick={() => { setAddingGroupId(group.id); setNewSiteUrl(''); }} style={{ background: 'none', color: 'var(--alive-color)', fontSize: '0.9rem', fontWeight: 'bold' }}>+ Додати сайт</button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;