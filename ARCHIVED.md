# Arkiveret 18. september 2026

Projektet er pensioneret. Railway-projektet `HabitTracker` er afkoblet fra
GitHub og slettet.

HabitTracker var en Next.js-app til at score daglige vaner på en skala og se dem
som en interaktiv ring-visualisering med ugentlige gennemsnit og statusoverblik.
Ingen auth, ingen database.

**Data er sikret først.** Appen gemte i `data/habits.json` på containerens
ephemere filsystem — ikke på et volume — så registreringerne fandtes kun i den
kørende container, der havde kørt siden 2. april 2026. De er hentet ud via
`/api/config` og `/api/entries` og ligger i `data-backup-railway/`, uden for git
da repoet er offentligt og data er personlige.

**Sidste tilstand:** Kørte på `habittracker-production-0db5.up.railway.app` med
auto-deploy fra `hxnnxng/habittracker`. Kun én deployment nogensinde, fra
2. april 2026. Seneste registrering: 17. maj 2026.

**Bemærk:** Der fandtes ingen lokal kopi af dette projekt — koden lå kun på
GitHub og Railway. Denne mappe er klonet fra GitHub ved arkiveringen.
