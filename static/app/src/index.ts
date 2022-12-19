import { invoke } from '@forge/bridge';

invoke('exampleFunctionKey', { name: 'exampleFunctionKey' }).then(
  (returnedData :any) => {
    if(returnedData.status.status === 200){
      console.log(JSON.parse(returnedData.data));
      updateDom(returnedData);
    }
    
    
  }
);

/**
 * Will find #root element and set HTML to "Hello World!".
 */
function updateDom(resolverData: unknown): void {
  const root = document.getElementById('root'); // Get root element.
  if (root) {
    root.innerHTML = `<p>${JSON.stringify(resolverData)}</p>`; // Set html of the root element.
  }
}
