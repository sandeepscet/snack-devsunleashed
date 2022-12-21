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
      invokeArr.push(element.ql);
    }
    /*
   
    */

    const jql = "issuetype = Story AND status = Done AND created >= -15d and assignee = currentUser() order by created DESC";
    
    const invokePromise1 = invoke('jiraIssues' , { jql : jql}).then((returnedData: any) => {
      if (returnedData.status.status === 200) {
        const data  = JSON.parse(returnedData.data);
        const resolvedDates = getJiraResolvedDates(data);
        return resolvedDates;
      }
    }); 

    const invokePromise2 = invoke('jiraIssues' , { jql : jql}).then((returnedData: any) => {
      if (returnedData.status.status === 200) {
        const data  = JSON.parse(returnedData.data);
        const resolvedDates = getJiraResolvedDates(data);
        return resolvedDates;        
      }
    }); 

    Promise.all([invokePromise1,invokePromise2]).then((values) => {
      console.log(values);
    });

  }
  
});

function getJiraResolvedDates(jqlResult: any) {
  const jiraResolvedDates = [];
  for (let index = 0; index < jqlResult.total; index++) {
    jiraResolvedDates.push(jqlResult['issues'][index]['fields']['created']);
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
