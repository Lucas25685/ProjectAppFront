// src/Odds/Odds.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Odds() {
  const { fixtureId } = useParams();
  const [odds, setOdds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState({ home: '', away: '' });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchOdds = async () => {
      setLoading(true);
      const response = await fetch(`http://localhost:4800/odds?fixtureId=${fixtureId}`);
      const data = await response.json();
      setOdds(data.response);
      setLoading(false);
    };

    const fetchTeams = async () => {
      const response = await fetch(`http://localhost:4800/fixtures?fixtureId=${fixtureId}`);
      const data = await response.json();
      const fixture = data.response[0];
      setTeams({
        home: fixture.teams.home.name,
        away: fixture.teams.away.name,
      });
    };

    fetchOdds();
    fetchTeams();
  }, [fixtureId]);

  if (loading) {
    return <div className="text-center text-gray-500">{t('Loading...')}</div>;
  }

  const translateIfExists = (key) => {
    return i18n.exists(key) ? t(key) : key;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">{t('Match ')}: {teams.home} vs {teams.away}</h1>
      {odds && odds.length > 0 ? (
        odds.map((odd, index) => (
          <div key={index} className="mb-8 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">{t('Bookmaker')}: {odd.bookmakers[0].name}</h2>
            {odd.bookmakers[0].bets.map((bet, betIndex) => (
              <div key={betIndex} className="mb-6">
                <h3 className="text-xl font-medium mb-3 text-gray-700">{translateIfExists(bet.name)}</h3>
                <ul className="flex flex-wrap gap-3 justify-center">
                  {bet.values.map((value, valueIndex) => (
                    <li key={valueIndex} className="bg-yellow-100 p-3 rounded-lg shadow hover:bg-yellow-200 transition">
                      {translateIfExists(value.value)} <b className="text-red-600">{value.odd}</b>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">{t('No odds available for this fixture.')}</div>
      )}
    </div>
  );
}

export default Odds;