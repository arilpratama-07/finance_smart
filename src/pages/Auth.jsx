import { useState } from 'react';
import { useStore } from '../store';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

export default function Auth() {
  const { login } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi proses login/register yang berhasil
    // Di aplikasi nyata, di sini Anda akan memanggil API atau Firebase
    login({ name: isLogin ? 'User FinanSmart' : form.name, email: form.email });
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'var(--bg-primary)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
          <div className="logo-icon" style={{ width: 60, height: 60, fontSize: 32, borderRadius: 16 }}>
            F
          </div>
        </div>

        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', marginBottom: 8, fontSize: 24 }}>
          {isLogin ? 'Selamat Datang Kembali!' : 'Buat Akun Baru'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 32, fontSize: 14 }}>
          {isLogin ? 'Masuk untuk mengelola keuangan Anda' : 'Mulai perjalanan finansial Anda hari ini'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <div className="search-wrap">
                <User size={18} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ahmad Fauzi"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required 
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Alamat Email</label>
            <div className="search-wrap">
              <Mail size={18} />
              <input 
                type="email" 
                className="form-control" 
                placeholder="email@contoh.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Kata Sandi</label>
              {isLogin && <a href="#" style={{ fontSize: 12, color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}>Lupa sandi?</a>}
            </div>
            <div className="search-wrap" style={{ marginTop: 8 }}>
              <Lock size={18} />
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15 }}>
            {isLogin ? 'Masuk ke Akun' : 'Daftar Sekarang'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--green)', fontWeight: 600, cursor: 'pointer' }}
          >
            {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
          </span>
        </div>

      </div>
    </div>
  );
}
