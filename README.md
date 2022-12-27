# Unleashed Snake

## Goal
- **Technical** :  Create a serverless game App that can use the maximum features of Forge
- **Admin**: Move Productivity, User will get a better game that created more stories, more confluence doc, and resolved More Games.

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

## App Details
- App Id : 3f5a610a-0438-435e-9214-643f7eec30c9
- App Site : https://devsunleashed.atlassian.net/
- Distribution Link : https://developer.atlassian.com/console/myapps/3f5a610a-0438-435e-9214-643f7eec30c9/distribution
- Creds for Demo : Email : liner77937@octovie.com   Password : H@ck@123
- bitbucket repo : https://bitbucket.org/sandeepscet/devsunleashed-hackathon/


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

## Forge Feature Request
- Add more option in storage query api like sort etc , with ttl, Possibly all DB operation so that developer do not need external product API
- Bitbucket integration with Forge [Ticket](https://community.developer.atlassian.com/t/forge-external-oauth2-doesnt-support-atlassian-oauth/55283/8)
- Native Harmless HTML components (<B> , <I> , <BR /> etc) Support in UIKit

## Credit
- [Source of Snake](https://codepen.io/sfaedo/pen/qBOEBG)
- [Typescript Boilerplare](https://github.com/VD39/typescript-webpack-boilerplate)
- [Forge Platform](https://developer.atlassian.com/platform/forge/)