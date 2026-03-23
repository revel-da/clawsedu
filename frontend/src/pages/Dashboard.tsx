import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { agentApi } from '../services/api';

const statusLabel = (status: string, isChinese: boolean) => {
    if (status === 'running') return isChinese ? '在线' : 'Online';
    if (status === 'idle') return isChinese ? '空闲' : 'Idle';
    if (status === 'creating') return isChinese ? '创建中' : 'Creating';
    if (status === 'error') return isChinese ? '异常' : 'Error';
    return isChinese ? '停止' : 'Stopped';
};

export default function Dashboard() {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const isChinese = i18n.language?.startsWith('zh');
    const currentTenant = localStorage.getItem('current_tenant_id') || '';

    const { data: agents = [], isLoading } = useQuery({
        queryKey: ['agents', currentTenant],
        queryFn: () => agentApi.list(currentTenant || undefined),
        refetchInterval: 15000,
    });

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return isChinese ? '早安，同学！' : 'Good Morning!';
        if (hour < 18) return isChinese ? '下午好，同学！' : 'Good Afternoon!';
        return isChinese ? '晚上好，同学！' : 'Good Evening!';
    }, [isChinese]);

    return (
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>☀️ {greeting}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {isChinese ? `当前共有 ${agents.length} 个助手` : `${agents.length} assistants available`}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <button className="glass-panel" style={{ borderRadius: '16px', padding: '20px', textAlign: 'left' }} onClick={() => navigate('/agents/new')}>
                    <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{isChinese ? '新建学习助手' : 'New Assistant'}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{isChinese ? '创建一个专属 AI 助教' : 'Create your own AI tutor'}</div>
                </button>
                <button className="glass-panel" style={{ borderRadius: '16px', padding: '20px', textAlign: 'left' }} onClick={() => navigate('/interactive')}>
                    <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{isChinese ? '开始互动课堂' : 'Start Interactive'}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{isChinese ? '进入对话式学习' : 'Learn through interactive dialogue'}</div>
                </button>
                <button className="glass-panel" style={{ borderRadius: '16px', padding: '20px', textAlign: 'left' }} onClick={() => navigate('/plaza')}>
                    <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{isChinese ? '浏览学习广场' : 'Browse Plaza'}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{isChinese ? '查看同学分享' : 'See community notes'}</div>
                </button>
            </div>

            {isLoading ? (
                <div style={{ color: 'var(--text-secondary)' }}>{isChinese ? '加载中...' : 'Loading...'}</div>
            ) : agents.length === 0 ? (
                <div className="glass-panel" style={{ borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                    <div style={{ fontSize: '42px', marginBottom: '8px' }}>🤖</div>
                    <div style={{ marginBottom: '14px' }}>{isChinese ? '还没有助手' : 'No assistants yet'}</div>
                    <button className="btn btn-primary" onClick={() => navigate('/agents/new')}>
                        {isChinese ? '立即创建' : 'Create now'}
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                    {agents.map((agent: any) => (
                        <div
                            key={agent.id}
                            className="glass-panel hoverable"
                            style={{ borderRadius: '16px', padding: '16px', cursor: 'pointer' }}
                            onClick={() => navigate(`/agents/${agent.id}`)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{ fontWeight: 700, fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.name}</div>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{statusLabel(agent.status, isChinese)}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', minHeight: '38px' }}>
                                {agent.role_description || (isChinese ? '暂无描述' : 'No description')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
