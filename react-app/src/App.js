import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://34.30.225.59/test') // Update with the external IP address of the Spring Boot service
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error making the request!', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React App</h1>
        {data ? <p>{data}</p> : <p>Loading...</p>}
      </header>
    </div>
  );
}

export default App;
