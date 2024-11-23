import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../lib/store';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 right-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Inventory Pro</h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors 
                    ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
