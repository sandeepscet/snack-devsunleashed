import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";
import { storage } from '@forge/api';


const resolver = new Resolver();
const jql = "issuetype = Story AND status = Done AND created >= -15d and assignee = currentUser() order by created DESC";
const cql = `type=page AND (creator=currentUser() or contributor=currentUser()) and created >= "2022/12/20"`;
// jql =issue in updatedBy( "sand", -7d)

resolver.define("getUserDetails", async ({ payload, context }) => {
  const response = await api.asUser().requestJira(route`/rest/api/3/user?accountId=${payload.accountId}`, {
    headers: {
      'Accept': 'application/json',
    }
    });
  console.log(response);
});


resolver.define("jiraIssues", async ({ payload, context }) => {
  const res = await api.asUser().requestJira(route`/rest/api/3/search?jql=${payload.jql}`, {
  headers: {
    'Accept': 'application/json',
  }
  });

    const status = res;
    const data = await res.text();
    return { status, data };
});

resolver.define("confluenceData", async ({ payload, context }) => {
 try {
  const res = await api.asUser().requestConfluence(route`/wiki/rest/api/content/search?cql=${payload.cql}&expand=history`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  
  if(res.status === 200){
    const data = await res.json();
    return data;
  }
  else
  {
    return []; //gracefully
  }  
  
   
 } catch (error) {
  console.log(error);
  return []; //gracefully  
}
    
});



resolver.define("setStorage", async ({ payload }) => {
  storage.set(payload.key, payload.value);
});

resolver.define("getStorage", async ({ payload }) => {
  const res = await storage.get(payload.key);
  return res;
});

resolver.define("deleteStorage", async ({ payload }) => {
  const res = await storage.delete(payload.key);
  return res;
});

export const handler = resolver.getDefinitions();