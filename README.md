# Unleashed Snake

## Goal
- **Technical** :  Create a serverless game App that can use the maximum features of Forge
- **Admin**: Move Productivity, User will get a better game that created more stories, more confluence doc, and resolved More Games.

### Why
- Employees will try to maximize productivity to better initial game. They will focus on all aspects like documentation, stories, bugs, etc as per their set workflow. Using those (hard-earned) blocks, they can get more score. so they need to be productive to get quick better score 
- Organizations/Teams can arrange competitions using this game for overall high score.

### How
- Fetching Data from JIRA and Confluence using JQL/CQL. Since organizations have a different workflow, they can configure dynamic JQL/CQL on the admin screen and set the intial screen of the Game. 

## Features
- Play Snack Game based on Atlassian Product Data
- Individual and Overall HighScore
- Admin Configuration Page for JIRA and Confluence Data
- Getting Started page for Admin

## Demo Video
[Youtube](https://youtu.be/v4AE0hpaMHM)

## Forge Features 
- Modules (JIRA, Confluence, Admin)
- UI (UIKit for Getting Started, Admin Using React CustomUI, App using static Resources
- Storage API
- Resolver , Bridge
- Permission (Scope, External CSS/JS, External Domains , Backend)
- Rest API(JIRA/Confluence)


## Install
### Getting Started
```
npm install
npx forge deploy
npx forge install
npm forge tunnel
```

### Admin Config
```
cd  static/admin
npm install
npm run start
```
### APP
```
cd  static/app
npx yarn install
npx yarn serve
```

## Pending
- [] Snake move after some seconds

## Limitation
- [] Bitbucket integration with Forge (Limitation from Forge Side)

## Credit
- [Source of Snake](https://codepen.io/sfaedo/pen/qBOEBG)
- [Typescript Boilerplare](https://github.com/VD39/typescript-webpack-boilerplate)
- [Forge Platform](https://developer.atlassian.com/platform/forge/)
