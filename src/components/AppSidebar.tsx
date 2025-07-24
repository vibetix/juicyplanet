
import { 
  LayoutDashboard, 
  Archive, 
  User, 
  ChartBar, 
  Calendar, 
  Settings, 
  Mail 
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: Archive,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Archive,
  },
  {
    title: "Customers",
    url: "/admin/customers",
    icon: User,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: ChartBar,
  },
  {
    title: "Subscriptions",
    url: "/admin/subscriptions",
    icon: Calendar,
  },
  {
    title: "Support",
    url: "/admin/support",
    icon: Mail,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-juicy-yellow to-juicy-yellow-light rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🧃</span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Juicy Planet</h2>
            <p className="text-xs text-slate-600">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 uppercase text-xs font-medium px-6 py-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`mx-3 rounded-lg ${
                      location.pathname === item.url 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "text-slate-700 hover:bg-gray-50"
                    }`}
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;