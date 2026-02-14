import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronRight, Activity } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { Badge } from '@/app/components/ui/badge';
import { getCurrentUser } from '@/app/emr/utils/auth';
import { getSidebarConfig, SidebarItem as SidebarItemType } from '@/app/emr/config/sidebar-config';

interface SidebarItemProps {
  item: SidebarItemType;
}

function SidebarItem({ item }: SidebarItemProps) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = item.icon;
  const isActive = item.path ? location.pathname === item.path : false;
  const hasActiveChild = item.children?.some(child => location.pathname === child.path);

  if (item.children) {
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
            <span className="font-medium">{item.label}</span>
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
              {item.children.map((child) => {
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
      to={item.path || '#'}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent"
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{item.label}</span>
      {item.badge && (
        <Badge variant="secondary" className="ml-auto text-xs">
          {item.badge}
        </Badge>
      )}
    </Link>
  );
}

export function RoleBasedSidebar() {
  const authData = getCurrentUser();
  const sidebarConfig = getSidebarConfig(authData?.role || 'Super Admin');

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
          {authData?.role || 'Super Admin'}
        </Badge>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sidebarConfig.sections.map((section, index) => (
          <div key={index} className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              {section.title}
            </p>
            {section.items.map((item, itemIndex) => (
              <SidebarItem key={itemIndex} item={item} />
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}