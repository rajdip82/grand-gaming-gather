
import { Trophy, Users, Calendar, DollarSign, TrendingUp, Activity } from "lucide-react";

const AdminStats = () => {
  // Mock data - in a real app, this would come from your database
  const stats = [
    {
      title: "Total Tournaments",
      value: "142",
      change: "+12%",
      icon: Trophy,
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+8%",
      icon: Users,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Monthly Revenue",
      value: "$18,432",
      change: "+23%",
      icon: DollarSign,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Live Tournaments",
      value: "7",
      change: "+2",
      icon: Activity,
      color: "from-red-600 to-orange-600"
    }
  ];

  const recentActivity = [
    { action: "New tournament created", user: "ProGamer123", time: "2 minutes ago" },
    { action: "User registered", user: "NewPlayer456", time: "5 minutes ago" },
    { action: "Tournament completed", user: "Tournament: Spring Cup", time: "1 hour ago" },
    { action: "Payment processed", user: "$50.00 entry fee", time: "2 hours ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-400" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-xs">{activity.user}</p>
                </div>
                <span className="text-gray-500 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-left">
              Create New Tournament
            </button>
            <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 text-left">
              View User Reports
            </button>
            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-left">
              Export Analytics
            </button>
            <button className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all duration-300 text-left">
              System Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
