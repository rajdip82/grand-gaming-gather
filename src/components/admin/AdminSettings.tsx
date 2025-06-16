
import { useState } from "react";
import { Settings, Save, Globe, Shield, Bell, Database } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "proxycorn",
    siteDescription: "The ultimate gaming tournament platform",
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    tournamentAutoApproval: false,
    maxTournamentSize: 64,
    minEntryFee: 5,
    maxEntryFee: 1000,
    platformFee: 5
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
    // In a real app, this would save to your backend
  };

  const settingSections = [
    {
      title: "General Settings",
      icon: Globe,
      settings: [
        { key: "siteName", label: "Site Name", type: "text" },
        { key: "siteDescription", label: "Site Description", type: "text" },
        { key: "maintenanceMode", label: "Maintenance Mode", type: "checkbox" },
      ]
    },
    {
      title: "User Settings",
      icon: Shield,
      settings: [
        { key: "userRegistration", label: "Allow User Registration", type: "checkbox" },
        { key: "emailNotifications", label: "Email Notifications", type: "checkbox" },
      ]
    },
    {
      title: "Tournament Settings",
      icon: Settings,
      settings: [
        { key: "tournamentAutoApproval", label: "Auto-approve Tournaments", type: "checkbox" },
        { key: "maxTournamentSize", label: "Max Tournament Size", type: "number" },
        { key: "minEntryFee", label: "Minimum Entry Fee ($)", type: "number" },
        { key: "maxEntryFee", label: "Maximum Entry Fee ($)", type: "number" },
        { key: "platformFee", label: "Platform Fee (%)", type: "number" },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">System Settings</h2>
        <Button 
          onClick={handleSave}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {settingSections.map((section) => (
        <div
          key={section.title}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <section.icon className="w-5 h-5 mr-2 text-purple-400" />
            {section.title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.settings.map((setting) => (
              <div key={setting.key} className="space-y-2">
                <label className="text-gray-300 font-medium">{setting.label}</label>
                {setting.type === "checkbox" ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={settings[setting.key as keyof typeof settings] as boolean}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, [setting.key]: checked }))
                      }
                    />
                    <span className="text-gray-400">
                      {settings[setting.key as keyof typeof settings] ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                ) : (
                  <Input
                    type={setting.type}
                    value={settings[setting.key as keyof typeof settings] as string | number}
                    onChange={(e) =>
                      setSettings(prev => ({ 
                        ...prev, 
                        [setting.key]: setting.type === "number" ? Number(e.target.value) : e.target.value 
                      }))
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* System Status */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Database className="w-5 h-5 mr-2 text-purple-400" />
          System Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Database</span>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <p className="text-green-400 text-sm mt-1">Online</p>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">API Server</span>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <p className="text-green-400 text-sm mt-1">Healthy</p>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Payment Gateway</span>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
            <p className="text-yellow-400 text-sm mt-1">Slow Response</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
