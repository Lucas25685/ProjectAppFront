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
        homeLogo: fixture.teams.home.logo,
        homeGoals: fixture.goals.home,
        away: fixture.teams.away.name,
        awayLogo: fixture.teams.away.logo,
        awayGoals: fixture.goals.away,
        round: fixture.league.round,
        matchStatus: fixture.fixture.status.long,
        matchElapsed: fixture.fixture.status.elapsed,
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
    <div className="mx-auto p-4 text-center bg-slate-900">
      
      <div className="relative bg-black p-2 sm:p-4 rounded-lg text-center">
        <div className="flex justify-center items-center max-w-72 bg-gray-200 text-black px-1 sm:px-2 py-1 rounded-full text-xs sm:text-xs mt-2 mx-auto items-center">
          <img src={odds[0].league.logo} alt={odds[0].league.name} className="inline-block w-3 sm:w-4 h-3 sm:h-4 mr-1 object-contain" /> <p className="font-semibold">{odds[0].league.name}</p>
        </div>
        <div className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">
          {teams.round}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between text-2xl sm:text-4xl font-bold my-2 sm:my-4">
          <div className="flex flex-col items-center w-full sm:w-1/3 text-center sm:text-right mb-2 sm:mb-0">
            <img src={teams.homeLogo} alt={teams.home} className="w-10 sm:w-12 h-10 sm:h-12 mb-1 object-contain" />
            <span className="text-white text-sm sm:text-md md:text-lg lg:text-xl font-semibold">{teams.home}</span>
          </div>
          {(teams.homeGoals != null || teams.awayGoals != null) ? (
            <span className="w-full sm:w-1/3 text-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white">{teams.homeGoals} : {teams.awayGoals}</span>
          ) : (
            <span className="w-full sm:w-1/3 text-center text-sm sm:text-md md:text-lg lg:text-xl text-white">
              {new Date(odds[0].fixture.date).toLocaleDateString()} <br/> {new Date(odds[0].fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <div className="flex flex-col items-center w-full sm:w-1/3 text-center sm:text-left mt-2 sm:mt-0">
            <img src={teams.awayLogo} alt={teams.away} className="w-10 sm:w-12 h-10 sm:h-12 mb-1 object-contain" />
            <span className="text-white text-sm sm:text-md md:text-lg lg:text-xl font-semibold">{teams.away}</span>
          </div>
        </div>
        <p className="text-gray-400 text-xs sm:text-xs">{teams.matchStatus}</p>
        {(teams.matchStatus != "Not Started" && teams.matchStatus != "Match Finished") && (
          <b className='text-red-500'>{teams.matchElapsed}'</b>
        )}
      </div>
      
      {odds && odds.length > 0 ? (
        odds.map((odd, index) => (
          <div key={index} className="mb-8 p-6">
            {odd.bookmakers[0].bets.map((bet, betIndex) => (
              <div key={betIndex} className="mb-6">
                <h3 className="text-xl font-medium mb-3 text-gray-400">{translateIfExists(bet.name)}</h3>
                <ul className="inline-block flex flex-wrap gap-3 rounded-lg p-4">
                  {bet.values
                  .sort((a, b) => {
                    const aValue = parseFloat(a.value.split(' ')[1]);
                    const bValue = parseFloat(b.value.split(' ')[1]);
                    const aType = a.value.split(' ')[0];
                    const bType = b.value.split(' ')[0];

                    if (aType === bType) {
                      return aValue - bValue;
                    } else if (aType === 'Under' && bType === 'Over') {
                      return -1;
                    } else if (aType === 'Over' && bType === 'Under') {
                      return 1;
                    }
                    return 0;
                  })
                  .map((value, valueIndex) => (
                    <li key={valueIndex} className="bg-slate-800 p-3 rounded-lg shadow hover:bg-slate-700 transition border border-gray-200">
                      <div className="flex gap-2 items-center">
                        <p className="text-white">{translateIfExists(value.value)}</p> 
                        <b className="text-red-600">{value.odd}</b>
                      </div>
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