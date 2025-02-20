import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fleche_vert from "../assets/png/fleche_vert.png";
import fleche_rouge from "../assets/png/fleche_rouge.png";
import carton_jaune from "../assets/png/carton_jaune.png";
import carton_rouge from "../assets/png/carton_rouge.png";
import ballon from "../assets/png/ballon.png";
import penalty from "../assets/png/penalty.png";
import varLogo from "../assets/png/var.png";
import terrain from "../assets/png/terrain-foot.png";

function Statistics() {
  const { fixtureId } = useParams();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleEvents, setVisibleEvents] = useState(5);
  const [selectedTeam, setSelectedTeam] = useState(0);

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

  const handleShowMore = () => {
    setVisibleEvents((prevVisibleEvents) => prevVisibleEvents + 100);
  };

  const handleShowLess = () => {
    setVisibleEvents((prevVisibleEvents) => Math.max(prevVisibleEvents - 100, 5));
  };

  return (
    <div className="mx-auto p-2 sm:p-4 bg-gradient-to-r from-gray-200 to-white text-white rounded-lg shadow-lg lg:p-6 text-xs">
      <div className="relative bg-gradient-to-r from-gray-800 to-black p-2 sm:p-4 rounded-lg text-center">
        <div className="flex justify-center items-center max-w-72 bg-gray-200 text-black px-1 sm:px-2 py-1 rounded-full text-xs sm:text-xs mt-2 mx-auto items-center">
          <img src={statistics.league.logo} alt={statistics.league.name} className="inline-block w-3 sm:w-4 h-3 sm:h-4 mr-1 object-contain" /> <p className="font-semibold">{statistics.league.name}</p>
        </div>
        <div className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">
          {statistics.league.round}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between text-2xl sm:text-4xl font-bold my-2 sm:my-4">
          <div className="flex flex-col items-center w-full sm:w-1/3 text-center sm:text-right mb-2 sm:mb-0">
            <img src={statistics.teams.home.logo} alt={statistics.teams.home.name} className="w-10 sm:w-12 h-10 sm:h-12 mb-1 object-contain" />
            <span className="text-sm sm:text-md md:text-lg lg:text-xl font-semibold">{statistics.teams.home.name}</span>
          </div>
          {(statistics.goals.home != null || statistics.goals.away != null) ? (
            <span className="w-full sm:w-1/3 text-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white">{statistics.goals.home} : {statistics.goals.away}</span>
          ) : (
            <span className="w-full sm:w-1/3 text-center text-sm sm:text-md md:text-lg lg:text-xl text-white">
              {new Date(statistics.fixture.date).toLocaleDateString()} <br/> {new Date(statistics.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <div className="flex flex-col items-center w-full sm:w-1/3 text-center sm:text-left mt-2 sm:mt-0">
            <img src={statistics.teams.away.logo} alt={statistics.teams.away.name} className="w-10 sm:w-12 h-10 sm:h-12 mb-1 object-contain" />
            <span className="text-sm sm:text-md md:text-lg lg:text-xl font-semibold">{statistics.teams.away.name}</span>
          </div>
        </div>
        <p className="text-gray-400 text-xs sm:text-xs">{statistics.fixture.status.long}</p>
        {(statistics.fixture.status.long != "Not Started" && statistics.fixture.status.long != "Match Finished") && (
          <b className='text-red-500'>{statistics.fixture.status.elapsed}'</b>
        )}
      </div>

      {/* Événements du match */}
      {statistics.events.length !== 0 && (
        <div className="my-6 bg-gradient-to-r from-gray-800 to-black p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">Événements du Match</h2>
          <div className="relative flex flex-col items-center">
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-300"></div>
            {statistics.events.slice(0, visibleEvents).map((event, index) => (
              <div className="relative flex w-full max-w-3xl items-center my-2">
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-gray-900 text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                  {event.time.elapsed}'
                </div>

                <div className={`relative bg-white w-80 shadow-md px-4 py-2 rounded-lg flex flex-col ${event.team.id === statistics.teams.home.id ? 'mr-auto' : 'ml-auto'}`}>
                  <div className="flex items-center">
                    <img src={event.team.logo} alt={event.team.name} className="w-5 h-5 mr-2 object-contain" />
                    {event.type === 'subst' && (
                      <img src={fleche_rouge} className="w-4 h-4 object-contain" alt="Substitution Out" />
                    )}
                    <span className="font-semibold text-gray-900 text-sm">{event.player.name}</span>
                    {event.type === 'Goal' && (
                      <>
                        <span className="mr-1 text-xs text-gray-500 ml-auto">{event.detail}</span>
                        <img src={event.detail === 'Penalty' ? penalty : ballon} alt={event.detail} className="w-3 sm:w-4 h-3 sm:h-4 transform object-contain ml-1" />
                      </>
                    )}
                    {event.type === 'Card' && (
                      <img src={event.detail === 'Yellow Card' ? carton_jaune : carton_rouge} alt={event.detail} className="w-3 sm:w-4 h-3 sm:h-4 transform object-contain ml-auto" />
                    )}
                    {event.type === 'Var' && (
                      <>
                      <span className="mr-1 text-xs text-gray-500 ml-auto">{event.detail}</span>
                      <img src={varLogo} alt={event.detail} className="w-4 sm:w-6 h-3 sm:h-4 transform object-contain ml-1" />
                      </>
                    )}
                  </div>
                  {event.assist?.name && (
                    <>
                      {event.type === 'subst' && (
                        <>
                          <div className="flex items-center ml-7 mt-1">
                            <img src={fleche_vert} className="w-4 h-4 transform rotate-180 object-contain" alt="Substitution In" />
                            <span className="text-xs text-gray-500 text-left">{event.assist.name}</span>
                          </div>
                        </>
                      )}
                      {event.type != 'subst' && (
                        <span className="text-xs text-gray-500 text-left ml-7">{event.assist.name}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-2">
            {visibleEvents < statistics.events.length && (
              <button onClick={handleShowMore} className="px-2 py-1 text-xs font-medium bg-white text-black rounded hover:bg-gray-300 transition duration-300">Voir tout</button>
            )}
            {visibleEvents > 10 && (
              <button onClick={handleShowLess} className="px-2 py-1 text-xs font-medium bg-white text-black rounded hover:bg-gray-300 transition duration-300">Voir moins</button>
            )}
          </div>
        </div>
      )}


      <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-2">

        {/* Composition des équipes */}
        { statistics.lineups.length != 0 && (
          <div className="max-w-xl h-full w-full sm:w-1/2 my-4 bg-[#1e1e1e] p-4 rounded-lg shadow-lg mx-auto items-center">
            <h2 className="text-xl font-semibold mb-4 text-center">Compositions (Officielles)</h2>
            <div className="flex justify-center gap-4 text-sm font-semibold">
              <button 
                className={`pb-1 ${selectedTeam === 0 ? 'border-b-4 border-black text-white' : 'text-gray-400'}`} 
                onClick={() => setSelectedTeam(0)}
              >
                {statistics.lineups[0].team.name}
              </button>
              <button 
                className={`pb-1 ${selectedTeam === 1 ? 'border-b-4 border-black text-white' : 'text-gray-400'}`} 
                onClick={() => setSelectedTeam(1)}
              >
                {statistics.lineups[1].team.name}
              </button>
            </div>
            <div 
              className="relative max-w-xl w-full h-[500px] rounded-lg flex flex-col justify-between p-2 mt-2 mx-auto items-center"
              style={{ backgroundImage: `url(${terrain})`, backgroundSize: "80% 100%", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
            >
              {(() => {
                const uniqueRows = [...new Set(statistics.lineups[selectedTeam].startXI.map(player => player.player.grid.split(":")[0]))];
                const rowCount = uniqueRows.length;
                return uniqueRows.reverse().map((row, rowIndex) => {
                  const playersInRow = statistics.lineups[selectedTeam].startXI.filter(player => player.player.grid.startsWith(`${row}:`)).sort((a, b) => b.player.grid.split(":")[1] - a.player.grid.split(":")[1]);
                  const gapSize = Math.max(1, 20 - playersInRow.length);
                  return (
                    <div key={rowIndex} className="relative max-w-lg w-full flex justify-center flex-wrap" style={{ gap: playersInRow.length <= 4 ? `${gapSize}px` : 'initial' }}>
                      {playersInRow.slice(0, 5).reverse().map((player, index) => {
                        return (
                          <div key={index} className="flex flex-col items-center text-white w-1/6">
                            <img
                              src={
                                statistics.players
                                  ?.find(team => team.team.id === statistics.lineups[selectedTeam].team.id)
                                  ?.players.find(p => p.player.id === player.player.id)
                                  ?.player.photo || player.player.photo
                              }
                              alt={player.player.name}
                              className="w-8 h-8 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-12 lg:h-12 rounded-full border-2 border-white"
                            />
                            <span className="text-gray-100 font-bold text-[12px] px-1 py-0.5 rounded-lg mt-0.5">
                              {player.player.number}. {player.player.name.split(' ').length > 1 ? player.player.name.split(' ').slice(1).join(' ') : player.player.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                });
              })()}
            </div>
            {/* Remplaçants */}
            <div className="mt-4 w-full">
              <h3 className="text-lg font-semibold mb-2 text-center">Remplaçants</h3>
              <div className="flex flex-wrap justify-center gap-2 bg-gradient-to-r from-gray-900 to-black py-4 rounded-lg shadow-lg border-2 border-white">
                {statistics.lineups[selectedTeam].substitutes.map((substitute, index) => (
                  <div key={index} className="flex flex-col items-center text-white w-1/6">
                    <img
                      src={
                        statistics.players
                          ?.find(team => team.team.id === statistics.lineups[selectedTeam].team.id)
                          ?.players.find(p => p.player.id === substitute.player.id)
                          ?.player.photo || substitute.player.photo
                      }
                      alt={substitute.player.name}
                      className="w-8 h-8 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white"
                    />
                    <span className="text-white font-bold text-[10px] px-1 py-0.5 rounded-lg mt-0.5">
                      {substitute.player.number}. {substitute.player.name.split(' ').length > 1 ? substitute.player.name.split(' ').slice(1).join(' ') : substitute.player.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Statistiques des équipes */}
        { statistics.statistics.length != 0 && (
          <div className="max-w-lg h-full w-full sm:w-1/2 my-4 bg-[#1e1e1e] p-4 rounded-lg shadow mx-auto items-center overflow-y-auto" style={{ maxHeight: '850px' }}>
            <h2 className="text-xl font-semibold mb-4 text-center">Statistiques du Match</h2>
            {statistics.statistics[0].statistics.map((stat, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-center text-lg font-medium">{stat.type}</h3>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span>{statistics.statistics[0].statistics[index].value !== null ? statistics.statistics[0].statistics[index].value : 0}</span>
                  <span>{statistics.statistics[1].statistics[index].value !== null ? statistics.statistics[1].statistics[index].value : 0}</span>
                </div>
                <div className="w-full bg-gray-300 h-2 rounded-full relative">
                  <div
                    className="absolute left-0 top-0 h-2 bg-black rounded-full"
                    style={{ backgroundColor: `#${statistics.lineups[0].team.colors.player.primary}`, width: `${parseFloat(statistics.statistics[0].statistics[index].value) / (parseFloat(statistics.statistics[0].statistics[index].value) + parseFloat(statistics.statistics[1].statistics[index].value) || 1) * 100}%` }}
                  ></div>
                  <div
                    className="absolute right-0 top-0 h-2 bg-black rounded-full"
                    style={{ backgroundColor: `#${statistics.lineups[1].team.colors.player.primary}`, width: `${parseFloat(statistics.statistics[1].statistics[index].value) / (parseFloat(statistics.statistics[0].statistics[index].value) + parseFloat(statistics.statistics[1].statistics[index].value) || 1) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;