import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function InteractiveClassroom() {
    const { i18n } = useTranslation();
    const isChinese = i18n.language?.startsWith('zh');

    const classroomEngineUrl = useMemo(() => {
        const configured = (import.meta as any)?.env?.VITE_CLASSROOM_ENGINE_URL as string | undefined;
        if (configured) return configured;
        if (typeof window === 'undefined') return 'http://localhost:3000';
        return `${window.location.protocol}//${window.location.hostname}:3000`;
    }, []);

    const [engineOk, setEngineOk] = useState<boolean | null>(null);

    useEffect(() => {
        let alive = true;
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 2500);

        fetch(`${classroomEngineUrl}/api/health`, { signal: controller.signal })
            .then((r) => {
                if (!alive) return;
                setEngineOk(r.ok);
            })
            .catch(() => {
                if (!alive) return;
                setEngineOk(false);
            })
            .finally(() => {
                window.clearTimeout(timeoutId);
            });

        return () => {
            alive = false;
            window.clearTimeout(timeoutId);
            controller.abort();
        };
    }, [classroomEngineUrl]);

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '18px' }}>{isChinese ? '交互课堂' : 'Interactive Classroom'}</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        {isChinese ? '在这里生成交互式教学内容、测验和幻灯片。' : 'Generate interactive learning content, quizzes, and slides here.'}
                    </p>
                </div>
                <a href={classroomEngineUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    {isChinese ? '在新窗口打开' : 'Open in new window'}
                </a>
            </div>
            <div style={{ flex: 1, background: 'var(--bg-primary)' }}>
                {engineOk === false ? (
                    <div style={{ padding: '24px' }}>
                        <div className="glass-panel" style={{ borderRadius: '16px', padding: '18px' }}>
                            <div style={{ fontWeight: 700, marginBottom: '8px' }}>
                                {isChinese ? '课堂引擎未启动或不可访问' : 'Classroom engine is not running or unreachable'}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
                                {isChinese
                                    ? `请先启动 OpenMAIC（默认地址：${classroomEngineUrl}）。`
                                    : `Start OpenMAIC first (default: ${classroomEngineUrl}).`}
                            </div>
                            <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', lineHeight: 1.7 }}>
                                {isChinese
                                    ? '如果你使用 Docker：docker compose up -d openmaic'
                                    : 'If using Docker: docker compose up -d openmaic'}
                            </div>
                        </div>
                    </div>
                ) : (
                    <iframe
                        src={classroomEngineUrl}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Interactive Classroom"
                    />
                )}
            </div>
        </div>
    );
}
