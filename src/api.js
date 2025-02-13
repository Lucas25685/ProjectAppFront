export async function fetchMatches(date) {
    const response = await fetch(`http://localhost:4800/matches?date=${date}`);
    const data = await response.json();
    return data;
  }