import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/chapter', label: '章节练习', icon: '📖' },
  { path: '/random', label: '随机刷题', icon: '🎲' },
  { path: '/exam', label: '模拟考试', icon: '📝' },
  { path: '/favorites', label: '收藏题目', icon: '⭐' },
  { path: '/stats', label: '答题统计', icon: '📊' },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-blue-600">Spark期末复习</h1>
        <p className="text-xs text-gray-400 mt-0.5">bydzw and zjw</p>
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <nav className="space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
