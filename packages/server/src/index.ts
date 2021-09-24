// Our code is being watched and recompiled now thanks to ts-node-dev
 
import express, { Application } from 'express'; 

const PORT = 8080; 

const app: Application = express(); 

app.get('/', (req, res) => res.send('Express is successfully running!'));  

app.listen(PORT, () => { 

  console.log(`Server is running at http://localhost:${PORT}`); 

}); 
