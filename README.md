# Sales & Salaris

Een Nederlandstalige salariscalculator voor Ziggo- en Vodafone-sales. Vul per maand de verkochte aantallen in. Het overzicht rekent direct mee en trekt altijd één keer € 70 licentiekosten af, ook wanneer er geen sales zijn.

| Abonnement | Vergoeding per sale |
| --- | ---: |
| Ziggo internet + TV, 2 jaar | € 70 |
| Ziggo alleen internet, 2 jaar | € 70 |
| Ziggo internet + TV, 1 jaar | € 35 |
| Ziggo alleen internet, 1 jaar | € 35 |
| Vodafone Unlimited | € 30 |
| Overige Vodafone-abonnementen | € 10 |

## Starten

Vereist: Python 3 voor de lokale server. Node.js 18+ voor de tests. Er zijn geen te installeren pakketten.

```sh
cd /workspace/salaris-sales-progamma
npm start
```

De server luistert op poort 3000. Open de app via een HTTP-server; rechtstreeks openen als bestand werkt niet met de JavaScript-modules. Google Fonts zijn optioneel; zonder internet gebruikt de app systeemlettertypen.

```sh
npm test
```

Sales worden per maand in `localStorage` van je browser bewaard. Er is geen account of synchronisatie tussen apparaten. Bij het wissen van browsergegevens verdwijnen de opgeslagen aantallen. De maand wordt bij openen bepaald volgens de tijdzone Europe/Amsterdam. De uitkomst is na licentiekosten en vóór eventuele belastingen en andere inhoudingen.

## Online publiceren met GitHub Pages

De workflow `.github/workflows/deploy-pages.yml` test en publiceert de website bij wijzigingen op `main`. Zet in de GitHub-repository onder **Settings → Pages → Build and deployment → Source** de bron op **GitHub Actions**. Start daarna de workflow **Publiceer salariscalculator** via **Actions → Run workflow**, of push een wijziging naar `main`.

Na een geslaagde publicatie staat de openbare link in de deployment van de workflow. Voor deze repository is de verwachte URL `https://finndijk1122-program.github.io/salaris-sales-progamma/`. Deze URL werkt pas nadat GitHub Pages is ingeschakeld en de publicatie is geslaagd. Een privérepository kan een betaald GitHub-abonnement vereisen voor Pages; maak de repository niet openbaar zonder dit bewust te kiezen.

Iedereen met de openbare link kan de calculator gebruiken. Sales worden niet meegepubliceerd: ze blijven in de browser waarin je ze invult. Dezelfde sales op verschillende apparaten bekijken vereist aanvullende synchronisatie en is nog niet ingebouwd.
