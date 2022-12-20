/* eslint-disable  @typescript-eslint/no-explicit-any */

import { invoke } from '@forge/bridge';

invoke('jiraIssues').then((returnedData: any) => {
  if (returnedData.status.status === 200) {
    getJiraResolvedDates(returnedData);
  }
});

invoke('confluenceData').then((returnedData: any) => {
  console.log(returnedData);
  console.log(JSON.parse(returnedData.data));
  if (returnedData.status.status === 200) {
    getConfluenceCreatedDates(returnedData);
  }
});

/*
invoke('setStorage', { key: 'time', value: 'JIRA' }).then((returnedData: any) => {
  console.log(returnedData);
});
*/

invoke('getStorage', { key: 'time' }).then((returnedData: any) => {
  console.log(returnedData);
});

function getJiraResolvedDates(jqlResult: any) {
  const jiraResolvedDates = [];
  for (let index = 0; index < jqlResult.size; index++) {
    jiraResolvedDates.push(jqlResult['issues'][index]['results']['id']);
  }
  return jiraResolvedDates;
}

function getConfluenceCreatedDates(jqlResult: any) {
  const createdDates = [];
  for (let index = 0; index < jqlResult.total; index++) {
    createdDates.push(jqlResult['issues'][index]['resolutiondate']);
  }
  return createdDates;
}

/**
 * Will find #root element and set HTML to "Hello World!".
 */
function updateDom(): void {
  const root = document.getElementById('root'); // Get root element.
  if (root) {
    root.innerHTML = '<p>Hello , Sandip</p>'; // Set html of the root element.
  }
}

updateDom();
