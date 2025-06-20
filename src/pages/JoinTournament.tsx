import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface FormData {
  username: string;
  email: string;
  gameId: string;
  teamName: string;
  phone: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  gameId?: string;
  teamName?: string;
  phone?: string;
}

const JoinTournament = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    gameId: "",
    teamName: "",
    phone: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock tournament data - in real app would fetch from API
  const tournament = {
    id: 1,
    name: "PUBG Mobile Championship",
    game: "PUBG Mobile",
    date: "2025-06-15",
    time: "18:00",
    entryFee: 50,
    prizePool: 10000,
    participants: 45,
    maxParticipants: 100,
    status: "upcoming"
  };

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="pt-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto"></div>
            <p className="text-white mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="pt-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-12 backdrop-blur-sm border border-purple-500/20">
              <div className="text-6xl mb-6">🔐</div>
              <h1 className="text-3xl font-bold text-white mb-4">Authentication Required</h1>
              <p className="text-gray-300 mb-8 text-lg">
                You need to sign in to join tournaments and access exclusive features.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                >
                  Sign In to Continue
                </button>
                <p className="text-gray-400 text-sm">
                  Don't have an account? Sign up is quick and free!
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.gameId.trim()) newErrors.gameId = "Game ID is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store registration in localStorage
      const registration = {
        ...formData,
        tournamentId: id,
        tournamentName: tournament.name,
        registeredAt: new Date().toISOString()
      };

      const existingRegistrations = JSON.parse(localStorage.getItem("registrations") || "[]");
      existingRegistrations.push(registration);
      localStorage.setItem("registrations", JSON.stringify(existingRegistrations));

      alert("Successfully registered for the tournament! Check your email for confirmation details.");
      navigate("/dashboard");
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tournament Details */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-8 backdrop-blur-sm border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">Tournament Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">{tournament.name}</h3>
                  <p className="text-purple-400 text-lg">{tournament.game}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">Date & Time</div>
                    <div className="text-white font-medium">{tournament.date} at {tournament.time}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Entry Fee</div>
                    <div className="text-white font-medium">${tournament.entryFee}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">Prize Pool</div>
                    <div className="text-green-400 font-bold text-xl">${tournament.prizePool}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Participants</div>
                    <div className="text-white font-medium">{tournament.participants}/{tournament.maxParticipants}</div>
                  </div>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full"
                    style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                  ></div>
                </div>

                <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Important Notes:</h4>
                  <ul className="text-yellow-200 text-sm space-y-1">
                    <li>• Registration closes 1 hour before tournament start</li>
                    <li>• Entry fee is non-refundable</li>
                    <li>• Make sure your game ID is correct</li>
                    <li>• Check your email for tournament instructions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-8 backdrop-blur-sm border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">Join Tournament</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-white font-medium mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Enter your username"
                  />
                  {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Game ID */}
                <div>
                  <label className="block text-white font-medium mb-2">Game ID / Username</label>
                  <input
                    type="text"
                    name="gameId"
                    value={formData.gameId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Enter your game ID"
                  />
                  {errors.gameId && <p className="text-red-400 text-sm mt-1">{errors.gameId}</p>}
                </div>

                {/* Team Name (Optional) */}
                <div>
                  <label className="block text-white font-medium mb-2">Team Name (Optional)</label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Enter team name (if applicable)"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-white font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Registering..." : `Join Tournament - $${tournament.entryFee}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JoinTournament;
