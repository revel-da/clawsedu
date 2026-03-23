import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores';

export default function Oversight() {
    const { t, i18n } = useTranslation();
    const isChinese = i18n.language?.startsWith('zh');
    const { user } = useAuthStore();
    
    const [activeTab, setActiveTab] = useState<'approvals' | 'reports'>('approvals');
    const [approvals, setApprovals] = useState([
        { id: 1, student: '小明', skill: 'Web Search', reason: '需要搜索课外资料', status: 'pending' },
        { id: 2, student: '小红', skill: 'Complex Task Executor', reason: '想要自动生成完整代码', status: 'pending' },
    ]);

    const handleApprove = (id: number, approved: boolean) => {
        setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: approved ? 'approved' : 'rejected' } : a));
    };

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 8px 0' }}>{isChinese ? '学习监督中心' : 'Study Oversight'}</h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    {isChinese ? '审批敏感能力的使用，并查看学习进度报告。' : 'Approve sensitive capabilities and view learning progress reports.'}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
                <button 
                    onClick={() => setActiveTab('approvals')}
                    style={{ 
                        background: 'none', border: 'none', padding: '8px 16px', cursor: 'pointer',
                        borderBottom: activeTab === 'approvals' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                        color: activeTab === 'approvals' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'approvals' ? 600 : 400
                    }}
                >
                    {isChinese ? '技能审批流' : 'Skill Approvals'}
                </button>
                <button 
                    onClick={() => setActiveTab('reports')}
                    style={{ 
                        background: 'none', border: 'none', padding: '8px 16px', cursor: 'pointer',
                        borderBottom: activeTab === 'reports' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                        color: activeTab === 'reports' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'reports' ? 600 : 400
                    }}
                >
                    {isChinese ? '学习进度报告' : 'Progress Reports'}
                </button>
            </div>

            {activeTab === 'approvals' && (
                <div>
                    {approvals.map(app => (
                        <div key={app.id} style={{ 
                            padding: '16px', background: 'var(--bg-primary)', 
                            borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
                            marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{app.student} {isChinese ? '申请使用' : 'requested'} {app.skill}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{isChinese ? '理由：' : 'Reason: '} {app.reason}</div>
                            </div>
                            {app.status === 'pending' ? (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-secondary" onClick={() => handleApprove(app.id, false)}>{isChinese ? '拒绝' : 'Reject'}</button>
                                    <button className="btn btn-primary" onClick={() => handleApprove(app.id, true)}>{isChinese ? '批准' : 'Approve'}</button>
                                </div>
                            ) : (
                                <div style={{ 
                                    color: app.status === 'approved' ? 'green' : 'red',
                                    fontWeight: 500, fontSize: '14px'
                                }}>
                                    {app.status === 'approved' ? (isChinese ? '已批准' : 'Approved') : (isChinese ? '已拒绝' : 'Rejected')}
                                </div>
                            )}
                        </div>
                    ))}
                    {approvals.length === 0 && <div style={{ color: 'var(--text-tertiary)' }}>{isChinese ? '暂无待审批项' : 'No pending approvals'}</div>}
                </div>
            )}

            {activeTab === 'reports' && (
                <div style={{ 
                    padding: '24px', background: 'var(--bg-primary)', 
                    borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0 }}>{isChinese ? '本周学习总结' : 'Weekly Summary'}</h3>
                        <button className="btn btn-primary">{isChinese ? '自动生成最新报告' : 'Generate New Report'}</button>
                    </div>
                    <div style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        <p><strong>{isChinese ? '学习总时长：' : 'Total Learning Time: '}</strong> 12 {isChinese ? '小时' : 'hours'}</p>
                        <p><strong>{isChinese ? '解决难题：' : 'Problems Solved: '}</strong> 35 {isChinese ? '题' : 'problems'}</p>
                        <p><strong>{isChinese ? '薄弱环节：' : 'Weaknesses: '}</strong> {isChinese ? '二次函数、虚拟语气' : 'Quadratic functions, Subjunctive mood'}</p>
                        <p><strong>{isChinese ? '导师助手建议：' : 'Mentor Assistant Advice: '}</strong> {isChinese ? '建议下周增加数学基础题训练频率；同时反馈学生周三压力较大，已适当减轻周末作业量。' : 'Increase basic math practice next week. Student felt high stress on Wednesday, so weekend workload was reduced.'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
