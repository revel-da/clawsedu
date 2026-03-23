/* ═══════════════════════════════════════════════════════
   ClawsEdu — Neo-Campus Login (Passport Style)
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores';
import { authApi } from '../services/api';

export default function Login() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const isChinese = i18n.language?.startsWith('zh');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        username: '',
        password: '',
        email: '',
    });

    // Neo-Campus Theme: Vibrant background
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light');
    }, []);

    const toggleLang = () => {
        i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let res;
            if (isRegister) {
                res = await authApi.register({
                    ...form,
                    display_name: form.username,
                });
            } else {
                res = await authApi.login({ username: form.username, password: form.password });
            }
            setAuth(res.user, res.access_token);
            // Redirect to company setup if user has no company assigned
            if (res.needs_company_setup) {
                navigate('/setup-company');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            const msg = err.message || '';
            // Server-returned error messages
            if (msg && msg !== 'Failed to fetch' && !msg.includes('NetworkError') && !msg.includes('ERR_CONNECTION')) {
                if (msg.includes('company has been disabled')) {
                    setError(t('auth.companyDisabled', 'Your company has been disabled. Please contact the platform administrator.'));
                } else if (msg.includes('Invalid credentials')) {
                    setError(t('auth.invalidCredentials', 'Invalid username or password.'));
                } else if (msg.includes('Account is disabled')) {
                    setError(t('auth.accountDisabled', 'Your account has been disabled.'));
                } else if (msg.includes('500') || msg.includes('Internal Server Error')) {
                    setError(t('auth.serverStarting', 'Service is starting up or experiencing issues. Please try again in a few seconds.'));
                } else {
                    setError(msg);
                }
            } else {
                setError(t('auth.serverUnreachable', 'Unable to reach server. Please check if the service is running and try again.'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <style>{`
                /* Neo-Campus Login Overrides */
                .login-page {
                    display: flex;
                    height: 100vh;
                    width: 100vw;
                    background: linear-gradient(135deg, #F8FAFC 0%, #E0E7FF 100%);
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                }
                
                /* Animated Mesh Background */
                .login-page::before {
                    content: '';
                    position: absolute;
                    top: -20%; left: -10%; width: 60%; height: 60%;
                    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(255,255,255,0) 70%);
                    border-radius: 50%;
                    filter: blur(60px);
                    animation: float 10s ease-in-out infinite;
                }
                .login-page::after {
                    content: '';
                    position: absolute;
                    bottom: -20%; right: -10%; width: 70%; height: 70%;
                    background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(255,255,255,0) 70%);
                    border-radius: 50%;
                    filter: blur(60px);
                    animation: float 15s ease-in-out infinite reverse;
                }
                @keyframes float { 0% { transform: translate(0,0); } 50% { transform: translate(20px, -20px); } 100% { transform: translate(0,0); } }

                /* "Passport" Card */
                .login-passport {
                    display: flex;
                    width: 900px;
                    max-width: 100%;
                    height: 560px;
                    max-height: 90vh;
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 
                        0 20px 50px -12px rgba(0, 0, 0, 0.1),
                        0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                    overflow: hidden;
                    position: relative;
                    z-index: 10;
                }

                .login-left {
                    flex: 1;
                    padding: 48px;
                    display: flex;
                    flex-direction: column;
                    background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
                    color: white;
                    position: relative;
                    overflow: hidden;
                }
                
                /* Left panel patterns */
                .login-left::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: 
                        radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                    background-position: 0 0, 10px 10px;
                    opacity: 0.3;
                }

                .login-brand {
                    position: relative;
                    z-index: 2;
                    margin-bottom: auto;
                }
                .login-brand-logo {
                    font-family: var(--font-heading);
                    font-size: 28px;
                    font-weight: 700;
                    display: flex; align-items: center; gap: 12px;
                    letter-spacing: -0.02em;
                }
                .login-brand-tag {
                    display: inline-block;
                    margin-top: 8px;
                    padding: 4px 10px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                }

                .login-welcome {
                    position: relative; z-index: 2;
                }
                .login-welcome h2 {
                    font-size: 32px; margin: 0 0 16px; line-height: 1.2;
                }
                .login-welcome p {
                    font-size: 15px; opacity: 0.9; line-height: 1.6; margin: 0 0 32px;
                }

                .feature-list { display: flex; flex-direction: column; gap: 16px; }
                .feature-item { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 500; }
                .feature-icon { 
                    width: 32px; height: 32px; background: rgba(255,255,255,0.2); 
                    border-radius: 10px; display: flex; align-items: center; justifyContent: center;
                }

                .login-right {
                    width: 440px;
                    padding: 48px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background: white;
                }

                /* Form Styles */
                .form-title {
                    font-family: var(--font-heading);
                    font-size: 24px; font-weight: 700; color: #1E293B;
                    margin: 0 0 8px;
                }
                .form-subtitle {
                    font-size: 14px; color: #64748B; margin: 0 0 32px;
                }
                
                .input-group { margin-bottom: 20px; }
                .input-label {
                    display: block; font-size: 13px; font-weight: 600; color: #475569;
                    margin-bottom: 8px;
                }
                .input-field {
                    width: 100%; height: 48px; padding: 0 16px;
                    border: 2px solid #E2E8F0; border-radius: 12px;
                    font-size: 15px; color: #1E293B;
                    transition: all 0.2s;
                    box-sizing: border-box;
                    background: #F8FAFC;
                }
                .input-field:focus {
                    border-color: #6366F1; background: #fff; outline: none;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .submit-btn {
                    width: 100%; height: 48px;
                    background: #1E293B; color: white;
                    border: none; border-radius: 12px;
                    font-size: 15px; font-weight: 600;
                    cursor: pointer; transition: all 0.2s;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    margin-top: 12px;
                }
                .submit-btn:hover {
                    background: #6366F1; transform: translateY(-1px);
                    box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.4);
                }
                .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

                .switch-mode {
                    margin-top: 24px; text-align: center; font-size: 14px; color: #64748B;
                }
                .switch-link {
                    color: #6366F1; font-weight: 600; text-decoration: none; margin-left: 6px; cursor: pointer;
                }
                .switch-link:hover { text-decoration: underline; }

                .lang-toggle {
                    position: absolute; top: 24px; right: 24px;
                    padding: 6px 12px; background: #F1F5F9; border-radius: 20px;
                    font-size: 12px; font-weight: 600; color: #64748B; cursor: pointer;
                    transition: all 0.2s;
                }
                .lang-toggle:hover { background: #E2E8F0; color: #1E293B; }

                @media (max-width: 768px) {
                    .login-passport { flex-direction: column; height: auto; margin: 20px; }
                    .login-left { padding: 32px; min-height: 200px; }
                    .login-right { width: 100%; padding: 32px; }
                    .feature-list { display: none; }
                }
            `}</style>

            <div className="login-passport">
                {/* Left: Brand Identity */}
                <div className="login-left">
                    <div className="login-brand">
                        <div className="login-brand-logo">
                            <div style={{ width: 32, height: 32, background: 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1', fontWeight: 'bold' }}>C</div>
                            ClawsEdu
                        </div>
                        <div className="login-brand-tag">
                            {isChinese ? '大学版 2.0' : 'University Edition 2.0'}
                        </div>
                    </div>

                    <div className="login-welcome">
                        <h2>
                            {isChinese ? '开启你的\n智慧学习之旅' : 'Start Your\nSmart Learning Journey'}
                        </h2>
                        <p>
                            {isChinese 
                                ? '更懂大学生的 AI 学习伙伴。专注、高效、且有趣。' 
                                : 'The AI companion built for students. Focused, efficient, and fun.'}
                        </p>

                        <div className="feature-list">
                            <div className="feature-item">
                                <div className="feature-icon">🤖</div>
                                <span>{isChinese ? '智能助教团队 (AI Crew)' : 'Intelligent Agent Crew'}</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">📝</div>
                                <span>{isChinese ? '沉浸式交互课堂' : 'Immersive Interactive Class'}</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✨</div>
                                <span>{isChinese ? '灵感学习广场' : 'Inspiration Plaza'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Auth Form */}
                <div className="login-right">
                    <div className="lang-toggle" onClick={toggleLang}>
                        {i18n.language === 'zh' ? 'EN / 中文' : 'English / 中文'}
                    </div>

                    <h2 className="form-title">
                        {isRegister ? (isChinese ? '加入校园' : 'Join Campus') : (isChinese ? '欢迎回来' : 'Welcome Back')}
                    </h2>
                    <p className="form-subtitle">
                        {isRegister 
                            ? (isChinese ? '创建账号以开始使用 ClawsEdu' : 'Create an account to get started') 
                            : (isChinese ? '请输入账号密码登录' : 'Please enter your details to sign in')}
                    </p>

                    {error && (
                        <div style={{ 
                            padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px',
                            background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">{t('auth.username')}</label>
                            <input
                                className="input-field"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                                autoFocus
                                placeholder={isChinese ? '你的学号或昵称' : 'Student ID or Username'}
                            />
                        </div>

                        {isRegister && (
                            <div className="input-group">
                                <label className="input-label">{t('auth.email')}</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                    placeholder="student@university.edu"
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label className="input-label">{t('auth.password')}</label>
                            <input
                                type="password"
                                className="input-field"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button className="submit-btn" type="submit" disabled={loading}>
                            {loading ? (isChinese ? '处理中...' : 'Processing...') : (
                                <>
                                    {isRegister ? (isChinese ? '注册并登录' : 'Sign Up') : (isChinese ? '立即登录' : 'Sign In')}
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="switch-mode">
                        {isRegister ? t('auth.hasAccount') : t('auth.noAccount')}
                        <span className="switch-link" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
                            {isRegister ? t('auth.goLogin') : t('auth.goRegister')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
