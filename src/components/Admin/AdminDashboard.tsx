import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  subscribeToMessages, 
  subscribeToProjects, 
  subscribeToBlog,
  subscribeToSettings,
  subscribeToSkills,
  subscribeToContacts,
  subscribeToStats,
  subscribeToAnalytics,
  subscribeToLogs,
  subscribeToChallenges,
  subscribeToVault,
  addLog,
  deleteMessage, 
  clearAllMessages,
  deleteProject, 
  addProject, 
  updateProject,
  addSkill,
  updateSkill,
  deleteSkill,
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
  addChallenge,
  updateChallenge,
  deleteChallenge,
  addVaultItem,
  updateVaultItem,
  deleteVaultItem,
  updateSettings,
  addContact,
  updateContact,
  deleteContact
} from '../../lib/firebase';
import { generateBlogDraft } from '../../services/geminiService';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Briefcase, 
  Settings, 
  LogOut, 
  Bell, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Activity,
  Terminal,
  ShieldAlert,
  BookOpen,
  Share2,
  Upload,
  Globe,
  Cpu,
  Lock,
  RefreshCcw,
  Layers,
  Database,
  Github as GithubIcon,
  Linkedin as LinkedinIcon,
  Twitter as TwitterIcon,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  Link as LinkIcon,
  MessageCircle,
  Send,
  Dribbble,
  Figma,
  Slack,
  Twitch,
  Music,
  Palette,
  Image as ImageIcon,
  History,
  FileText,
  Search,
  ExternalLink,
  Shield,
  Play,
  X,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'skills' | 'messages' | 'blog' | 'settings' | 'contacts' | 'analytics' | 'system' | 'theme' | 'seo' | 'assets' | 'logs' | 'music' | 'challenges' | 'vault'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [vaultItems, setVaultItems] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [analyticsLogs, setAnalyticsLogs] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const navigate = useNavigate();
  const adminEmails = ['banglag215@gmail.com', 'rkkhan205090@gmail.com'];

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/loginriad');
      } else if (!adminEmails.includes(user.email || '')) {
        alert('UNAUTHORIZED_ACCESS: Identity does not match admin credentials.');
        auth.signOut();
        navigate('/loginriad');
      }
    });

    const unsubMessages = subscribeToMessages((data) => setMessages(data));
    const unsubProjects = subscribeToProjects((data) => setProjects(data));
    const unsubSkills = subscribeToSkills((data) => setSkills(data));
    const unsubBlog = subscribeToBlog((data) => setBlogPosts(data));
    const unsubSettings = subscribeToSettings((data) => setSettings(data));
    const unsubContacts = subscribeToContacts((data) => setContacts(data));
    const unsubStats = subscribeToStats((data) => setStats(data));
    const unsubAnalytics = subscribeToAnalytics((data) => setAnalyticsLogs(data));
    const unsubLogs = subscribeToLogs((data) => setSystemLogs(data));
    const unsubChallenges = subscribeToChallenges((data) => setChallenges(data));
    const unsubVault = subscribeToVault((data) => setVaultItems(data));

    return () => {
      unsubMessages();
      unsubProjects();
      unsubSkills();
      unsubBlog();
      unsubSettings();
      unsubContacts();
      unsubStats();
      unsubAnalytics();
      unsubLogs();
      unsubChallenges();
      unsubVault();
    };
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate('/loginriad');
  };

  const selectTab = (tab: any) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 text-[#00f3ff]">
          <Activity size={20} />
          <h2 className="text-lg font-black italic">NEON_CORE</h2>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-[#00f3ff]">
          <Terminal size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 flex flex-col bg-black/90 backdrop-blur-2xl transition-transform duration-300
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-white/10 flex flex-col items-center text-center">
          <div className="relative mb-6">
             <div className="w-20 h-20 rounded-full border-2 border-[#00f3ff] p-1 bg-black overflow-hidden relative shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                {(settings?.profileImage && settings.profileImage.trim() !== '') ? (
                   <img src={settings.profileImage} alt="Admin" className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all" />
                ) : (
                   <div className="w-full h-full rounded-full bg-[#00f3ff]/5 flex items-center justify-center">
                      <Cpu className="text-[#00f3ff]/40 animate-pulse" size={32} />
                   </div>
                )}
             </div>
             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
          </div>
          
          <h1 className="text-xl font-black italic tracking-tighter text-[#00f3ff] uppercase mb-1">
            ACCESS_GRANTED
          </h1>
          <p className="text-[10px] text-[#ff00ff] font-mono tracking-[0.4em] mb-4">
            {settings?.siteTitle || 'NEON_HACKER'}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarLink 
            icon={LayoutDashboard} 
            label="DASHBOARD" 
            active={activeTab === 'dashboard'} 
            onClick={() => selectTab('dashboard')} 
          />
          <SidebarLink 
            icon={Briefcase} 
            label="PROJECTS" 
            active={activeTab === 'projects'} 
            onClick={() => selectTab('projects')} 
          />
          <SidebarLink 
            icon={RefreshCcw} 
            label="CHALLENGES" 
            active={activeTab === 'challenges'} 
            onClick={() => selectTab('challenges')} 
          />
          <SidebarLink 
            icon={Database} 
            label="HIDDEN_VAULT" 
            active={activeTab === 'vault'} 
            onClick={() => selectTab('vault')} 
          />
          <SidebarLink 
            icon={Cpu} 
            label="SKILLS" 
            active={activeTab === 'skills'} 
            onClick={() => selectTab('skills')} 
          />
          <SidebarLink 
            icon={BookOpen} 
            label="BLOG" 
            active={activeTab === 'blog'} 
            onClick={() => selectTab('blog')} 
          />
          <SidebarLink 
            icon={Palette} 
            label="THEME" 
            active={activeTab === 'theme'} 
            onClick={() => selectTab('theme')} 
          />
          <SidebarLink 
            icon={ImageIcon} 
            label="ASSETS" 
            active={activeTab === 'assets'} 
            onClick={() => selectTab('assets')} 
          />
          <SidebarLink 
            icon={Search} 
            label="SEO" 
            active={activeTab === 'seo'} 
            onClick={() => selectTab('seo')} 
          />
          <SidebarLink 
            icon={Music} 
            label="MUSIC" 
            active={activeTab === 'music'} 
            onClick={() => selectTab('music')} 
          />
          <SidebarLink 
            icon={Share2} 
            label="CONTACTS" 
            active={activeTab === 'contacts'} 
            onClick={() => selectTab('contacts')} 
          />
          <SidebarLink 
            icon={TrendingUp} 
            label="ANALYTICS" 
            active={activeTab === 'analytics'} 
            onClick={() => selectTab('analytics')} 
          />
          <SidebarLink 
            icon={History} 
            label="SYSTEM_LOGS" 
            active={activeTab === 'logs'} 
            onClick={() => selectTab('logs')} 
          />
          <SidebarLink 
            icon={MessageSquare} 
            label="MESSAGES" 
            active={activeTab === 'messages'} 
            count={messages.filter(m => !m.read).length}
            onClick={() => selectTab('messages')} 
          />
          <SidebarLink 
            icon={Globe} 
            label="SITE_CONFIG" 
            active={activeTab === 'settings'} 
            onClick={() => selectTab('settings')} 
          />
          <SidebarLink 
            icon={Activity} 
            label="SYSTEM_STATUS" 
            active={activeTab === 'system'} 
            onClick={() => selectTab('system')} 
          />
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button 
            onClick={() => window.open('/', '_blank')}
            className="w-full p-4 flex items-center gap-3 text-[#00f3ff]/60 hover:text-[#00f3ff] hover:bg-[#00f3ff]/5 transition-colors rounded-sm text-xs font-bold"
          >
            <ExternalLink size={16} /> VIEW_SITE
          </button>
          <button 
            onClick={handleLogout}
            className="w-full p-4 flex items-center gap-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-colors rounded-sm text-xs font-bold"
          >
            <LogOut size={16} /> LOGOUT_PROTOCOL
          </button>
        </div>
      </aside>

      {/* Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-black/20">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_green]" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">System_Status: Optimal</span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => window.open('/', '_blank')}
              className="flex items-center gap-2 text-[10px] font-bold text-[#00f3ff] hover:text-white transition-colors border border-[#00f3ff]/30 px-3 py-1.5 rounded-sm"
            >
              <Eye size={14} /> LIVE_PREVIEW
            </button>
            <div className="relative group">
               <Bell size={20} className="text-white/40 cursor-pointer group-hover:text-white" />
               <AnimatePresence>
                 {notifications.length > 0 && (
                   <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff00ff] rounded-full" />
                 )}
               </AnimatePresence>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-bold text-white uppercase">{auth.currentUser?.displayName || 'ADMIN'}</p>
                <p className="text-[8px] text-white/30 uppercase tracking-widest">Root_Access</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-[#00f3ff]/30 overflow-hidden bg-white/5 flex items-center justify-center">
                {auth.currentUser?.photoURL ? (
                  <img src={auth.currentUser.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Activity size={20} className="text-[#00f3ff]/40" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardOverview stats={stats} messagesCount={messages.length} projectsCount={projects.length} />}
            {activeTab === 'challenges' && <ChallengeManager challenges={challenges} />}
            {activeTab === 'vault' && <VaultManager items={vaultItems} />}
            {activeTab === 'projects' && <ProjectManager projects={projects} />}
            {activeTab === 'skills' && <SkillManager skills={skills} />}
            {activeTab === 'blog' && <BlogManager posts={blogPosts} />}
            {activeTab === 'theme' && <ThemeManager settings={settings} />}
            {activeTab === 'assets' && <AssetManager projects={projects} posts={blogPosts} settings={settings} />}
            {activeTab === 'seo' && <SeoManager settings={settings} />}
            {activeTab === 'music' && <MusicManager settings={settings} />}
            {activeTab === 'contacts' && <ContactManager contacts={contacts} />}
            {activeTab === 'messages' && <MessagesList messages={messages} />}
            {activeTab === 'analytics' && <AnalyticsPanel logs={analyticsLogs} />}
            {activeTab === 'settings' && <SettingsManager settings={settings} />}
            {activeTab === 'system' && <SystemMonitor settings={settings} logs={analyticsLogs} />}
            {activeTab === 'logs' && <LogViewer logs={systemLogs} />}
          </AnimatePresence>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f3ff]/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#ff00ff]/5 blur-[80px] pointer-events-none" />
      </main>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, active, onClick, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full p-4 flex items-center justify-between rounded-sm transition-all group ${
        active 
          ? 'bg-[#00f3ff]/10 text-[#00f3ff] border-l-2 border-[#00f3ff]' 
          : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon size={18} className={active ? 'animate-pulse' : ''} />
        <span className="text-xs font-bold tracking-[0.2em]">{label}</span>
      </div>
      {count > 0 && (
        <span className="bg-[#ff00ff] text-white text-[8px] px-1.5 py-0.5 rounded-full shadow-[0_0_10px_#ff00ff]">
          {count}
        </span>
      )}
    </button>
  );
}

function DashboardOverview({ stats, messagesCount, projectsCount }: any) {
  const liveVisitors = stats?.liveVisitors || 0;
  const totalVisits = stats?.totalVisits || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="REALTIME_USERS" 
          value={liveVisitors} 
          icon={Activity} 
          color="#00f3ff" 
          trend="+5%"
        />
        <StatCard 
          label="TOTAL_TRAFFIC" 
          value={totalVisits} 
          icon={TrendingUp} 
          color="#ff00ff" 
          trend="+12%"
        />
        <StatCard 
          label="PROJECT_LOAD" 
          value={projectsCount} 
          icon={Briefcase} 
          color="#9d00ff" 
        />
        <StatCard 
          label="SIGNAL_PACKETS" 
          value={messagesCount} 
          icon={MessageSquare} 
          color="#22c55e" 
        />
      </div>

      {/* Neural Network Visualization */}
      <div className="glass-card p-10 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff]/5 to-transparent pointer-events-none" />
         <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-black tracking-[0.4em] text-[#00f3ff] uppercase flex items-center gap-2">
                  <Layers size={14} /> NEURAL_CONNECTIVITY_MAP
               </h3>
               <span className="text-[8px] text-white/20 font-mono tracking-widest uppercase italic">Type: Adaptive_Grid | Status: Online</span>
            </div>

            <div className="grid grid-cols-8 gap-4 h-48 lg:h-64">
               {[...Array(64)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0.1 }}
                    animate={{ 
                      opacity: [0.1, Math.random() * 0.8 + 0.2, 0.1],
                      scale: [1, 1.2, 1],
                      backgroundColor: Math.random() > 0.8 ? '#00f3ff' : 'transparent'
                    }}
                    transition={{ 
                      duration: Math.random() * 3 + 2, 
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                    className={`border border-white/5 relative group/node`}
                  >
                     <div className="absolute inset-0 opacity-0 group-hover/node:opacity-100 bg-[#00f3ff]/20 transition-opacity" />
                  </motion.div>
               ))}
               {/* Decorative lines between nodes (visual-only) */}
               <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-20">
                  <div className="w-full h-full border border-[#00f3ff]/10 rotate-45 scale-150" />
                  <div className="w-full h-full border border-[#00f3ff]/10 -rotate-45 scale-150" />
               </div>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="hologram-card p-8 border-l-4 border-l-[#00f3ff]">
          <h3 className="text-xs font-bold tracking-[0.4em] text-[#00f3ff] mb-8 uppercase flex items-center gap-2">
            <Activity size={14} /> BANDWIDTH_OSCILLATION
          </h3>
          <div className="h-64 flex items-end gap-2 pb-2">
             {[...Array(20)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.random() * 80 + 20}%` }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: i * 0.05 }}
                  className="flex-1 bg-[#00f3ff]/10 border-t border-[#00f3ff]/40 relative group"
                >
                   <div className="absolute inset-0 bg-[#00f3ff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
             ))}
          </div>
        </div>

        <div className="hologram-card p-8 border-l-4 border-l-[#ff00ff]">
          <h3 className="text-xs font-bold tracking-[0.4em] text-[#ff00ff] mb-8 uppercase flex items-center gap-2">
            <ShieldAlert size={14} /> LIVE_SYSTEM_LOGS
          </h3>
          <div className="space-y-3 font-mono">
             <div className="text-[10px] text-white/40 p-2 bg-white/5 border-l border-green-500 overflow-hidden text-ellipsis whitespace-nowrap">
                [09:42:01] TRAFFIC_IN: SG_NODE (IP_MASKED)
             </div>
             <div className="text-[10px] text-white/40 p-2 bg-white/5 border-l border-yellow-500 overflow-hidden text-ellipsis whitespace-nowrap">
                [09:40:55] CACHE_FETCH: PROJECT_ASSETS_V2
             </div>
             <div className="text-[10px] text-red-400 p-2 bg-red-500/5 border-l border-red-500 overflow-hidden text-ellipsis whitespace-nowrap">
                [09:35:12] AUTH_SCAN: UNAUTHORIZED_ACCESS_PREVENTED
             </div>
             <div className="text-[10px] text-white/40 p-2 bg-white/5 border-l border-[#00f3ff] overflow-hidden text-ellipsis whitespace-nowrap">
                [09:30:00] KERNEL_MSG: SYSTEM_HEARTBEAT_NOMINAL
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


function ImageUpload({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);

  const resizeImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension 800px
        const MAX_DIM = 800;
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress with 0.7 quality
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('FILE_TOO_LARGE: MAX_2MB_ALLOWED');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const compressed = await resizeImage(base64);
        onChange(compressed);
      } catch (err) {
        console.error('Compression failed', err);
        onChange(base64);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{label}</label>
      <div className="flex gap-4">
        <div className="flex-1">
          <input 
            placeholder="Image URL" 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" 
          />
        </div>
        <label className={`cursor-pointer p-3 border border-white/10 hover:border-[#00f3ff] transition-all flex items-center justify-center min-w-[50px] ${isUploading ? 'animate-pulse' : ''}`}>
          <Upload size={16} className={isUploading ? 'text-[#00f3ff]' : 'text-white/40'} />
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>
      {value && (
        <div className="w-20 h-20 border border-white/10 mt-2 overflow-hidden bg-black/50">
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
        </div>
      )}
    </div>
  );
}

