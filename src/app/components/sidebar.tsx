import { 
  LayoutDashboard, 
  Upload, 
  Sparkles, 
  Workflow, 
  Users, 
  FolderKanban, 
  Clock, 
  Settings 
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  id: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { label: "Upload CSV", icon: Upload, id: "upload-csv" },
  { label: "Lead Enrichment", icon: Sparkles, id: "lead-enrichment" },
  { label: "Automation Rules", icon: Workflow, id: "automation-rules" },
  { label: "Contacts", icon: Users, id: "contacts" },
  { label: "Campaigns", icon: FolderKanban, id: "campaigns" },
  { label: "History", icon: Clock, id: "history" },
  { label: "Settings", icon: Settings, id: "settings" },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="font-semibold text-gray-900">LeadFlow</h1>
        <p className="text-sm text-gray-500 mt-1">Contact Enrichment</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
              <li
                key={item.label}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors duration-150
                  ${isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
                  rounded-lg mb-1`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </li>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-indigo-700">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">john@company.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}