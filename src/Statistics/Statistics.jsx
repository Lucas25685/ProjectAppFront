// src/Statistics/Statistics.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Statistics() {
  const { fixtureId } = useParams();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4800/fixtures?fixtureId=${fixtureId}`
      );
      const data = await response.json();
      setStatistics(data.response[0]);
      setLoading(false);
    };

    fetchStatistics();
  }, [fixtureId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!statistics) {
    return <div className="text-center text-gray-500">No statistics available for this fixture.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Statistics for Fixture {fixtureId}</h1>

      {/* Affichage des informations générales */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {statistics.teams.home.name} vs {statistics.teams.away.name}
        </h2>
        <p className="text-lg text-gray-700">
          <strong>Date:</strong> {new Date(statistics.fixture.date).toLocaleString()}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Stadium:</strong> {statistics.fixture.venue.name} - {statistics.fixture.venue.city}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Referee:</strong> {statistics.fixture.referee}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Status:</strong> {statistics.fixture.status.long} ({statistics.fixture.status.elapsed} min)
        </p>
      </div>

      {/* Score */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Score</h2>
        <p className="text-lg text-gray-700">
          <strong>Halftime:</strong> {statistics.score.halftime.home} - {statistics.score.halftime.away}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Fulltime:</strong> {statistics.score.fulltime.home} - {statistics.score.fulltime.away}
        </p>
      </div>

      {/* Statistiques des équipes */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Team Statistics</h2>
        {statistics.statistics.map((teamStats) => (
          <div key={teamStats.team.id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-xl font-medium mb-3 text-gray-700 flex items-center">
              <img src={teamStats.team.logo} alt={teamStats.team.name} className="w-10 h-10 mr-2" />
              {teamStats.team.name}
            </h3>
            <ul className="list-disc list-inside">
              {teamStats.statistics.map((stat, index) => (
                <li key={index} className="text-lg text-gray-700">
                  <strong>{stat.type}:</strong> {stat.value !== null ? stat.value : "N/A"}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Événements du match */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Match Events</h2>
        <ul className="list-disc list-inside">
          {statistics.events.map((event, index) => (
            <li key={index} className="mb-2 text-lg text-gray-700">
              <p>
                <strong>{event.time.elapsed}' {event.time.extra ? `+${event.time.extra}` : ""}</strong> - {event.type} ({event.detail})
              </p>
              <p>
                {event.team.name} - {event.player.name}{" "}
                {event.assist.name ? `(Assist: ${event.assist.name})` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Composition des équipes */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lineups</h2>
        {statistics.lineups.map((team) => (
          <div key={team.team.id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-xl font-medium mb-3 text-gray-700 flex items-center">
              <img src={team.team.logo} alt={team.team.name} className="w-10 h-10 mr-2" />
              {team.team.name} - Formation: {team.formation}
            </h3>
            <h4 className="text-lg font-medium mb-2 text-gray-700">Starting XI</h4>
            <ul className="list-disc list-inside mb-4">
              {team.startXI.map((player) => (
                <li key={player.player.id} className="text-lg text-gray-700">
                  {player.player.number} - {player.player.name} ({player.player.pos})
                </li>
              ))}
            </ul>
            <h4 className="text-lg font-medium mb-2 text-gray-700">Substitutes</h4>
            <ul className="list-disc list-inside mb-4">
              {team.substitutes.map((player) => (
                <li key={player.player.id} className="text-lg text-gray-700">{player.player.name}</li>
              ))}
            </ul>
            <h4 className="text-lg font-medium mb-2 text-gray-700">Coach</h4>
            <p className="text-lg text-gray-700">{team.coach.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Statistics;