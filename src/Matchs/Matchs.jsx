// src/Matchs/Matchs.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMatches } from '../api';
import { format, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

function Matchs() {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(getCurrentDate());
  const [visibleMatches, setVisibleMatches] = useState(10);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchMatches(date);
      setMatches(data.response);
      setLoading(false);
    };

    fetchData();
  }, [date]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleShowMore = () => {
    setVisibleMatches((prevVisibleMatches) => prevVisibleMatches + 10);
  };

  const handleShowLess = () => {
    setVisibleMatches((prevVisibleMatches) => Math.max(prevVisibleMatches - 10, 10));
  };

  const changeDate = (newDate) => {
    setDate(format(new Date(newDate), 'yyyy-MM-dd'));
  };

  const shiftDays = (direction) => {
    setOffset((prevOffset) => prevOffset + direction * 7);
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(new Date(), i + offset);
    let label = format(day, 'EEE dd', { locale: fr });
    
    if (format(day, 'yyyy-MM-dd') === format(subDays(new Date(), 1), 'yyyy-MM-dd')) {
      label = 'Hier';
    } else if (format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
      label = "Aujourd'hui";
    } else if (format(day, 'yyyy-MM-dd') === format(addDays(new Date(), 1), 'yyyy-MM-dd')) {
      label = 'Demain';
    }
    
    return { label, value: day };
  });

  const groupMatchesByLeague = (matches) => {
    return matches.reduce((acc, match) => {
      const leagueKey = `${match.league.name} (${match.league.country})`;
      if (!acc[leagueKey]) {
        acc[leagueKey] = [];
      }
      acc[leagueKey].push(match);
      return acc;
    }, {});
  };

  const groupedMatches = groupMatchesByLeague(matches);

  const leagueOrder = [
    'UEFA Champions League (World)',
    'UEFA Europa League (World)',
    'UEFA Europa Conference League (World)',
    'Premier League (England)',
    'La Liga (Spain)',
    'Serie A (Italy)',
    'Bundesliga (Germany)',
    'Ligue 1 (France)',
  ];

  const sortedLeagues = Object.keys(groupedMatches).sort((a, b) => {
    const indexA = leagueOrder.indexOf(a);
    const indexB = leagueOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) {
      return a.localeCompare(b);
    }
    if (indexA === -1) {
      return 1;
    }
    if (indexB === -1) {
      return -1
    }
    return indexA - indexB;
  });

  const sortedLeaguesLogo = (sortedLeagues.map((league) => groupedMatches[league])).map((league) => league[0].league.logo);

  const sortedLeaguesWithLogos = sortedLeagues.map((league, index) => ({
    name: league,
    logo: sortedLeaguesLogo[index],
  }));

  const flattenedMatches = sortedLeagues.flatMap((league) => groupedMatches[league]);


  return (
    <div className="mx-auto p-4 text-center p-4 bg-gradient-to-r from-gray-800 to-black">
      <h1 className="text-xl mb-2 text-white">Matchs du {format(new Date(date), 'd MMMM yyyy', { locale: fr })}</h1>
      <div className="flex justify-center items-center space-x-2 overflow-auto py-2">
        <button onClick={() => shiftDays(-1)} className="px-2 text-gray-200">❮</button>
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => changeDate(day.value)}
            className={`px-4 py-2 text-sm text-white font-medium rounded transition duration-300 ${format(new Date(date), 'yyyy-MM-dd') === format(new Date(day.value), 'yyyy-MM-dd') ? 'bg-gray-600 text-white font-bold border border-white' : 'border border-gray-600'}`}
          >
            {day.label}
          </button>
        ))}
        <button onClick={() => shiftDays(1)} className="px-2 text-gray-200">❯</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {sortedLeaguesWithLogos.slice(0, visibleMatches).map((league) => (
            <div key={league.name} className="mb-12">
              <div className="max-w-4xl mx-auto flex items-center text-xl mb-2">
                <div className="flex flex-row items-center bg-gradient-to-r from-gray-300 to-white p-2 rounded shadow">
                  <img src={league.logo} alt={league.name} className="w-10 h-10 object-contain" />
                </div>
                <h2 className="ml-2 font-bold text-white">
                  {league.name.substring(0, league.name.lastIndexOf(' '))}
                </h2>
              </div>
              <ul className="grid grid-cols-2 gap-2 max-w-[750px] mx-auto text-center">
                {groupedMatches[league.name].map((match) => (
                  <li key={match.fixture.id} className={`border-2 border-white hover:bg-gray-800 p-2 rounded shadow ${groupedMatches[league.name].length === 1 ? 'col-span-2 w-[375px] mx-auto' : ''}`}>
                  <div className="flex flex-col items-center min-h-40">
                    <div className="grid grid-cols-5 mb-1 w-[350px]">
                      <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-8 h-8 mx-1 object-contain justify-self-center" />
                      <span className="text-sm text-white">{match.teams.home.name}</span>
                      <span className="mx-1 text-white">vs</span>
                      <span className="text-sm text-white">{match.teams.away.name}</span>
                      <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-8 h-8 mx-1 object-contain justify-self-center" />
                    </div>
                    <div className="text-sm mb-1 text-white">{match.goals.home} - {match.goals.away}</div>
                    <div className="text-xs text-gray-600 mb-1 text-white">{match.fixture.venue.name}, {match.fixture.venue.city}</div>
                    <div className="text-xs text-gray-800 text-white">
                      <span>{match.fixture.status.long}</span>
                      {match.fixture.status.short === '1H' || match.fixture.status.short === '2H' ? (
                        <span> - <b className='text-red-500'>{match.fixture.status.elapsed}'</b></span>
                      ) : null}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{format(new Date(match.fixture.date), 'dd/MM/yyyy HH:mm')}</div>
                    <div className="flex-grow"></div>
                    <div className="grid grid-cols-2 mt-auto w-[375px]">
                      {match.fixture.status.short === 'NS' && (
                        <><Link to={`/odds/${match.fixture.id}`} className="text-red-500 hover:text-red-700 transition duration-300">Parier</Link><Link to={`/statistics/${match.fixture.id}`} className="text-blue-500 hover:text-blue-700 transition duration-300">Statistiques</Link></>
                      )}
                      {match.fixture.status.short !== 'NS' && (
                      <div className="col-span-2">
                        <Link to={`/statistics/${match.fixture.id}`} className="text-blue-500 hover:text-blue-700 transition duration-300">Statistiques</Link>
                      </div>
                      )}
                    </div>
                  </div>
                </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex justify-center gap-2 mt-2">
            {visibleMatches < flattenedMatches.length && (
              <button onClick={handleShowMore} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">Voir plus</button>
            )}
            {visibleMatches > 10 && (
              <button onClick={handleShowLess} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">Voir moins</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Matchs;