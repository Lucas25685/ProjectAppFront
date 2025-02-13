// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "Loading...": "Loading...",
        "Bookmaker": "Bookmaker",
        "Bet": "Bet",
        "Value": "Value",
        "Odd": "Odd"
      }
    },
    fr: {
      translation: {
        "Loading...": "Chargement...",
        "Bookmaker": "Bookmaker",
        "Bet": "Pari",
        "Value": "Valeur",
        "Odd": "Impair",
        "Even": "Pair",
        "Home": "Domicile",
        "Away": "Extérieur",
        "Draw": "Nul",
        "Win": "Gagner",
        "Lose": "Perdre",
        "Over": "Plus de",
        "Under": "Moins de",
        "Goal": "But",
        "Goals": "Buts",
        "Goalkeeper": "Gardien de but",
        "Defender": "Défenseur",
        "Midfielder": "Milieu de terrain",
        "Forward": "Attaquant",
        "Coach": "Entraîneur",
        "Substitute": "Remplaçant",
        "Captain": "Capitaine",
        "Match Winner": "Vainqueur du match",
        "Home/Away": "Domicile/Extérieur",
        "Second Half Winner": "Vainqueur de la deuxième mi-temps",
        "Goals Over/Under": "Nombre de Buts",
        "Goals Over/Under First Half": "Nombre de Buts Première Mi-Temps",
        "Goals Over/Under - Second Half": "Nombre de Buts Deuxième Mi-Temps",
        "Both Teams Score": "Les Deux Équipes Marquent",
        "Win to Nil - Home": "Gagner sans encaisser de but - Domicile",
        "Win to Nil - Away": "Gagner sans encaisser de but - Extérieur",
        "Handicap Result": "Pari Écart",
        "Exact Score": "Score Exact",
        "Highest Scoring Half": "Mi-Temps la Plus Prolifique",
        "Correct Score - First Half": "Score Correct - Première Mi-Temps",
        "First Half Winner": "Vainqueur de la Première Mi-Temps",
        "Team To Score First": "Équipe Marquant en Premier",
        "Win Both Halves": "Gagner les Deux Mi-Temps",
        "Total - Home": "Total - Domicile",
        "Total - Away": "Total - Extérieur",
        "Both Teams Score - First Half": "Les Deux Équipes Marquent - Première Mi-Temps",
        "Both Teams To Score - Second Half": "Les Deux Équipes Marquent - Deuxième Mi-Temps",
        "Odd/Even": "Nombre de but Impair/Pair",
        "Odd/Even - First Half": "Impair/Pair - Première Mi-Temps",
        "Results/Both Teams Score": "Résultats/Les Deux Équipes Marquent",
        "Over 0.5": "Plus de 0.5 buts",
        "Over 1.5": "Plus de 1.5 buts",
        "Over 2.5": "Plus de 2.5 buts",
        "Over 3.5": "Plus de 3.5 buts",
        "Over 4.5": "Plus de 4.5 buts",
        "Over 5.5": "Plus de 5.5 buts",
        "Over 6.5": "Plus de 6.5 buts",
        "Under 0.5": "Moins de 0.5 buts",
        "Under 1.5": "Moins de 1.5 buts",
        "Under 2.5": "Moins de 2.5 buts",
        "Under 3.5": "Moins de 3.5 buts",
        "Under 4.5": "Moins de 4.5 buts",
        "Under 5.5": "Moins de 5.5 buts",
        "Under 6.5": "Moins de 6.5 buts",
        "Yes": "Oui",
        "No": "Non",
        "Home +1": "Domicile Gagne de 2 but ou plus",
        "Home +2": "Domicile Gagne de 3 but ou plus",
        "Away +1": "Extérieur Gagne de 2 but ou plus",
        "Away +2": "Extérieur Gagne de 3 but ou plus",
        "Draw +1": "Nul ou 2 but ou plus",
        "Draw +2": "Nul ou 3 but ou plus",
        "No odds available for this fixture.": "Aucune cote disponible pour ce match."
      }
    }
  },
  lng: 'fr', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;