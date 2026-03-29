import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Login Page
    appName: "TimeAway",
    tagline: "Chronicle your absence from the realm",
    warrior: "Warrior",
    overseer: "Overseer",
    realmSigil: "Realm Sigil",
    enterSigil: "Enter the ancient sigil...",
    openGates: "Open the Gates",
    unsealing: "Unsealing...",
    clanId: "Clan Identifier (Optional)",
    enterClanId: "Enter your clan's sigil...",
    clanIdHint: "Enter your Discord server ID to use your clan name",
    enterDiscord: "Enter via Discord",
    openingPortal: "Opening Portal...",
    overseerSigil: "Overseer Sigil",
    enterOverseerSigil: "Enter the overseer's mark...",
    accessSanctum: "Access Sanctum",
    verifyingAuth: "Verifying Authority...",
    footer: "Absence tracking for the damned",
    
    // Toast messages
    gatesOpened: "The gates have opened...",
    invalidSigil: "Invalid sigil. Access denied.",
    portalSealed: "The portal is sealed. Configure Discord OAuth.",
    welcomeOverseer: "Welcome, Overseer.",
    lackAuthority: "You lack the authority.",
    welcomeToRealm: "Welcome to the realm!",
    authFailed: "Authentication failed",
    noTokenReceived: "No token received",
    authenticating: "Entering the realm...",
    serverDetected: "Server ID detected from link",
    
    // Dashboard
    absenceChronicle: "Absence Chronicle",
    myAbsences: "My Absences",
    noAbsences: "No absences marked",
    leaveRealm: "Leave the Realm",
    markAbsence: "Mark Absence",
    cancel: "Cancel",
    clickStartDate: "Click on a start date",
    clickEndDate: "Now click on an end date",
    singleDayHint: "Now click on an end date (or same day for single day absence)",
    startDate: "Start Date",
    endDate: "End Date",
    reasonOptional: "Reason (Optional)",
    reasonPlaceholder: "Why must you leave the realm?",
    recordAbsence: "Record Absence",
    confirmAbsence: "Confirm Absence",
    amendRecord: "Amend Record",
    updateRecord: "Update Record",
    purge: "Purge",
    more: "more",
    selectDates: "Select thy dates of absence",
    failedToLoad: "Failed to commune with the realm",
    absenceRecorded: "Absence recorded in the chronicles",
    failedToRecord: "The scribes have failed",
    chroniclesAmended: "The chronicles have been amended",
    failedToAmend: "Failed to amend the chronicles",
    absencePurged: "Absence purged from the chronicles",
    failedToPurge: "Failed to purge record",
    
    // Moderator
    realmAdmin: "Realm Administrator",
    warriors: "Warriors",
    all: "All",
    none: "None",
    allAbsences: "All Absences",
    sigilSettings: "Sigil Settings",
    leaveSanctum: "Leave Sanctum",
    viewing: "Viewing",
    of: "of",
    totalWarriors: "Total Warriors",
    activeAbsences: "Active Absences",
    totalRecords: "Total Records",
    changeRealmSigil: "Change Realm Sigil",
    realmSigilHint: "The sigil warriors must enter to access the realm",
    newRealmSigil: "New realm sigil...",
    update: "Update",
    changeOverseerSigil: "Change Overseer Sigil",
    overseerSigilHint: "Your administrative access. You'll be logged out after changing.",
    newOverseerSigil: "New overseer sigil...",
    hideSigils: "Hide Sigils",
    revealSigils: "Reveal Sigils",
    close: "Close",
    noWarriors: "No warriors yet",
    noAbsencesRecorded: "No absences recorded",
    failedToUpdate: "Failed to update sigil",
    
    // Messages
    summoningChronicles: "Summoning the chronicles...",
    openingSanctum: "Opening the Sanctum...",
    realmSigilUpdated: "Realm sigil updated!",
    overseerSigilUpdated: "Overseer sigil updated! Re-authenticate.",
    enterNewRealmSigil: "Enter a new realm sigil",
    enterNewOverseerSigil: "Enter a new overseer sigil",
    purgeConfirm: "Purge absence record for",
  },
  pl: {
    // Login Page
    appName: "TimeAway",
    tagline: "Zapisz swoją nieobecność w królestwie",
    warrior: "Wojownik",
    overseer: "Nadzorca",
    realmSigil: "Sigil Królestwa",
    enterSigil: "Wprowadź starożytny sigil...",
    openGates: "Otwórz Bramy",
    unsealing: "Otwieranie...",
    clanId: "Identyfikator Klanu (Opcjonalnie)",
    enterClanId: "Wprowadź sigil swojego klanu...",
    clanIdHint: "Wprowadź ID serwera Discord, aby użyć nazwy klanu",
    enterDiscord: "Wejdź przez Discord",
    openingPortal: "Otwieranie Portalu...",
    overseerSigil: "Sigil Nadzorcy",
    enterOverseerSigil: "Wprowadź znak nadzorcy...",
    accessSanctum: "Wejdź do Sanktuarium",
    verifyingAuth: "Weryfikacja Uprawnień...",
    footer: "Śledzenie nieobecności dla potępionych",
    
    // Toast messages
    gatesOpened: "Bramy zostały otwarte...",
    invalidSigil: "Nieprawidłowy sigil. Odmowa dostępu.",
    portalSealed: "Portal jest zapieczętowany. Skonfiguruj Discord OAuth.",
    welcomeOverseer: "Witaj, Nadzorco.",
    lackAuthority: "Brakuje ci uprawnień.",
    welcomeToRealm: "Witaj w królestwie!",
    authFailed: "Uwierzytelnianie nie powiodło się",
    noTokenReceived: "Nie otrzymano tokena",
    authenticating: "Wchodzenie do królestwa...",
    serverDetected: "ID serwera wykryte z linku",
    
    // Dashboard
    absenceChronicle: "Kronika Nieobecności",
    myAbsences: "Moje Nieobecności",
    noAbsences: "Brak oznaczonych nieobecności",
    leaveRealm: "Opuść Królestwo",
    markAbsence: "Oznacz Nieobecność",
    cancel: "Anuluj",
    clickStartDate: "Kliknij datę początkową",
    clickEndDate: "Teraz kliknij datę końcową",
    singleDayHint: "Teraz kliknij datę końcową (lub tę samą dla jednego dnia)",
    startDate: "Data Początkowa",
    endDate: "Data Końcowa",
    reasonOptional: "Powód (Opcjonalnie)",
    reasonPlaceholder: "Dlaczego musisz opuścić królestwo?",
    recordAbsence: "Zapisz Nieobecność",
    confirmAbsence: "Potwierdź Nieobecność",
    amendRecord: "Edytuj Wpis",
    updateRecord: "Aktualizuj Wpis",
    purge: "Usuń",
    more: "więcej",
    selectDates: "Wybierz daty nieobecności",
    failedToLoad: "Nie udało się połączyć z królestwem",
    absenceRecorded: "Nieobecność zapisana w kronikach",
    failedToRecord: "Skrybowie zawiedli",
    chroniclesAmended: "Kroniki zostały zaktualizowane",
    failedToAmend: "Nie udało się zaktualizować kronik",
    absencePurged: "Nieobecność usunięta z kronik",
    failedToPurge: "Nie udało się usunąć wpisu",
    
    // Moderator
    realmAdmin: "Administrator Królestwa",
    warriors: "Wojownicy",
    all: "Wszyscy",
    none: "Żaden",
    allAbsences: "Wszystkie Nieobecności",
    sigilSettings: "Ustawienia Sigili",
    leaveSanctum: "Opuść Sanktuarium",
    viewing: "Wyświetlanie",
    of: "z",
    totalWarriors: "Liczba Wojowników",
    activeAbsences: "Aktywne Nieobecności",
    totalRecords: "Wszystkie Wpisy",
    changeRealmSigil: "Zmień Sigil Królestwa",
    realmSigilHint: "Sigil wymagany do wejścia do królestwa",
    newRealmSigil: "Nowy sigil królestwa...",
    update: "Aktualizuj",
    changeOverseerSigil: "Zmień Sigil Nadzorcy",
    overseerSigilHint: "Twój dostęp administratora. Zostaniesz wylogowany po zmianie.",
    newOverseerSigil: "Nowy sigil nadzorcy...",
    hideSigils: "Ukryj Sigile",
    revealSigils: "Pokaż Sigile",
    close: "Zamknij",
    noWarriors: "Brak wojowników",
    noAbsencesRecorded: "Brak zapisanych nieobecności",
    failedToUpdate: "Nie udało się zaktualizować sigila",
    
    // Messages
    summoningChronicles: "Przywoływanie kronik...",
    openingSanctum: "Otwieranie Sanktuarium...",
    realmSigilUpdated: "Sigil królestwa zaktualizowany!",
    overseerSigilUpdated: "Sigil nadzorcy zaktualizowany! Zaloguj się ponownie.",
    enterNewRealmSigil: "Wprowadź nowy sigil królestwa",
    enterNewOverseerSigil: "Wprowadź nowy sigil nadzorcy",
    purgeConfirm: "Usunąć wpis nieobecności dla",
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('timeaway_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('timeaway_language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
