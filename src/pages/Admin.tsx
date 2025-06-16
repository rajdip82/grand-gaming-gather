
import { useState } from "react";
import Header from "../components/Header";
import { useUser } from "@clerk/clerk-react";
import { Users, Calendar, Trophy, Settings, BarChart3, Shield } from "lucide-react";
import AdminTournaments from "../components/admin/AdminTournaments";
import AdminUsers from "../components/admin/AdminUsers";
import AdminStats from "../components/admin/AdminStats";
import AdminSettings from "../components/admin/AdminSettings";

const Admin = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Simple admin check - in a real app, you'd check against your database
  const isAdmin = user?.emailAddresses[0]?.emailAddress?.includes("admin") || 
                  user?.publicMetadata?.role === "admin";

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="pt-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-300">Please sign in to access the admin panel.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="pt-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">Admin Access Required</h1>
            <p className="text-gray-300">You don't have permission to access this area.</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: BarChart3 },
    { id: "tournaments", name: "Tournaments", icon: Trophy },
    { id: "users", name: "Users", icon: Users },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "tournaments":
        return <AdminTournaments />;
      case "users":
        return <AdminUsers />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-300">Manage tournaments, users, and application settings</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-lg backdrop-blur-sm border border-purple-500/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="min-h-[600px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
