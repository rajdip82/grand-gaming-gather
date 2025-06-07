
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreateTournament = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    date: "",
    time: "",
    entryFee: "",
    prizePool: "",
    maxParticipants: "",
    description: ""
  });

  const [errors, setErrors] = useState({});

  const games = ["PUBG Mobile", "Free Fire", "Clash of Clans", "Ludo King", "Call of Duty", "Among Us"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Tournament name is required";
    if (!formData.game) newErrors.game = "Please select a game";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.entryFee || formData.entryFee < 0) newErrors.entryFee = "Valid entry fee is required";
    if (!formData.prizePool || formData.prizePool < 0) newErrors.prizePool = "Valid prize pool is required";
    if (!formData.maxParticipants || formData.maxParticipants < 2) newErrors.maxParticipants = "Minimum 2 participants required";

    // Check if date is in the future
    const selectedDate = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    if (selectedDate <= now) {
      newErrors.date = "Tournament date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would send to a backend
      // For now, we'll store in localStorage and show success
      const tournament = {
        ...formData,
        id: Date.now(),
        participants: 0,
        status: "upcoming"
      };

      // Get existing tournaments from localStorage
      const existingTournaments = JSON.parse(localStorage.getItem("tournaments") || "[]");
      existingTournaments.push(tournament);
      localStorage.setItem("tournaments", JSON.stringify(existingTournaments));

      alert("Tournament created successfully!");
      navigate("/tournaments");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Create Tournament
              </span>
            </h1>
            <p className="text-gray-400">Set up your own gaming tournament</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-8 backdrop-blur-sm border border-purple-500/20">
            {/* Tournament Name */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Tournament Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Enter tournament name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Game Selection */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Game</label>
              <select
                name="game"
                value={formData.game}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
              >
                <option value="">Select a game</option>
                {games.map((game) => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
              {errors.game && <p className="text-red-400 text-sm mt-1">{errors.game}</p>}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white font-medium mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
                />
                {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
                />
                {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time}</p>}
              </div>
            </div>

            {/* Entry Fee and Prize Pool */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white font-medium mb-2">Entry Fee ($)</label>
                <input
                  type="number"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="0.00"
                />
                {errors.entryFee && <p className="text-red-400 text-sm mt-1">{errors.entryFee}</p>}
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Prize Pool ($)</label>
                <input
                  type="number"
                  name="prizePool"
                  value={formData.prizePool}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="0.00"
                />
                {errors.prizePool && <p className="text-red-400 text-sm mt-1">{errors.prizePool}</p>}
              </div>
            </div>

            {/* Max Participants */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Maximum Participants</label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                min="2"
                className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Enter max participants"
              />
              {errors.maxParticipants && <p className="text-red-400 text-sm mt-1">{errors.maxParticipants}</p>}
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-white font-medium mb-2">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                placeholder="Enter tournament description, rules, or additional information..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
            >
              Create Tournament
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateTournament;
