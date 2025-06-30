
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trophy } from "lucide-react";

interface Match {
  id: string;
  team_a: string;
  team_b: string;
  team_a_logo?: string;
  team_b_logo?: string;
  match_time: string;
  status: string;
  winner?: string;
  betting_odds?: {
    id: string;
    team_a_odds: number;
    team_b_odds: number;
    draw_odds?: number;
    is_active: boolean;
  }[];
}

const AdminMatches = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const { data: matches, isLoading } = useQuery({
    queryKey: ['admin-matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          betting_odds (*)
        `)
        .order('match_time', { ascending: false });
      
      if (error) throw error;
      return data as Match[];
    },
  });

  const createMatchMutation = useMutation({
    mutationFn: async (matchData: any) => {
      const { data, error } = await supabase
        .from('matches')
        .insert(matchData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Match created successfully!" });
      queryClient.invalidateQueries({ queryKey: ['admin-matches'] });
      setShowCreateModal(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating match",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMatchMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('matches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Match updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ['admin-matches'] });
      setEditingMatch(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating match",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createOddsMutation = useMutation({
    mutationFn: async (oddsData: any) => {
      const { data, error } = await supabase
        .from('betting_odds')
        .insert(oddsData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Odds updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ['admin-matches'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating odds",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, isEdit = false) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const matchData = {
      team_a: formData.get('team_a') as string,
      team_b: formData.get('team_b') as string,
      team_a_logo: formData.get('team_a_logo') as string || null,
      team_b_logo: formData.get('team_b_logo') as string || null,
      match_time: formData.get('match_time') as string,
      status: formData.get('status') as string || 'upcoming',
      winner: formData.get('winner') as string || null,
    };

    if (isEdit && editingMatch) {
      updateMatchMutation.mutate({ id: editingMatch.id, updates: matchData });
    } else {
      createMatchMutation.mutate(matchData);
    }
  };

  const handleCreateOdds = (matchId: string, formData: FormData) => {
    const oddsData = {
      match_id: matchId,
      team_a_odds: parseFloat(formData.get('team_a_odds') as string),
      team_b_odds: parseFloat(formData.get('team_b_odds') as string),
      draw_odds: formData.get('draw_odds') ? parseFloat(formData.get('draw_odds') as string) : null,
      is_active: true,
    };

    createOddsMutation.mutate(oddsData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-red-500";
      case "upcoming": return "bg-green-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading matches...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Match Management</h2>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Match
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-purple-500/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Match</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team_a">Team A</Label>
                  <Input name="team_a" required className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="team_b">Team B</Label>
                  <Input name="team_b" required className="bg-slate-700 border-slate-600" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team_a_logo">Team A Logo URL</Label>
                  <Input name="team_a_logo" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="team_b_logo">Team B Logo URL</Label>
                  <Input name="team_b_logo" className="bg-slate-700 border-slate-600" />
                </div>
              </div>
              <div>
                <Label htmlFor="match_time">Match Time</Label>
                <Input name="match_time" type="datetime-local" required className="bg-slate-700 border-slate-600" />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                Create Match
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches?.map((match) => (
          <Card key={match.id} className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge className={`${getStatusColor(match.status)} text-white`}>
                  {match.status.toUpperCase()}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingMatch(match)}
                  className="border-purple-500/50 text-purple-400"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <CardTitle className="text-white text-center">
                {match.team_a} vs {match.team_b}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-400">
                  {new Date(match.match_time).toLocaleString()}
                </div>
                
                {match.winner && (
                  <div className="text-green-400">
                    Winner: {match.winner === 'team_a' ? match.team_a : match.winner === 'team_b' ? match.team_b : 'Draw'}
                  </div>
                )}

                {match.betting_odds && match.betting_odds.length > 0 ? (
                  <div className="bg-slate-700/50 p-3 rounded">
                    <div className="text-sm font-semibold text-white mb-2">Current Odds</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>{match.team_a}: {match.betting_odds[0].team_a_odds}x</div>
                      <div>{match.team_b}: {match.betting_odds[0].team_b_odds}x</div>
                      {match.betting_odds[0].draw_odds && (
                        <div className="col-span-2">Draw: {match.betting_odds[0].draw_odds}x</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateOdds(match.id, new FormData(e.currentTarget));
                    }}
                    className="bg-slate-700/50 p-3 rounded space-y-2"
                  >
                    <div className="text-sm font-semibold text-white mb-2">Set Betting Odds</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">{match.team_a} Odds</Label>
                        <Input
                          name="team_a_odds"
                          type="number"
                          step="0.01"
                          placeholder="2.0"
                          className="bg-slate-600 border-slate-500 text-xs"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-xs">{match.team_b} Odds</Label>
                        <Input
                          name="team_b_odds"
                          type="number"
                          step="0.01"
                          placeholder="2.0"
                          className="bg-slate-600 border-slate-500 text-xs"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Draw Odds (optional)</Label>
                      <Input
                        name="draw_odds"
                        type="number"
                        step="0.01"
                        placeholder="3.0"
                        className="bg-slate-600 border-slate-500 text-xs"
                      />
                    </div>
                    <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                      Set Odds
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Match Modal */}
      {editingMatch && (
        <Dialog open={!!editingMatch} onOpenChange={() => setEditingMatch(null)}>
          <DialogContent className="bg-slate-800 border-purple-500/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Match</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team_a">Team A</Label>
                  <Input name="team_a" defaultValue={editingMatch.team_a} required className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="team_b">Team B</Label>
                  <Input name="team_b" defaultValue={editingMatch.team_b} required className="bg-slate-700 border-slate-600" />
                </div>
              </div>
              <div>
                <Label htmlFor="match_time">Match Time</Label>
                <Input 
                  name="match_time" 
                  type="datetime-local" 
                  defaultValue={new Date(editingMatch.match_time).toISOString().slice(0, 16)}
                  required 
                  className="bg-slate-700 border-slate-600" 
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={editingMatch.status}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editingMatch.status === 'completed' && (
                <div>
                  <Label htmlFor="winner">Winner</Label>
                  <Select name="winner" defaultValue={editingMatch.winner}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select winner" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="team_a">{editingMatch.team_a}</SelectItem>
                      <SelectItem value="team_b">{editingMatch.team_b}</SelectItem>
                      <SelectItem value="draw">Draw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                Update Match
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminMatches;
