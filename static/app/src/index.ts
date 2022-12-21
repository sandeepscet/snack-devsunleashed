/* eslint-disable  @typescript-eslint/no-explicit-any */

import { invoke } from '@forge/bridge';

invoke('getStorage', { key: 'config' }).then((config: any) => {
  if(!config && Object.keys(config).length === 0)
  {
    alert('App Config Pending, Please check with your JIRA admin');
  }else
  {
    
    const invokeArr = [];
    for (const element of config) {

      const invokePromise = invoke('jiraIssues' , { jql : element.ql}).then((returnedData: any) => {
        if (returnedData.status.status === 200) {
          const data  = JSON.parse(returnedData.data);
          const resolvedDates = getJiraResolvedData(data , element.field);
          return resolvedDates;
        }
        return [];
      }); 

      invokeArr.push(invokePromise);
    }

    Promise.all(invokeArr).then((values) => {
      console.log(values);
    });

  }
  
});

function getJiraResolvedData(jqlResult: any , field:string) {
  console.log(field);
  const jiraResolvedDates = [];
  for (let index = 0; index < jqlResult.total; index++) {
    jiraResolvedDates.push(jqlResult['issues'][index]['fields'][field]);
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
