import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";

const resolver = new Resolver();
const jql = "issuetype = Story AND status = Done AND created >= -30d and assignee = 557058:82157806-a458-49bd-807e-87d5098f609d order by created DESC";


resolver.define("exampleFunctionKey", async ({ payload, context }) => {
  const res = await api.asUser().requestJira(route`/rest/api/3/search?jql=${jql}`, {
  headers: {
    'Accept': 'application/json',
  }
  });

    const status = res;
    const data = await res.text();

    console.log({status,data});

    return { status, data };
});

export const handler = resolver.getDefinitions();