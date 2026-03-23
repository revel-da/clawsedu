import { useTranslation } from 'react-i18next';

export default function InteractiveClassroom() {
    const { i18n } = useTranslation();
    const isChinese = i18n.language?.startsWith('zh');

    const CLASSROOM_ENGINE_URL = 'http://localhost:3000';

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '18px' }}>{isChinese ? '交互课堂' : 'Interactive Classroom'}</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        {isChinese ? '在这里生成交互式教学内容、测验和幻灯片。' : 'Generate interactive learning content, quizzes, and slides here.'}
                    </p>
                </div>
                <a href={CLASSROOM_ENGINE_URL} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    {isChinese ? '在新窗口打开' : 'Open in new window'}
                </a>
            </div>
            <div style={{ flex: 1, background: 'var(--bg-primary)' }}>
                <iframe 
                    src={CLASSROOM_ENGINE_URL} 
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Interactive Classroom"
                />
            </div>
        </div>
    );
}
