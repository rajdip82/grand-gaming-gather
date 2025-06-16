
import { useState } from "react";
import { Users, Shield, Ban, Mail, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const AdminUsers = () => {
  const [users] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "player",
      status: "active",
      joinDate: "2024-01-15",
      tournaments: 12,
      winnings: 450
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
      status: "active",
      joinDate: "2023-12-01",
      tournaments: 25,
      winnings: 1200
    },
    {
      id: 3,
      name: "ProGamer123",
      email: "pro@example.com",
      role: "player",
      status: "banned",
      joinDate: "2024-02-20",
      tournaments: 5,
      winnings: 100
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "text-purple-400 bg-purple-400/20";
      case "moderator": return "text-blue-400 bg-blue-400/20";
      default: return "text-gray-400 bg-gray-400/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400 bg-green-400/20";
      case "banned": return "text-red-400 bg-red-400/20";
      case "suspended": return "text-yellow-400 bg-yellow-400/20";
      default: return "text-gray-400 bg-gray-400/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white w-64"
          />
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{users.length}</p>
              <p className="text-gray-400 text-sm">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
              <p className="text-gray-400 text-sm">Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-gray-400 text-sm">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center space-x-3">
            <Ban className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.status === 'banned').length}</p>
              <p className="text-gray-400 text-sm">Banned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl backdrop-blur-sm border border-purple-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left text-white font-semibold p-4">User</th>
                <th className="text-left text-white font-semibold p-4">Role</th>
                <th className="text-left text-white font-semibold p-4">Status</th>
                <th className="text-left text-white font-semibold p-4">Tournaments</th>
                <th className="text-left text-white font-semibold p-4">Winnings</th>
                <th className="text-left text-white font-semibold p-4">Join Date</th>
                <th className="text-left text-white font-semibold p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">{user.tournaments}</td>
                  <td className="p-4 text-green-400 font-semibold">${user.winnings}</td>
                  <td className="p-4 text-gray-300">{user.joinDate}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 hover:text-white">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 hover:text-white">
                        <Shield className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-600 text-red-400 hover:text-red-300 hover:bg-red-600/20"
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