function ProjectManager({ projects }: { projects: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    desc: '', 
    tech: '', 
    image: '', 
    link: '', 
    github: '', 
    status: 'published',
    category: 'Full Stack',
    isFeatured: false
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      tech: typeof formData.tech === 'string' ? formData.tech.split(',').map(t => t.trim()) : formData.tech,
      updatedAt: new Date()
    };
    try {
      if (editingId) {
        await updateProject(editingId, data);
        await addLog('PROJECT_UPDATE', `Node ${data.title} reconfigured`);
        alert('NODE_DATA_RECODED');
      } else {
        await addProject({
          ...data,
          createdAt: new Date(),
          order: projects.length + 1
        });
        await addLog('PROJECT_ADD', `New node ${data.title} identified`);
        alert('NEW_NODE_BOOTSTRAPPED');
      }
      closeForm();
    } catch (err: any) {
      console.error('Project add/update error:', err);
      const msg = err.message || '';
      if (msg.includes('permission-denied') || msg.includes('insufficient permissions')) {
        alert('ACCESS_DENIED: Your account is not authorized to write to the grid.');
      } else {
        alert(`NODE_STABILITY_FAILURE: ${msg}`);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('TERMINATE_NODE_PROTOCOL?')) {
      try {
        await deleteProject(id);
        await addLog('PROJECT_DELETE', `Node ${id} terminated from vault`);
        alert('NODE_PURGED');
      } catch (err) {
        alert('PURGE_FAILURE');
      }
    }
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ 
      title: '', 
      desc: '', 
      tech: '', 
      image: '', 
      link: '', 
      github: '', 
      status: 'published', 
      category: 'Full Stack',
      isFeatured: false
    });
  };

  const startEdit = (proj: any) => {
    setEditingId(proj.id);
    setFormData({ 
      title: proj.title, 
      desc: proj.desc, 
      tech: proj.tech.join(', '), 
      image: proj.image, 
      link: proj.link || '', 
      github: proj.github || '',
      status: proj.status || 'published',
      category: proj.category || 'Full Stack',
      isFeatured: proj.isFeatured || false
    });
    setIsAdding(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter">PROJECT_VAULT</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Manage public neural nodes</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#00f3ff] text-black font-bold text-xs hover:bg-white transition-all shadow-[0_0_15px_#00f3ff]"
        >
          <Plus size={16} /> ADD_NEW_NODE
        </button>
      </div>

      {isAdding && (
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="hologram-card p-8 border-2 border-[#00f3ff]/30">
            <form onSubmit={handleAdd} className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Title</label>
                    <input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Technologies</label>
                    <input placeholder="Tech (comma separated)" value={formData.tech} onChange={e => setFormData({...formData, tech: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" required />
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none">
                       <option value="Full Stack">Full Stack</option>
                       <option value="Frontend">Frontend</option>
                       <option value="Backend">Backend</option>
                       <option value="Graphics">Graphics</option>
                       <option value="Cybersec">Cybersec</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none">
                       <option value="published">PUBLISHED</option>
                       <option value="draft">DRAFT</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Featured</label>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                      className={`w-full p-3 border border-white/10 text-[10px] font-bold transition-all ${formData.isFeatured ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]' : 'text-white/20'}`}
                    >
                      {formData.isFeatured ? 'FEATURED_ACTIVE' : 'NOT_FEATURED'}
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                 <ImageUpload label="Project Image" value={formData.image} onChange={val => setFormData({...formData, image: val})} />
                 <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Live Link</label>
                      <input placeholder="Project Link" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">GitHub link</label>
                      <input placeholder="GitHub URL" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" />
                    </div>
                 </div>
               </div>
               
               <div className="space-y-2">
                 <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Description</label>
                 <textarea placeholder="Description" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none h-24" required />
               </div>

               <div className="flex justify-end gap-4">
                  <button type="button" onClick={closeForm} className="text-xs text-white/40 hover:text-white">CANCEL</button>
                  <button type="submit" className="bg-[#00f3ff] text-black px-6 py-2 text-xs font-bold">
                    {editingId ? 'COMMIT_CHANGES' : 'INIT_SAVE'}
                  </button>
               </div>
            </form>
         </motion.div>
      )}

      <div className="grid gap-4">
        {projects.map((proj) => (
          <div key={proj.id} className="hologram-card p-6 flex items-center justify-between group hover:border-[#00f3ff]/40 transition-all">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-white/5 border border-white/10 overflow-hidden relative flex items-center justify-center">
                  {proj.image ? (
                    <img src={proj.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  ) : (
                    <Briefcase size={24} className="text-white/10" />
                  )}
                  {proj.isFeatured && (
                    <div className="absolute top-0 right-0 p-1 bg-[#ff00ff] text-white text-[6px] font-black italic">STAR</div>
                  )}
               </div>
               <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-white group-hover:text-[#00f3ff] transition-colors">{proj.title}</h4>
                    <span className={`text-[8px] px-1 border ${proj.status === 'published' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>
                      {proj.status?.toUpperCase()}
                    </span>
                    <span className="text-[8px] text-white/20 uppercase tracking-widest bg-white/5 px-1">{proj.category}</span>
                  </div>
                  <p className="text-[10px] text-white/40 mt-1 line-clamp-1">{proj.desc}</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={() => startEdit(proj)} className="p-2 text-white/40 hover:text-[#00f3ff] transition-all hover:scale-110"><Edit3 size={16} /></button>
               <button onClick={() => handleDelete(proj.id)} className="p-2 text-white/40 hover:text-red-500 transition-all hover:scale-110"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}


function SkillManager({ skills }: { skills: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    level: 50, 
    order: 0,
    category: 'Technical'
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSkill(editingId, formData);
        await addLog('SKILL_UPDATE', `Protocol ${formData.name} recalibrated`);
        alert('PROTOCOL_RECODED');
      } else {
        await addSkill({
          ...formData,
          order: skills.length + 1
        });
        await addLog('SKILL_ADD', `New protocol ${formData.name} initialized`);
        alert('NEW_PROTOCOL_BOOTSTRAPPED');
      }
      closeForm();
    } catch (err: any) {
      console.error('Skill operation error:', err);
      if (err.message?.includes('permission-denied') || err.message?.includes('insufficient permissions')) {
        alert('ACCESS_DENIED: Neutral protocol access restricted.');
      } else {
        alert(`PROTOCOL_COMMIT_FAILURE: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('TERMINATE_PROTOCOL?')) {
      try {
        await deleteSkill(id);
        alert('PROTOCOL_TERMINATED');
      } catch (err) {
        alert('TERMINATION_FAILURE');
      }
    }
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', level: 50, order: 0, category: 'Technical' });
  };

  const startEdit = (skill: any) => {
    setEditingId(skill.id);
    setFormData({ 
      name: skill.name, 
      level: skill.level, 
      order: skill.order,
      category: skill.category || 'Technical'
    });
    setIsAdding(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter">PROTOCOL_ENGINE</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Configure neural strengths</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#ff00ff] text-white font-bold text-xs hover:bg-white hover:text-black transition-all shadow-[0_0_15px_#ff00ff]"
        >
          <Plus size={16} /> NEW_PROTOCOL
        </button>
      </div>

      {isAdding && (
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="hologram-card p-8 border-2 border-[#ff00ff]/30">
            <form onSubmit={handleAdd} className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Skill Name</label>
                    <input placeholder="Skill Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#ff00ff] outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Category</label>
                    <input placeholder="e.g. Technical, Design" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#ff00ff] outline-none" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Strength Level ({formData.level}%)</label>
                    <input type="range" min="0" max="100" value={formData.level} onChange={e => setFormData({...formData, level: parseInt(e.target.value)})} className="w-full accent-[#ff00ff] mt-2" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Sort Order</label>
                    <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#ff00ff] outline-none" />
                  </div>
               </div>

               <div className="flex justify-end gap-4">
                  <button type="button" onClick={closeForm} className="text-xs text-white/40 hover:text-white">CANCEL</button>
                  <button type="submit" className="bg-[#ff00ff] text-white px-6 py-2 text-xs font-bold">
                    {editingId ? 'RECODE_PROTOCOL' : 'BOOTSTRAP_PROTOCOL'}
                  </button>
               </div>
            </form>
         </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="hologram-card p-6 flex items-center justify-between group hover:border-[#ff00ff]/40 transition-all border-l-4 border-l-[#ff00ff]">
            <div className="flex-1 mr-4">
              <div className="flex justify-between mb-2">
                <h4 className="font-bold text-white transition-colors uppercase tracking-widest">{skill.name}</h4>
                <span className="text-[#ff00ff] text-xs font-mono">{skill.level}%</span>
              </div>
              <div className="h-1 bg-white/5 relative overflow-hidden">
                <div className="absolute h-full bg-[#ff00ff]" style={{ width: `${skill.level}%` }} />
              </div>
              <p className="text-[8px] text-white/20 mt-2 uppercase tracking-widest font-mono">{skill.category || 'GENERAL'}</p>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => startEdit(skill)} className="p-2 text-white/40 hover:text-[#00f3ff] transition-colors"><Edit3 size={14} /></button>
               <button onClick={() => handleDelete(skill.id)} className="p-2 text-white/40 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MessagesList({ messages }: { messages: any[] }) {
  const handleDeleteMessage = async (id: string, name: string) => {
    if (confirm(`INITIATE_PURGE: Message from ${name}?`)) {
      try {
        await deleteMessage(id);
        alert('SIGNAL_SUCCESSFULLY_PURGED');
        await addLog('MESSAGE_DELETED', `Signal from ${name} purged from database`);
      } catch (err: any) {
        console.error('Delete message error:', err);
        const errorData = err.message.startsWith('{') ? JSON.parse(err.message) : { error: err.message };
        alert(`PURGE_PROTOCOL_FAILED: ${errorData.error || 'Unknown Error'}`);
      }
    }
  };

  const handleReply = (msg: any) => {
    const subject = encodeURIComponent(`RE: Message from Portfolio - ${msg.name}`);
    const body = encodeURIComponent(`Hello ${msg.name},\n\nRegarding your message: "${msg.message}"\n\n---`);
    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
    addLog('MESSAGE_REPLY_INIT', `Mail protocol launched for ${msg.email}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter">SIGINT_LOGS</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Intercepted signal packets</p>
        </div>
        {messages.length > 0 && (
          <button 
            onClick={async () => {
              if (confirm('WIPE_ALL_SIGNAL_PACKETS? THIS_ACTION_IS_IRREVERSIBLE.')) {
                try {
                  await clearAllMessages();
                  await addLog('MESSAGES_WIPED', 'All intercepted signals purged from vault');
                  alert('DATABASE_WIPED_CLEAN');
                } catch (err: any) {
                  console.error('Wipe messages error:', err);
                  const errorData = err.message.startsWith('{') ? JSON.parse(err.message) : { error: err.message };
                  alert(`WIPE_PROTOCOL_FAILED: ${errorData.error || 'Unknown Error'}`);
                }
              }
            }}
            className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-[10px] font-bold uppercase tracking-widest rounded-sm"
          >
            <Trash2 size={14} /> WIPE_ALL_SIGNALS
          </button>
        )}
      </div>

      <div className="space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="glass-card p-8 border-l-4 border-l-[#ff00ff]/30 hover:border-l-[#ff00ff] transition-all relative group">
             <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-[#ff00ff]/10 rounded-full flex items-center justify-center text-[#ff00ff] group-hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] transition-all">
                      <Terminal size={18} />
                   </div>
                   <div>
                      <h4 className="font-bold text-[#ff00ff]">{msg.name}</h4>
                      <p className="text-[10px] text-white/40">{msg.email}</p>
                   </div>
                </div>
                <div className="text-[10px] text-white/20 font-mono italic">
                   {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'NOW'}
                </div>
             </div>
             <p className="text-sm text-white/80 leading-relaxed font-mono bg-white/5 p-4 rounded-sm italic border border-white/5 group-hover:border-[#ff00ff]/20 transition-all">
                {msg.message}
             </p>
             <div className="mt-6 flex justify-end gap-6">
                <button 
                  onClick={() => handleReply(msg)}
                  className="flex items-center gap-2 text-[10px] text-[#00f3ff] hover:text-white transition-colors uppercase font-bold tracking-widest"
                >
                   <Send size={12} /> INITIALIZE_REPLY
                </button>
                <button 
                  id={`delete-msg-${msg.id}`}
                  onClick={() => handleDeleteMessage(msg.id, msg.name)} 
                  className="flex items-center gap-2 text-[10px] text-red-500/50 hover:text-red-500 transition-colors uppercase font-bold tracking-widest p-2 -m-2"
                >
                   <Trash2 size={12} /> DELETE_MESSAGE
                </button>
             </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="p-20 text-center text-white/10 italic text-sm uppercase tracking-widest border border-dashed border-white/10 rounded-sm">
            NO_INCOMING_SIGNALS_DETECTED
          </div>
        )}
      </div>
    </motion.div>
  );
}

function BlogManager({ posts }: { posts: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', image: '' });
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  const handleAIGenerate = async () => {
    if (!formData.title.trim()) {
      alert('ENTER_TOPIC_IN_TITLE_FIELD_FIRST');
      return;
    }
    setIsAIGenerating(true);
    try {
      const draft = await generateBlogDraft(formData.title);
      setFormData(prev => ({ ...prev, content: draft || prev.content }));
      addLog('AI_ACTION', `Draft generated for topic: ${formData.title}`);
    } catch (err) {
      alert('AI_CONNECTION_FAILURE');
    } finally {
      setIsAIGenerating(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBlogPost(editingId, formData);
        await addLog('BLOG_UPDATE', `Chronicle ${formData.title} revised`);
        alert('CHRONICLE_UPDATED');
      } else {
        await addBlogPost(formData);
        await addLog('BLOG_ADD', `New chronicle ${formData.title} published`);
        alert('CHRONICLE_ENTRY_COMMITTED');
      }
      closeForm();
    } catch (err: any) {
      console.error('Blog error:', err);
      if (err.message?.includes('permission-denied') || err.message?.includes('insufficient permissions')) {
        alert('ACCESS_DENIED: Chronicle access restricted to Level_7 admins.');
      } else {
        alert('COMMIT_FAILURE: Signal lost.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('ERASE_CHRONICLE_DATA?')) {
      try {
        await deleteBlogPost(id);
        alert('DATA_ERASED');
      } catch (err) {
        alert('ERASE_FAILURE');
      }
    }
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: '', content: '', image: '' });
  };

  const startEdit = (post: any) => {
    setEditingId(post.id);
    setFormData({ title: post.title, content: post.content, image: post.image || '' });
    setIsAdding(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter">DATA_CHRONICLES</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Manage grid updates</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#ff00ff] text-white font-bold text-xs hover:bg-white hover:text-black transition-all shadow-[0_0_15px_#ff00ff]"
        >
          <Plus size={16} /> NEW_ENTRY
        </button>
      </div>

      {isAdding && (
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 border-2 border-[#ff00ff]/30">
            <form onSubmit={handleAdd} className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                 <input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-xs focus:border-[#ff00ff] outline-none" required />
                 <ImageUpload label="Blog Image" value={formData.image} onChange={val => setFormData({...formData, image: val})} />
               </div>
               <div className="relative">
                 <textarea placeholder="Content" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#ff00ff] outline-none h-48 custom-scrollbar" required />
                 <button 
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={isAIGenerating}
                  className="absolute bottom-4 right-4 p-2 bg-[#ff00ff]/10 border border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/20 transition-all rounded-sm flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30"
                 >
                   <Sparkles size={14} className={isAIGenerating ? 'animate-spin' : 'animate-pulse'} />
                   {isAIGenerating ? 'PROCESSING...' : 'AI_GENERATE'}
                 </button>
               </div>
               <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-white/40 hover:text-white">CANCEL</button>
                  <button type="submit" className="bg-[#ff00ff] text-white px-6 py-2 text-xs font-bold">COMMIT_ENTRY</button>
               </div>
            </form>
         </motion.div>
      )}

      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="glass-card p-6 flex items-center justify-between group hover:border-[#ff00ff]/40 transition-all">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-white/5 border border-white/10 overflow-hidden">
                  <img src={post.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
               </div>
               <div>
                  <h4 className="font-bold text-white group-hover:text-[#ff00ff] transition-colors">{post.title}</h4>
                  <p className="text-[10px] text-white/40 mt-1 line-clamp-1">{post.content}</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={() => startEdit(post)} className="p-2 text-white/40 hover:text-[#ff00ff] transition-all hover:scale-110"><Edit3 size={16} /></button>
               <button onClick={() => handleDelete(post.id)} className="p-2 text-white/40 hover:text-red-500 transition-all hover:scale-110"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ChallengeManager({ challenges }: { challenges: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    target: '', 
    hint: '', 
    limit: 5,
    order: 0,
    difficulty: 'easy'
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateChallenge(editingId, formData);
        await addLog('CHALLENGE_UPDATE', `Challenge ${formData.target} updated`);
        alert('CHALLENGE_SYNCED');
      } else {
        await addChallenge({
          ...formData,
          order: challenges.length + 1
        });
        await addLog('CHALLENGE_ADD', `New challenge ${formData.target} deployed`);
        alert('NEW_CHALLENGE_ONLINE');
      }
      closeForm();
    } catch (err: any) {
      alert(`CHALLENGE_FAILURE: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('ERASE_CHALLENGE_PROTOCOL?')) {
      try {
        await deleteChallenge(id);
        alert('CHALLENGE_TERMINATED');
      } catch (err) {
        alert('TERMINATION_FAILURE');
      }
    }
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ target: '', hint: '', limit: 5, order: 0, difficulty: 'easy' });
  };

  const startEdit = (challenge: any) => {
    setEditingId(challenge.id);
    setFormData({ 
      target: challenge.target, 
      hint: challenge.hint, 
      limit: challenge.limit,
      order: challenge.order,
      difficulty: challenge.difficulty || 'easy'
    });
    setIsAdding(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter">CHALLENGE_VAULT</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">Configure hacking protocols</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#00f3ff] text-black font-bold text-xs hover:bg-white transition-all shadow-[0_0_15px_#00f3ff]"
        >
          <Plus size={16} /> NEW_PROTOCOL
        </button>
      </div>

      {isAdding && (
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 border-2 border-[#00f3ff]/30">
            <form onSubmit={handleAdd} className="space-y-6">
               <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Target Keyword (Answer)</label>
                    <input placeholder="e.g. ROOT" value={formData.target} onChange={e => setFormData({...formData, target: e.target.value.toUpperCase()})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none uppercase" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Difficulty</label>
                    <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none">
                       <option value="easy">EASY</option>
                       <option value="medium">MEDIUM</option>
                       <option value="hard">HARD</option>
                       <option value="expert">EXPERT</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Attempts Limit</label>
                    <input type="number" min="1" value={formData.limit} onChange={e => setFormData({...formData, limit: parseInt(e.target.value)})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" required />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Hint / Clue</label>
                  <textarea placeholder="Provide some clue for the user..." value={formData.hint} onChange={e => setFormData({...formData, hint: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none h-24" required />
               </div>

               <div className="flex justify-end gap-4">
                  <button type="button" onClick={closeForm} className="text-xs text-white/40 hover:text-white">CANCEL</button>
                  <button type="submit" className="bg-[#00f3ff] text-black px-6 py-2 text-xs font-bold">
                    {editingId ? 'SYNC_PROTOCOL' : 'DEPLOY_PROTOCOL'}
                  </button>
               </div>
            </form>
         </motion.div>
      )}

      <div className="grid gap-4">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="glass-card p-6 flex items-center justify-between group hover:border-[#00f3ff]/40 transition-all">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-[#00f3ff]">
                  <Lock size={20} />
               </div>
               <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-white group-hover:text-[#00f3ff] transition-colors tracking-widest uppercase">{challenge.target}</h4>
                    <span className={`text-[8px] px-1 border border-[#00f3ff]/20 text-[#00f3ff]/60 uppercase tracking-widest`}>{challenge.difficulty || 'easy'}</span>
                  </div>
                  <p className="text-[10px] text-white/40 mt-1 line-clamp-1 italic">{challenge.hint}</p>
                  <p className="text-[8px] text-[#00f3ff]/50 mt-1 uppercase tracking-widest">LIMIT: {challenge.limit} ATTEMPTS</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={() => startEdit(challenge)} className="p-2 text-white/40 hover:text-[#00f3ff] transition-all hover:scale-110"><Edit3 size={16} /></button>
               <button onClick={() => handleDelete(challenge.id)} className="p-2 text-white/40 hover:text-red-500 transition-all hover:scale-110"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function VaultManager({ items }: { items: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    type: 'text',
    order: 0
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateVaultItem(editingId, formData);
        await addLog('VAULT_UPDATE', `Item ${formData.title} modified`);
        alert('VAULT_SYNCED');
      } else {
        await addVaultItem({
          ...formData,
          order: items.length + 1
        });
        await addLog('VAULT_ADD', `New classified item: ${formData.title}`);
        alert('VAULT_ITEM_STORED');
      }
      closeForm();
    } catch (err: any) {
      alert(`VAULT_ERROR: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('ERASE_CLASSIFIED_DATA?')) {
      try {
        await deleteVaultItem(id);
        alert('DATA_ERASED');
      } catch (err) {
        alert('ERASE_FAILURE');
      }
    }
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: '', content: '', type: 'text', order: 0 });
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ 
      title: item.title, 
      content: item.content, 
      type: item.type,
      order: item.order
    });
    setIsAdding(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter">HIDDEN_VAULT</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1 text-[#00f3ff]">Classified data management</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-500 text-black font-bold text-xs hover:bg-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)]"
        >
          <Plus size={16} /> NEW_SECRET
        </button>
      </div>

      {isAdding && (
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 border-2 border-red-500/30">
            <form onSubmit={handleAdd} className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Secret Title</label>
                    <input placeholder="e.g. Hidden Message" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-red-500 outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-red-500 outline-none">
                       <option value="text">TEXT</option>
                       <option value="image">IMAGE_URL</option>
                       <option value="link">HIDDEN_LINK</option>
                       <option value="file">DOWNLOAD_TOKEN</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Secret Content</label>
                  <textarea placeholder="The classified content..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-red-500 outline-none h-32" required />
               </div>

               <div className="flex justify-end gap-4">
                  <button type="button" onClick={closeForm} className="text-xs text-white/40 hover:text-white">ABORT</button>
                  <button type="submit" className="bg-red-500 text-black px-6 py-2 text-xs font-bold">
                    {editingId ? 'RE-ENCRYPT' : 'STORE_SECRET'}
                  </button>
               </div>
            </form>
         </motion.div>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-6 flex items-center justify-between group hover:border-red-500/40 transition-all">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-red-500/5 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Shield size={20} />
               </div>
               <div>
                  <h4 className="font-bold text-white group-hover:text-red-500 transition-colors tracking-widest uppercase">{item.title}</h4>
                  <p className="text-[10px] text-white/40 mt-1 line-clamp-1 italic text-xs font-mono">{item.type.toUpperCase()} // {item.content}</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={() => startEdit(item)} className="p-2 text-white/40 hover:text-[#00f3ff] transition-all"><Edit3 size={16} /></button>
               <button onClick={() => handleDelete(item.id)} className="p-2 text-white/40 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ContactManager({ contacts }: { contacts: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ platform: '', url: '' });

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return GithubIcon;
    if (p.includes('linkedin')) return LinkedinIcon;
    if (p.includes('twitter') || p.includes('x.com')) return TwitterIcon;
    if (p.includes('facebook')) return Facebook;
    if (p.includes('instagram')) return Instagram;
    if (p.includes('youtube')) return Youtube;
    if (p.includes('mail')) return Mail;
    if (p.includes('phone') || p.includes('call')) return Phone;
    if (p.includes('whatsapp')) return MessageCircle;
    if (p.includes('discord')) return MessageSquare;
    if (p.includes('telegram')) return Send;
    if (p.includes('dribbble')) return Dribbble;
    if (p.includes('figma')) return Figma;
    if (p.includes('slack')) return Slack;
    if (p.includes('twitch')) return Twitch;
    if (p.includes('spotify') || p.includes('tiktok') || p.includes('music')) return Music;
    return LinkIcon;
  };

  const detectPlatform = (url: string) => {
    const u = url.toLowerCase();
    if (u.includes('github.com')) return 'GitHub';
    if (u.includes('linkedin.com')) return 'LinkedIn';
    if (u.includes('twitter.com') || u.includes('x.com')) return 'Twitter';
    if (u.includes('facebook.com')) return 'Facebook';
    if (u.includes('instagram.com')) return 'Instagram';
    if (u.includes('youtube.com')) return 'YouTube';
    if (u.includes('whatsapp.com') || u.includes('wa.me')) return 'WhatsApp';
    if (u.includes('discord.com') || u.includes('discord.gg')) return 'Discord';
    if (u.includes('t.me') || u.includes('telegram.org')) return 'Telegram';
    if (u.includes('dribbble.com')) return 'Dribbble';
    if (u.includes('figma.com')) return 'Figma';
    if (u.includes('slack.com')) return 'Slack';
    if (u.includes('twitch.tv')) return 'Twitch';
    if (u.includes('spotify.com')) return 'Spotify';
    if (u.includes('tiktok.com')) return 'TikTok';
    return '';
  };

  const handleUrlChange = (url: string) => {
    const detected = detectPlatform(url);
    if (detected && !formData.platform) {
      setFormData({ ...formData, url, platform: detected });
    } else {
      setFormData({ ...formData, url });
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateContact(editingId, formData);
        await addLog('CONTACT_UPDATE', `Signal node ${formData.platform} re-routed`);
        alert('SIGNAL_NODE_RECONFIGURED');
      } else {
        await addContact({
          ...formData,
          order: contacts.length + 1
        });
        await addLog('CONTACT_ADD', `New signal node ${formData.platform} broadcasted`);
        alert('NEW_SIGNAL_BROADCAST_READY');
      }
      closeForm();
    } catch (err: any) {
      console.error('Contact error:', err);
      if (err.message?.includes('permission-denied') || err.message?.includes('insufficient permissions')) {
        alert('ACCESS_DENIED: Signal hub reconfiguration restricted.');
      } else {
        alert('BROADCAST_FAILURE: Packet loss.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('DISCONNECT_SIGNAL_NODE?')) {
      try {
        await deleteContact(id);
        alert('SIGNAL_TERMINATED');
      } catch (err) {
        alert('DISCONNECT_FAILURE');
      }
    }
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ platform: '', url: '' });
  };

  const startEdit = (contact: any) => {
    setEditingId(contact.id);
    setFormData({ platform: contact.platform, url: contact.url });
    setIsAdding(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter">SIGNAL_HUBS</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Manage contact nodes</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#00f3ff] text-black font-bold text-xs hover:bg-white transition-all shadow-[0_0_15px_#00f3ff]"
        >
          <Plus size={16} /> NEW_SIGNAL
        </button>
      </div>

      {isAdding && (
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 border-2 border-[#00f3ff]/30">
            <form onSubmit={handleAdd} className="space-y-6">
               <div className="grid grid-cols-[1fr_80px] gap-6 items-start">
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Platform Name</label>
                          <input placeholder="e.g. GitHub, LinkedIn" value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" required />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">URL / Address</label>
                          <input placeholder="https://..." value={formData.url} onChange={e => handleUrlChange(e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" required />
                      </div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col items-center gap-2 pt-6">
                    <div className="w-12 h-12 bg-[#00f3ff]/10 border border-[#00f3ff]/30 flex items-center justify-center text-[#00f3ff]">
                       {(() => {
                         const Icon = getPlatformIcon(formData.platform);
                         return <Icon size={24} />;
                       })()}
                    </div>
                    <span className="text-[8px] text-white/40 uppercase tracking-tighter">Preview</span>
                 </div>
               </div>
               <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-white/40 hover:text-white">CANCEL</button>
                  <button type="submit" className="bg-[#00f3ff] text-black px-6 py-2 text-xs font-bold">BROADCAST_NODE</button>
               </div>
            </form>
         </motion.div>
      )}

      <div className="grid gap-4">
        {contacts.map((contact) => {
          const Icon = getPlatformIcon(contact.platform);
          return (
            <div key={contact.id} className="glass-card p-6 flex items-center justify-between group hover:border-[#00f3ff]/40 transition-all">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-[#00f3ff]">
                    <Icon size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-white group-hover:text-[#00f3ff] transition-colors uppercase tracking-widest">{contact.platform}</h4>
                    <p className="text-[10px] text-white/40 mt-1 line-clamp-1">{contact.url}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => startEdit(contact)} className="p-2 text-white/40 hover:text-[#00f3ff] transition-all hover:scale-110"><Edit3 size={16} /></button>
                 <button onClick={() => handleDelete(contact.id)} className="p-2 text-white/40 hover:text-red-500 transition-all hover:scale-110"><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function SettingsManager({ settings }: { settings: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    alertMessage: '',
    showAlert: false,
    alertType: 'info',
    profileImage: '',
    cvUrl: '',
    maintenanceMode: false,
    siteTitle: 'NEON_HACKER',
    introTitle: 'NEON_HACKER',
    introSubtitle: 'SYSTEM_BOOT_V2.0.9',
    audioOnText: 'AI_ON',
    audioOffText: 'AI_OFF',
    navLinks: [],
    secondaryLinks: [],
    footerText: '© 2026_NEON_GRID_SYSTEMS',
    heroTitle_EN: '',
    heroTitle_BN: '',
    heroAccess_EN: '',
    heroAccess_BN: '',
    aboutTitle_EN: '',
    aboutTitle_BN: '',
    aboutText_EN: '',
    aboutText_BN: '',
    adminName: 'NEON_HACKER',
    adminRole: 'SYSTEMS ARCHITECT',
    adminLocation: 'NEO_TOKYO_GRID',
    adminExperience: '7+ CYCLES',
    ambientMusicUrl: '',
    currentlyCoding: 'Portfolio_V3.tsx',
    bgText: 'Rk Hacker',
    projectsTitle_EN: '',
    projectsTitle_BN: '',
    skillsTitle_EN: '',
    skillsTitle_BN: '',
    contactTitle_EN: '',
    contactTitle_BN: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        alertMessage: settings.alertMessage || '',
        showAlert: settings.showAlert || false,
        alertType: settings.alertType || 'info',
        profileImage: settings.profileImage || '',
        cvUrl: settings.cvUrl || '',
        maintenanceMode: settings.maintenanceMode || false,
        siteTitle: settings.siteTitle || 'NEON_HACKER',
        introTitle: settings.introTitle || 'NEON_HACKER',
        introSubtitle: settings.introSubtitle || 'SYSTEM_BOOT_V2.0.9',
        audioOnText: settings.audioOnText || 'AI_ON',
        audioOffText: settings.audioOffText || 'AI_OFF',
        navLinks: settings.navLinks || [
          { name: 'HOME', href: '/' },
          { name: 'ABOUT', href: '/about' },
          { name: 'PROJECTS', href: '/projects' },
          { name: 'SKILLS', href: '/skills' },
          { name: 'BLOG', href: '/blog' },
          { name: 'CHALLENGES', href: '/challenges' }, // Added challenges
          { name: 'SOCIALS', href: '/socials' },
          { name: 'CONTACT', href: '/contact' },
        ],
        secondaryLinks: settings.secondaryLinks || [],
        footerText: settings.footerText || '© 2026_NEON_GRID_SYSTEMS',
        heroTitle_EN: settings.heroTitle_EN || '',
        heroTitle_BN: settings.heroTitle_BN || '',
        heroAccess_EN: settings.heroAccess_EN || '',
        heroAccess_BN: settings.heroAccess_BN || '',
        aboutTitle_EN: settings.aboutTitle_EN || '',
        aboutTitle_BN: settings.aboutTitle_BN || '',
        aboutText_EN: settings.aboutText_EN || '',
        aboutText_BN: settings.aboutText_BN || '',
        adminName: settings.adminName || 'NEON_HACKER',
        adminRole: settings.adminRole || 'SYSTEMS ARCHITECT',
        adminLocation: settings.adminLocation || 'NEO_TOKYO_GRID',
        adminExperience: settings.adminExperience || '7+ CYCLES',
        ambientMusicUrl: settings.ambientMusicUrl || '',
        currentlyCoding: settings.currentlyCoding || 'Portfolio_V3.tsx',
        bgText: settings.bgText || 'Rk Hacker',
        projectsTitle_EN: settings.projectsTitle_EN || '',
        projectsTitle_BN: settings.projectsTitle_BN || '',
        skillsTitle_EN: settings.skillsTitle_EN || '',
        skillsTitle_BN: settings.skillsTitle_BN || '',
        contactTitle_EN: settings.contactTitle_EN || '',
        contactTitle_BN: settings.contactTitle_BN || '',
      });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      alert('SYSTEM_PROTOCOLS_SYNCED');
    } catch (err: any) {
      console.error('Settings save error:', err);
      if (err.message?.includes('quota-exceeded')) {
        alert('CRITICAL_FAILURE: FIRESTORE_QUOTA_EXCEEDED');
      } else if (err.message?.includes('permission-denied')) {
        alert('ACCESS_DENIED: INSUFFICIENT_PERMISSIONS');
      } else if (err.message?.includes('size-limit')) {
        alert('PAYLOAD_TOO_LARGE: REDUCE_IMAGE_SIZE');
      } else {
        alert('LINK_FAILURE: DATA_NOT_COMMITTED. Check console for details.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl pb-20"
    >
      <div className="mb-10">
        <h2 className="text-2xl font-black italic tracking-tighter text-[#00f3ff]">SYSTEM_CONFIGURATION</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Global overrides and emergency protocols</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="hologram-card p-10 border-2 border-[#00f3ff]/20 space-y-8 relative">
          <div className="flex items-center justify-between border-b border-[#00f3ff]/20 pb-2">
            <h3 className="text-xs font-bold text-[#00f3ff] uppercase tracking-widest">BIO_ENCRYPTION_STREAM</h3>
            <button type="submit" disabled={isSaving} className="text-[9px] font-bold text-[#00f3ff] border border-[#00f3ff]/30 px-3 py-1 hover:bg-[#00f3ff]/10 disabled:opacity-50">SYNC_SECTION</button>
          </div>
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Site_Title</label>
                  <input value={formData.siteTitle} onChange={e => setFormData({...formData, siteTitle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Footer_Text</label>
                  <input value={formData.footerText} onChange={e => setFormData({...formData, footerText: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" />
                </div>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Name</label>
                  <input value={formData.adminName} onChange={e => setFormData({...formData, adminName: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Role</label>
                  <input value={formData.adminRole} onChange={e => setFormData({...formData, adminRole: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Location</label>
                  <input value={formData.adminLocation} onChange={e => setFormData({...formData, adminLocation: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Experience</label>
                  <input value={formData.adminExperience} onChange={e => setFormData({...formData, adminExperience: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none" />
                </div>
             </div>

             <ImageUpload 
                label="Profile Picture" 
                value={formData.profileImage} 
                onChange={val => setFormData({...formData, profileImage: val})} 
             />

             <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Ambient_Music_URL</label>
                <input 
                  placeholder="Direct MP3 link" 
                  value={formData.ambientMusicUrl} 
                  onChange={e => setFormData({...formData, ambientMusicUrl: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none font-mono"
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Live_Coding_Status</label>
                <input 
                  placeholder="e.g. Portfolio_V3.tsx" 
                  value={formData.currentlyCoding} 
                  onChange={e => setFormData({...formData, currentlyCoding: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none font-mono"
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Background_Text</label>
                <input 
                  placeholder="e.g. Rk Hacker" 
                  value={formData.bgText} 
                  onChange={e => setFormData({...formData, bgText: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none font-mono"
                />
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Intro_AI_Title (Cinematic)</label>
                  <input 
                    placeholder="e.g. NEON_HACKER" 
                    value={formData.introTitle} 
                    onChange={e => setFormData({...formData, introTitle: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Intro_Sub_Text</label>
                  <input 
                    placeholder="e.g. SYSTEM_BOOT_V2.0.9" 
                    value={formData.introSubtitle} 
                    onChange={e => setFormData({...formData, introSubtitle: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none font-mono"
                  />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Audio_ON_Label</label>
                  <input 
                    placeholder="e.g. AI_ON" 
                    value={formData.audioOnText} 
                    onChange={e => setFormData({...formData, audioOnText: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Audio_OFF_Label</label>
                  <input 
                    placeholder="e.g. AI_OFF" 
                    value={formData.audioOffText} 
                    onChange={e => setFormData({...formData, audioOffText: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none font-mono"
                  />
                </div>
             </div>

             <div className="space-y-4 p-4 border border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Navigation_Menu_Links (Primary)</label>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, navLinks: [...formData.navLinks, { name: '', href: '', isExternal: false }]})}
                    className="text-[9px] font-mono text-[#00f3ff] hover:bg-[#00f3ff]/10 px-2 py-1 border border-[#00f3ff]/20 transition-colors uppercase"
                  >
                    + Add_Link
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.navLinks || []).map((link: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start bg-black/40 p-2 border border-white/5">
                      <div className="flex-1 space-y-2">
                        <input 
                          placeholder="Label (e.g. HOME)" 
                          value={link.name} 
                          onChange={e => {
                            const newLinks = [...formData.navLinks];
                            newLinks[idx].name = e.target.value;
                            setFormData({...formData, navLinks: newLinks});
                          }}
                          className="w-full bg-black/50 border border-white/10 p-2 text-[10px] focus:border-[#00f3ff] outline-none font-mono"
                        />
                        <input 
                          placeholder="Path/URL (e.g. /about or https://...)" 
                          value={link.href} 
                          onChange={e => {
                            const newLinks = [...formData.navLinks];
                            newLinks[idx].href = e.target.value;
                            setFormData({...formData, navLinks: newLinks});
                          }}
                          className="w-full bg-black/50 border border-white/10 p-2 text-[10px] focus:border-[#00f3ff] outline-none font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={link.isExternal} 
                            onChange={e => {
                              const newLinks = [...formData.navLinks];
                              newLinks[idx].isExternal = e.target.checked;
                              setFormData({...formData, navLinks: newLinks});
                            }}
                            className="w-3 h-3 bg-black border border-white/20"
                          />
                          <span className="text-[9px] font-mono text-white/30 group-hover:text-white/50 transition-colors">EXT</span>
                        </label>
                        <button 
                          type="button"
                          onClick={() => {
                            const newLinks = formData.navLinks.filter((_: any, i: number) => i !== idx);
                            setFormData({...formData, navLinks: newLinks});
                          }}
                          className="text-red-500/50 hover:text-red-500 p-1 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="space-y-4 p-4 border border-[#ff00ff]/10 bg-[#ff00ff]/[0.02]">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-[#ff00ff]/40 uppercase tracking-widest">Extra_Menu_Links (Secondary)</label>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, secondaryLinks: [...formData.secondaryLinks, { name: '', href: '', isExternal: false }]})}
                    className="text-[9px] font-mono text-[#ff00ff] hover:bg-[#ff00ff]/10 px-2 py-1 border border-[#ff00ff]/20 transition-colors uppercase"
                  >
                    + Add_Aleda_Link
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.secondaryLinks || []).map((link: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start bg-black/40 p-2 border border-white/5">
                      <div className="flex-1 space-y-2">
                        <input 
                          placeholder="Label (e.g. SERVICES)" 
                          value={link.name} 
                          onChange={e => {
                            const newLinks = [...formData.secondaryLinks];
                            newLinks[idx].name = e.target.value;
                            setFormData({...formData, secondaryLinks: newLinks});
                          }}
                          className="w-full bg-black/50 border border-white/10 p-2 text-[10px] focus:border-[#ff00ff] outline-none font-mono"
                        />
                        <input 
                          placeholder="Path/URL" 
                          value={link.href} 
                          onChange={e => {
                            const newLinks = [...formData.secondaryLinks];
                            newLinks[idx].href = e.target.value;
                            setFormData({...formData, secondaryLinks: newLinks});
                          }}
                          className="w-full bg-black/50 border border-white/10 p-2 text-[10px] focus:border-[#ff00ff] outline-none font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={link.isExternal} 
                            onChange={e => {
                              const newLinks = [...formData.secondaryLinks];
                              newLinks[idx].isExternal = e.target.checked;
                              setFormData({...formData, secondaryLinks: newLinks});
                            }}
                            className="w-3 h-3 bg-black border border-white/20"
                          />
                          <span className="text-[9px] font-mono text-white/30 group-hover:text-white/50 transition-colors">EXT</span>
                        </label>
                        <button 
                          type="button"
                          onClick={() => {
                            const newLinks = formData.secondaryLinks.filter((_: any, i: number) => i !== idx);
                            setFormData({...formData, secondaryLinks: newLinks});
                          }}
                          className="text-red-500/50 hover:text-red-500 p-1 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">CV / Resume_Link</label>
                <input 
                  placeholder="Google Drive link or PDF URL" 
                  value={formData.cvUrl} 
                  onChange={e => setFormData({...formData, cvUrl: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none font-mono"
                />
             </div>
          </div>
        </div>

        <div className="hologram-card p-10 border-2 border-red-500/20 space-y-8 relative">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
            <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest">MAINTENANCE_OVERRIDE</h3>
            <button type="submit" disabled={isSaving} className="text-[9px] font-bold text-red-500 border border-red-500/30 px-3 py-1 hover:bg-red-500/10 disabled:opacity-50">SYNC_SECTION</button>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10">
            <div>
              <p className="text-xs font-bold uppercase text-red-500">Maintenance_Mode</p>
              <p className="text-[10px] text-white/30 mt-1 uppercase">Redirect all traffic to status page</p>
            </div>
            <button 
              type="button"
              onClick={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})}
              className={`w-12 h-6 rounded-full relative transition-colors ${formData.maintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.maintenanceMode ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="glass-card p-10 border-2 border-[#ff00ff]/20 space-y-8 relative">
          <div className="flex items-center justify-between border-b border-[#ff00ff]/20 pb-2">
            <h3 className="text-xs font-bold text-[#ff00ff] uppercase tracking-widest">ADVANCED_CONTENT_PATCH</h3>
            <button type="submit" disabled={isSaving} className="text-[9px] font-bold text-[#ff00ff] border border-[#ff00ff]/30 px-3 py-1 hover:bg-[#ff00ff]/10 disabled:opacity-50">SYNC_SECTION</button>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest border-b border-white/5 pb-1">ENGLISH_NODE</p>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">Hero_Title</label>
                <input value={formData.heroTitle_EN} onChange={e => setFormData({...formData, heroTitle_EN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">Hero_Access_Text</label>
                <input value={formData.heroAccess_EN} onChange={e => setFormData({...formData, heroAccess_EN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">About_Section_Title</label>
                <input value={formData.aboutTitle_EN} onChange={e => setFormData({...formData, aboutTitle_EN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">About_Section_Bio</label>
                <textarea value={formData.aboutText_EN} onChange={e => setFormData({...formData, aboutText_EN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none h-24" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">Projects_Section_Title</label>
                <input value={formData.projectsTitle_EN} onChange={e => setFormData({...formData, projectsTitle_EN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">Skills_Section_Title</label>
                <input value={formData.skillsTitle_EN} onChange={e => setFormData({...formData, skillsTitle_EN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">Contact_Section_Title</label>
                <input value={formData.contactTitle_EN} onChange={e => setFormData({...formData, contactTitle_EN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest border-b border-white/5 pb-1">BENGALI_NODE</p>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">Hero_Title</label>
                <input value={formData.heroTitle_BN} onChange={e => setFormData({...formData, heroTitle_BN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">Hero_Access_Text</label>
                <input value={formData.heroAccess_BN} onChange={e => setFormData({...formData, heroAccess_BN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">About_Section_Title</label>
                <input value={formData.aboutTitle_BN} onChange={e => setFormData({...formData, aboutTitle_BN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">About_Section_Bio</label>
                <textarea value={formData.aboutText_BN} onChange={e => setFormData({...formData, aboutText_BN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none h-24" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">Projects_Section_Title</label>
                <input value={formData.projectsTitle_BN} onChange={e => setFormData({...formData, projectsTitle_BN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">Skills_Section_Title</label>
                <input value={formData.skillsTitle_BN} onChange={e => setFormData({...formData, skillsTitle_BN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white/40 uppercase">Contact_Section_Title</label>
                <input value={formData.contactTitle_BN} onChange={e => setFormData({...formData, contactTitle_BN: e.target.value})} className="w-full bg-black/50 border border-white/10 p-2 text-xs focus:border-[#ff00ff] outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-10 border-2 border-white/10 space-y-8 relative">
           <div className="flex items-center justify-between border-b border-white/10 pb-2">
             <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">EMERGENCY_BROADCAST</h3>
             <button type="submit" disabled={isSaving} className="text-[9px] font-bold text-white/60 border border-white/20 px-3 py-1 hover:bg-white/5 disabled:opacity-50">SYNC_SECTION</button>
           </div>
           <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-sm border border-white/5">
                 <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Broadcast_Alert_System</p>
                    <p className="text-[10px] text-white/40 mt-1 uppercase">Toggle global notification banner</p>
                 </div>
                 <button 
                   type="button"
                   onClick={() => setFormData({...formData, showAlert: !formData.showAlert})}
                   className={`w-12 h-6 rounded-full relative transition-colors ${formData.showAlert ? 'bg-[#00f3ff]' : 'bg-white/10'}`}
                 >
                   <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.showAlert ? 'right-1' : 'left-1'}`} />
                 </button>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Payload_Message</label>
                 <textarea 
                   value={formData.alertMessage} 
                   onChange={e => setFormData({...formData, alertMessage: e.target.value})}
                   className="w-full bg-black/50 border border-white/10 p-4 text-xs focus:border-[#00f3ff] outline-none h-24 font-mono italic"
                   placeholder="Enter alert text..."
                 />
              </div>

              <div className="grid grid-cols-3 gap-4">
                 {['info', 'warning', 'danger'].map((type) => (
                   <button
                     key={type}
                     type="button"
                     onClick={() => setFormData({...formData, alertType: type})}
                     className={`p-4 border text-[10px] font-bold uppercase tracking-widest transition-all ${
                       formData.alertType === type 
                         ? 'bg-white/10 border-[#00f3ff] text-[#00f3ff]' 
                         : 'border-white/5 text-white/20 hover:text-white/40'
                     }`}
                   >
                     {type}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <button 
          type="submit" 
          disabled={isSaving}
          className={`w-full text-black font-black py-4 text-sm tracking-[0.4em] transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] sticky bottom-0 z-50 overflow-hidden btn-shimmer ${isSaving ? 'bg-white/50 cursor-not-allowed' : 'bg-[#00f3ff] hover:bg-white'}`}
        >
          {isSaving ? 'SYNCING_DATA...' : 'SYNC_GLOBAL_SETTINGS'}
        </button>
      </form>
    </motion.div>
  );
}

function AnalyticsPanel({ logs }: { logs: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col mb-10">
        <h2 className="text-2xl font-black italic tracking-tighter">TRAFFIC_ANALYTICS</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Deep packet inspection of visitor stream</p>
      </div>

      <div className="hologram-card p-0 overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-white/40 uppercase tracking-widest">
                <th className="p-4">TIMESTAMP</th>
                <th className="p-4">PATH</th>
                <th className="p-4">REFERRER</th>
                <th className="p-4">SESSION_ID</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white/60">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 text-[#00f3ff]">{log.path}</td>
                  <td className="p-4 text-white/40">{log.referrer}</td>
                  <td className="p-4 text-white/20 uppercase">{log.sessionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function SystemMonitor({ settings, logs }: any) {
  const [commands, setCommands] = useState<string[]>(['SSH_LOGIN: SUCCESS', 'SHIELD_PROTOCOL: ACTIVE', 'LISTENING_ON_PORT: 3000']);
  
  const clearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    setCommands([...commands, 'CACHE_WIPE: COMPLETED_SUCCESSFULLY']);
  };

  const toggleMaintenance = async () => {
    const newState = !settings?.maintenanceMode;
    await updateSettings({ maintenanceMode: newState });
    setCommands([...commands, `MAINTENANCE_MODE: ${newState ? 'ENABLED' : 'DISABLED'}`]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
       <div className="flex flex-col mb-10">
        <h2 className="text-2xl font-black italic tracking-tighter">SYSTEM_MONITOR</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Low-level terminal and hardware status</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black border-2 border-white/10 rounded-sm p-6 font-mono text-[11px] h-96 overflow-hidden relative group">
             <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2 text-white/40">
                <Terminal size={14} />
                <span>ROOT@NEON_CORE:~#</span>
             </div>
             <div className="space-y-2 overflow-y-auto h-[80%] custom-scrollbar pr-4">
                {commands.map((cmd, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-primary-neon font-bold">[{new Date().toLocaleTimeString()}]</span>
                    <span className={cmd.includes('FAILED') ? 'text-red-500' : 'text-white/60'}>{cmd}</span>
                  </div>
                ))}
                <div className="animate-pulse text-primary-neon">_</div>
             </div>
             <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={clearCache}
              className="p-4 border border-white/10 bg-white/5 hover:bg-[#00f3ff]/10 hover:border-[#00f3ff]/40 transition-all text-[10px] font-bold flex items-center justify-center gap-3 uppercase tracking-widest"
            >
               <Bell size={14} /> PURGE_LOCAL_CACHE
            </button>
            <button 
              onClick={toggleMaintenance}
              className={`p-4 border transition-all text-[10px] font-bold flex items-center justify-center gap-3 uppercase tracking-widest ${settings?.maintenanceMode ? 'bg-red-500/20 border-red-500 text-red-500' : 'border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/40 opacity-50'}`}
            >
               <ShieldAlert size={14} /> {settings?.maintenanceMode ? 'KILL_MAINTENANCE' : 'INIT_MAINTENANCE'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
           <div className="hologram-card p-6">
              <h4 className="text-[10px] font-bold text-primary-neon uppercase mb-4 tracking-widest">SERVER_CLUSTER_LOAD</h4>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[8px] text-white/40 uppercase">
                      <span>CPU_CORE_0</span>
                      <span>12%</span>
                    </div>
                    <div className="h-1 bg-white/5 relative overflow-hidden">
                       <motion.div animate={{ width: '12%' }} className="absolute h-full bg-primary-neon" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[8px] text-white/40 uppercase">
                      <span>MEM_ALLOC</span>
                      <span>42%</span>
                    </div>
                    <div className="h-1 bg-white/5 relative overflow-hidden">
                       <motion.div animate={{ width: '42%' }} className="absolute h-full bg-[#ff00ff]" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon, color, trend }: any) {
  return (
    <div className="hologram-card p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-sm bg-white/5 border border-white/10 group-hover:border-[#00f3ff]/50 transition-colors">
            <Icon size={20} style={{ color }} />
          </div>
          {trend && (
            <span className="text-[10px] font-bold text-green-500">{trend}</span>
          )}
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">{label}</h3>
          <p className="text-3xl font-black italic tracking-tighter text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function ThemeManager({ settings }: { settings: any }) {
  const [formData, setFormData] = useState({
    primaryColor: '#00f3ff',
    matrixSpeed: 0.75,
    fontStyle: 'Inter'
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        primaryColor: settings.primaryColor || '#00f3ff',
        matrixSpeed: settings.matrixSpeed || 0.75,
        fontStyle: settings.fontStyle || 'Inter'
      });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      await addLog('THEME_UPDATE', `Primary: ${formData.primaryColor}, Speed: ${formData.matrixSpeed}`);
      alert('THEME_PROTOCOLS_UPDATED');
    } catch (err) {
      alert('SYNC_FAILURE');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl space-y-10">
      <div>
        <h2 className="text-2xl font-black italic tracking-tighter text-primary-neon">THEME_CUSTOMIZER</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Aesthetic grid overrides</p>
      </div>

      <form onSubmit={handleSave} className="hologram-card p-10 border-2 border-primary-neon/20 space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Primary_Color</label>
          <div className="flex gap-4 items-center">
            <input 
              type="color" 
              value={formData.primaryColor} 
              onChange={e => setFormData({...formData, primaryColor: e.target.value})} 
              className="w-12 h-12 bg-transparent border-none cursor-pointer"
            />
            <input 
              type="text" 
              value={formData.primaryColor} 
              onChange={e => setFormData({...formData, primaryColor: e.target.value})} 
              className="flex-1 bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none font-mono"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Matrix_Rain_Speed ({formData.matrixSpeed})</label>
          <input 
            type="range" 
            min="0.1" 
            max="2" 
            step="0.05" 
            value={formData.matrixSpeed} 
            onChange={e => setFormData({...formData, matrixSpeed: parseFloat(e.target.value)})} 
            className="w-full accent-[#00f3ff]"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Neural_Font_Subset</label>
          <select 
            value={formData.fontStyle} 
            onChange={e => setFormData({...formData, fontStyle: e.target.value})}
            className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-[#00f3ff] outline-none"
          >
            <option value="Inter">INTER (SANS-SERIF)</option>
            <option value="JetBrains Mono">JETBRAINS_MONO (TECH)</option>
            <option value="Space Grotesk">SPACE_GROTESK (MODERN)</option>
            <option value="Outfit">OUTFIT (REFINED)</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-[#00f3ff] text-black font-black py-4 text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)]">
          COMMIT_AESTHETIC_SYNC
        </button>
      </form>
    </motion.div>
  );
}

function AssetManager({ projects, posts, settings }: any) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'projects' | 'blog' | 'system'>('all');
  
  const allAssets = [
    ...(settings?.profileImage ? [{ url: settings.profileImage, source: 'system', label: 'Profile' }] : []),
    ...(settings?.ogpImage ? [{ url: settings.ogpImage, source: 'system', label: 'SEO_OG' }] : []),
    ...projects.filter((p: any) => p.image).map((p: any) => ({ url: p.image, source: 'projects', label: p.title })),
    ...posts.filter((p: any) => p.image).map((p: any) => ({ url: p.image, source: 'blog', label: p.title }))
  ];

  const filteredAssets = activeFilter === 'all' ? allAssets : allAssets.filter(a => a.source === activeFilter);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('LINK_COPIED_TO_CLIPBOARD');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter text-[#00f3ff]">ASSET_VAULT</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Centralized media repository</p>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-sm border border-white/10">
          {['all', 'projects', 'blog', 'system'].map((f) => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f as any)}
              className={`px-4 py-1.5 text-[8px] font-bold uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-[#00f3ff] text-black' : 'text-white/40 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredAssets.map((asset, i) => (
          <div key={i} className="group relative aspect-square border border-white/10 bg-black overflow-hidden hover:border-[#00f3ff]/50 transition-all">
            <img src={asset.url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-4 text-center">
              <p className="text-[8px] font-bold text-[#00f3ff] mb-2 line-clamp-2">{asset.label}</p>
              <button 
                onClick={() => copyToClipboard(asset.url)}
                className="p-2 bg-white/10 hover:bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/30 rounded-sm mb-2"
              >
                <LinkIcon size={12} />
              </button>
              <span className="text-[6px] text-white/40 uppercase tracking-widest">{asset.source}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SeoManager({ settings }: { settings: any }) {
  const [formData, setFormData] = useState({
    metaDescription: '',
    metaKeywords: '',
    ogpImage: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        metaDescription: settings.metaDescription || '',
        metaKeywords: settings.metaKeywords || '',
        ogpImage: settings.ogpImage || ''
      });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      await addLog('SEO_UPDATE', 'Grid meta parameters re-indexed');
      alert('SEO_SYNC_COMPLETED');
    } catch (err) {
      alert('METADATA_COLLISION_DETECTED');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl space-y-10">
      <div>
        <h2 className="text-2xl font-black italic tracking-tighter text-primary-neon">SEO_ALGORITHM_OPS</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Optimize neural visibility</p>
      </div>

      <form onSubmit={handleSave} className="hologram-card p-10 border-2 border-primary-neon/20 space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Meta_Description</label>
          <textarea 
            value={formData.metaDescription} 
            onChange={e => setFormData({...formData, metaDescription: e.target.value})} 
            className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-primary-neon outline-none h-24 font-mono select-all"
            placeholder="Tell the crawlers who you are..."
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Meta_Keywords</label>
          <input 
            type="text" 
            value={formData.metaKeywords} 
            onChange={e => setFormData({...formData, metaKeywords: e.target.value})} 
            className="w-full bg-black/50 border border-white/10 p-3 text-xs focus:border-primary-neon outline-none font-mono"
            placeholder="developer, hacker, neon, cyberpunk..."
          />
        </div>

        <ImageUpload 
          label="OpenGraph_Image (Card)" 
          value={formData.ogpImage} 
          onChange={val => setFormData({...formData, ogpImage: val})} 
        />

        <button type="submit" className="w-full bg-primary-neon text-black font-black py-4 text-xs tracking-widest hover:bg-white transition-all">
          SYNC_SEO_PARAMETERS
        </button>
      </form>
    </motion.div>
  );
}

function MusicManager({ settings }: { settings: any }) {
  const [url, setUrl] = useState('');
  const presets = [
    { name: 'Tech House Vibes', url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3' },
    { name: 'Cyberpunk Drone', url: 'https://assets.mixkit.co/music/preview/mixkit-cyberpunk-drone-active-loop-2550.mp3' },
    { name: 'Night City', url: 'https://assets.mixkit.co/music/preview/mixkit-night-city-loop-2178.mp3' },
    { name: 'Deep Space', url: 'https://assets.mixkit.co/music/preview/mixkit-deep-space-97.mp3' }
  ];

  useEffect(() => {
    if (settings?.ambientMusicUrl) setUrl(settings.ambientMusicUrl);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    try {
      await updateSettings({ ambientMusicUrl: url });
      await addLog('MUSIC_SYNC', `New audio signal tuned: ${url.substring(0, 30)}...`);
      alert('NETWORK_AUDIO_SYNCED');
    } catch (err) {
      alert('SIGNAL_INTERFERENCE_DETECTED');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl space-y-10">
      <div>
        <h2 className="text-2xl font-black italic tracking-tighter text-primary-neon uppercase">Audio_Stream_Ops</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Manage ambient neural frequencies</p>
      </div>

      <div className="hologram-card p-10 border-2 border-primary-neon/20 space-y-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-3">
             <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Stream_Oscillator_URL</label>
             <input 
               type="text" 
               value={url} 
               onChange={e => setUrl(e.target.value)}
               placeholder="YouTube Link or MP3 URL"
               className="w-full bg-black/50 border border-white/10 p-4 text-xs focus:border-primary-neon outline-none font-mono"
             />
             <div className="flex items-start gap-2 p-3 bg-primary-neon/5 border border-primary-neon/20 rounded-sm">
                <Music size={14} className="text-primary-neon mt-0.5 shrink-0" />
                <div className="space-y-1">
                   <p className="text-[9px] text-primary-neon/70 leading-relaxed font-mono uppercase tracking-tighter">
                     System: YouTube links and direct .mp3 streams are now both supported.
                   </p>
                   {url && (
                     <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">
                       Detected_Type: {url.includes('youtube.com') || url.includes('youtu.be') ? 'NEURAL_VIDEO_STREAM (YT)' : 'DIRECT_AUDIO_SIGNAL (MP3)'}
                     </p>
                   )}
                </div>
             </div>
          </div>

          <button type="submit" className="w-full bg-primary-neon text-black font-black py-4 text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)]">
            COMMIT_AUDIO_SYNC
          </button>
        </form>

        <div className="pt-8 border-t border-white/10 space-y-6">
           <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Global_Frequency_Presets</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {presets.map(p => (
                <button 
                  key={p.name}
                  onClick={() => setUrl(p.url)}
                  className={`p-4 border border-white/5 text-left transition-all hover:bg-white/5 group ${url === p.url ? 'border-primary-neon bg-primary-neon/5' : ''}`}
                >
                  <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${url === p.url ? 'border-primary-neon text-primary-neon' : 'border-white/10 text-white/20'}`}>
                        <Play size={12} fill={url === p.url ? 'currentColor' : 'none'} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-white group-hover:text-primary-neon">{p.name}</p>
                        <p className="text-[8px] text-white/30 font-mono italic">Tech_Signal_ACTIVE</p>
                     </div>
                  </div>
                </button>
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function LogViewer({ logs }: { logs: any[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <div>
        <h2 className="text-2xl font-black italic tracking-tighter text-primary-neon">ADMIN_ACTION_LOGS</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Audit trail for grid modifications</p>
      </div>

      <div className="hologram-card p-0 overflow-hidden border border-primary-neon/10">
        <div className="bg-primary-neon/5 border-b border-primary-neon/10 p-3 flex justify-between text-[8px] font-mono text-primary-neon/60 uppercase tracking-widest">
           <span>Action_Event</span>
           <span>Timestamp_Delta</span>
        </div>
        <div className="divide-y divide-white/5">
          {logs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full border border-primary-neon/20 flex items-center justify-center text-primary-neon/40 group-hover:text-primary-neon transition-colors">
                    <History size={14} />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-bold text-white group-hover:text-primary-neon transition-all uppercase tracking-tighter">{log.action}</h4>
                    <p className="text-[8px] text-white/30 font-mono italic">{log.details}</p>
                 </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-primary-neon/60 font-mono">{log.timestamp?.toDate().toLocaleString() || 'SYNCING'}</p>
                <p className="text-[8px] text-white/20 font-mono tracking-tighter">{log.adminEmail}</p>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="p-20 text-center text-white/20 italic text-xs uppercase tracking-widest">No actions captured in this session</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

