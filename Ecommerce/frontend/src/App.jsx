import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import axios from 'axios'



function App() {
 
  
/*
// this commented out section is to pull data that is stored in server.js server side
  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
      fetch("/api").then(
        response => response.json()
      ).then(
        data => {
          setBackendData(data)
        }
      )
    }, []  )

    return (
      <div>
        
        {(typeof backendData.users === 'undefined') ? (
          <p>Loading Data....</p>
        ) : (
          backendData.users.map((user, i) => (
            <p key={i}>{user}</p>
          ))
        )}
        
      </div>
    )
  }
*/


// Pull Data from DB using Server side connection

  const [products, setProducts] = useState([{}])

  useEffect(() => {
    axios.get('http://localhost:5000/getProducts')
    .then(products => setProducts(products.data))
    .catch(err => console.log(err))
  }, [])

   
  return (
    
    <form>
    <div className='W100 vh-100 d-flex justify-content-center align-items-center'>
      <div className='w-50'>
        <table className='table'>
          <thead>
            <tr>
              <tr>
                Category
              </tr>
              <th>
                SKU
              </th>
              <th>
                Price
              </th>
              <th>QTY</th>
            </tr>
          </thead>
          <tbody>
            {
              products.map(products => {
                return <tr>
                  <td>{products.category}</td>
                  <td>{products.item}</td>
                  <td>{products.price}</td>
                  <td>{products.quantity}</td>
              </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
    </form>
  )
}


export default App