
import { useState } from "react";
import { Trophy, Plus, Edit, Trash2, Eye, Calendar, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";

const AdminTournaments = () => {
  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      name: "Spring Championship",
      game: "Valorant",
      status: "live",
      participants: 24,
      maxParticipants: 32,
      prizePool: 5000,
      entryFee: 25,
      date: "2024-03-15",
      time: "18:00"
    },
    {
      id: 2,
      name: "Summer Showdown",
      game: "CS:GO",
      status: "upcoming",
      participants: 16,
      maxParticipants: 64,
      prizePool: 10000,
      entryFee: 50,
      date: "2024-04-20",
      time: "20:00"
    },
    {
      id: 3,
      name: "Weekly Battle",
      game: "Fortnite",
      status: "filling",
      participants: 8,
      maxParticipants: 16,
      prizePool: 1000,
      entryFee: 10,
      date: "2024-03-22",
      time: "19:00"
    }
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "text-green-400 bg-green-400/20";
      case "filling": return "text-yellow-400 bg-yellow-400/20";
      case "live": return "text-red-400 bg-red-400/20";
      case "completed": return "text-gray-400 bg-gray-400/20";
      default: return "text-gray-400 bg-gray-400/20";
    }
  };

  const handleDelete = (id: number) => {
    setTournaments(tournaments.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Tournament Management</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Tournament
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-purple-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Tournament</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Tournament Name" className="bg-slate-700 border-slate-600 text-white" />
              <Input placeholder="Game" className="bg-slate-700 border-slate-600 text-white" />
              <Input placeholder="Max Participants" type="number" className="bg-slate-700 border-slate-600 text-white" />
              <Input placeholder="Entry Fee ($)" type="number" className="bg-slate-700 border-slate-600 text-white" />
              <Input placeholder="Prize Pool ($)" type="number" className="bg-slate-700 border-slate-600 text-white" />
              <Input placeholder="Date" type="date" className="bg-slate-700 border-slate-600 text-white" />
              <Input placeholder="Time" type="time" className="bg-slate-700 border-slate-600 text-white" />
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Create Tournament
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tournaments Table */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl backdrop-blur-sm border border-purple-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left text-white font-semibold p-4">Tournament</th>
                <th className="text-left text-white font-semibold p-4">Game</th>
                <th className="text-left text-white font-semibold p-4">Status</th>
                <th className="text-left text-white font-semibold p-4">Participants</th>
                <th className="text-left text-white font-semibold p-4">Prize Pool</th>
                <th className="text-left text-white font-semibold p-4">Date</th>
                <th className="text-left text-white font-semibold p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((tournament) => (
                <tr key={tournament.id} className="border-t border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">{tournament.name}</p>
                        <p className="text-gray-400 text-sm">${tournament.entryFee} entry</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{tournament.game}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
                      {tournament.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{tournament.participants}/{tournament.maxParticipants}</span>
                    </div>
                  </td>
                  <td className="p-4 text-green-400 font-semibold">${tournament.prizePool.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div className="text-gray-300">
                        <p className="text-sm">{tournament.date}</p>
                        <p className="text-xs text-gray-400">{tournament.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-600 text-red-400 hover:text-red-300 hover:bg-red-600/20"
                        onClick={() => handleDelete(tournament.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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

export default AdminTournaments;
