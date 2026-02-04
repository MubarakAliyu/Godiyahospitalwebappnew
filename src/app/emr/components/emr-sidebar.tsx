import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { getSidebarConfig } from '@/app/emr/config/sidebar-config';
import { UserRole } from '@/app/emr/utils/auth';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path?: string;
  badge?: string;
  children?: { label: string; path: string; icon?: React.ElementType }[];
}

function SidebarItem({ icon: Icon, label, path, badge, children }: SidebarItemProps) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = path ? location.pathname === path : false;
  const hasActiveChild = children?.some(child => location.pathname === child.path);

  if (children) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
            hasActiveChild 
              ? "bg-primary/10 text-primary" 
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 shrink-0" />
            <span className="font-medium">{label}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 transition-transform" />
          ) : (
            <ChevronRight className="w-4 h-4 transition-transform" />
          )}
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pl-4 space-y-1"
            >
              {children.map((child) => {
                const ChildIcon = child.icon;
                const isChildActive = location.pathname === child.path;
                return (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                      isChildActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    {ChildIcon && <ChildIcon className="w-4 h-4 shrink-0" />}
                    <span>{child.label}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      to={path || '#'}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent"
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{label}</span>
      {badge && (
        <Badge variant="secondary" className="ml-auto text-xs">
          {badge}
        </Badge>
      )}
    </Link>
  );
}

export function EMRSidebar() {
  const authData = JSON.parse(localStorage.getItem('emr_auth') || '{}');
  const userRole = (authData.role || 'Super Admin') as UserRole;
  const sidebarConfig = getSidebarConfig(userRole);

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* Logo Area */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Godiya EMR</h1>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Hospital Management System</p>
        <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
          {authData.role || 'Super Admin'}
        </Badge>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sidebarConfig.sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              {section.title}
            </p>
            {section.items.map((item, itemIdx) => (
              <SidebarItem key={itemIdx} {...item} />
            ))}
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-white">
              {authData.name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {authData.name || 'Aliyu'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {authData.email || 'ghaliyu@gmail.com'}
            </p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full" title="Active" />
        </div>
      </div>
    </aside>
  );
}