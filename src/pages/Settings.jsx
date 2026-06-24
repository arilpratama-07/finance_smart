import { Shield, Bell, Moon, Globe, Database, Lock, ChevronRight, User, Smartphone } from 'lucide-react';
import { useStore } from '../store';

const Section = ({ title, children }) => (
  <div className="card" style={{marginBottom:20}}>
    <div style={{fontSize:14, fontWeight:700, color:'var(--text-secondary)', marginBottom:16, textTransform:'uppercase', letterSpacing:'0.5px', fontSize:11}}>{title}</div>
    {children}
  </div>
);

const SettingRow = ({ icon: Icon, label, desc, right, color='var(--text-secondary)' }) => (
  <div style={{display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
    <div style={{width:38, height:38, borderRadius:10, background:`rgba(59,130,246,0.1)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
      <Icon size={18} color={color}/>
    </div>
    <div style={{flex:1}}>
      <div style={{fontSize:14, fontWeight:600}}>{label}</div>
      {desc && <div style={{fontSize:12, color:'var(--text-muted)', marginTop:2}}>{desc}</div>}
    </div>
    {right}
  </div>
);

const Toggle = ({ on, onClick }) => (
  <div onClick={onClick} style={{
    width:44, height:24, borderRadius:12, cursor:'pointer',
    background: on ? 'var(--green)' : 'var(--bg-primary)',
    border: '1px solid var(--border)', position:'relative', transition:'all 0.2s'
  }}>
    <div style={{
      position:'absolute', top:3, left: on ? 22 : 3,
      width:16, height:16, borderRadius:'50%', background:'white', transition:'left 0.2s'
    }}/>
  </div>
);

export default function Settings() {
  const { theme, toggleTheme } = useStore();
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="page-title">Pengaturan</div>
          <div className="page-subtitle">Konfigurasi aplikasi dan preferensi Anda</div>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <Section title="Profil Pengguna">
            <div style={{display:'flex', alignItems:'center', gap:14, padding:'16px', background:'var(--bg-primary)', borderRadius:'var(--radius)', marginBottom:14}}>
              <div style={{width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg, var(--purple), var(--blue))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:'white'}}>A</div>
              <div>
                <div style={{fontWeight:700, fontSize:16}}>Ahmad Fauzi</div>
                <div style={{fontSize:13, color:'var(--text-muted)'}}>ahmad@finansmart.id</div>
                <span className="badge badge-green" style={{marginTop:6}}>Premium</span>
              </div>
            </div>
            <SettingRow icon={User} label="Edit Profil" desc="Ubah nama, email, dan foto profil" right={<ChevronRight size={16} color="var(--text-muted)"/>}/>
            <SettingRow icon={Lock} label="Ubah Password" desc="Perbarui kata sandi akun Anda" right={<ChevronRight size={16} color="var(--text-muted)"/>}/>
            <SettingRow icon={Smartphone} label="Autentikasi Dua Faktor" desc="Aktif — Menggunakan Google Authenticator" right={<Toggle on={true}/>} color="var(--green)"/>
          </Section>

          <Section title="Notifikasi">
            <SettingRow icon={Bell} label="Notifikasi Anggaran" desc="Peringatan saat mendekati batas anggaran" right={<Toggle on={true}/>}/>
            <SettingRow icon={Bell} label="Tagihan Jatuh Tempo" desc="Ingatkan 3 hari sebelum jatuh tempo" right={<Toggle on={true}/>}/>
            <SettingRow icon={Bell} label="Ringkasan Mingguan" desc="Laporan ringkas setiap Senin pagi" right={<Toggle on={false}/>}/>
            <SettingRow icon={Bell} label="Notifikasi Email" desc="Kirim laporan bulanan ke email" right={<Toggle on={true}/>}/>
          </Section>
        </div>

        <div>
          <Section title="Keamanan & Privasi">
            <SettingRow icon={Shield} label="Enkripsi End-to-End" desc="Semua data dienkripsi secara lokal" right={<span className="badge badge-green">Aktif</span>} color="var(--green)"/>
            <SettingRow icon={Database} label="Backup Cloud Otomatis" desc="Terakhir backup: hari ini, 06:00" right={<Toggle on={true}/>}/>
            <SettingRow icon={Lock} label="Kunci Aplikasi (PIN)" desc="Minta PIN saat membuka aplikasi" right={<Toggle on={false}/>}/>
            <SettingRow icon={Shield} label="Session Timeout" desc="Keluar otomatis setelah 30 menit tidak aktif" right={<Toggle on={true}/>}/>
          </Section>

          <Section title="Preferensi Tampilan">
            <SettingRow icon={Globe} label="Mata Uang" desc="Rupiah Indonesia (IDR)" right={
              <select className="form-control" style={{width:120, padding:'6px 10px', fontSize:13}}>
                <option>IDR</option><option>USD</option><option>EUR</option><option>SGD</option>
              </select>
            }/>
            <SettingRow icon={Moon} label="Tema Gelap" desc={`Saat ini menggunakan tema ${theme === 'dark' ? 'gelap' : 'terang'}`} right={<Toggle on={theme === 'dark'} onClick={toggleTheme}/>}/>
            <SettingRow icon={Globe} label="Bahasa" desc="Bahasa Indonesia" right={
              <select className="form-control" style={{width:130, padding:'6px 10px', fontSize:13}}>
                <option>Indonesia</option><option>English</option>
              </select>
            }/>
          </Section>

          <Section title="Tentang Aplikasi">
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              {[
                ['Versi Aplikasi', 'v2.4.0 stable'],
                ['Lisensi', 'MIT License'],
                ['Developer', 'Tim FinanSmart'],
                ['Website', 'finansmart.id'],
              ].map(([k,v])=>(
                <div key={k} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <span style={{fontSize:13, color:'var(--text-muted)'}}>{k}</span>
                  <span style={{fontSize:13, fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
