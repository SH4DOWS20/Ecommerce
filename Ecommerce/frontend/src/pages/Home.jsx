import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit} from 'react-icons/ai';
import { BSinfoCircle } from 'react-icons/bs';
import { MdOutelineAddBox, MdOutelineDelete } from 'react-icons/md'
import { error } from 'console';

const Home = () => {
    const [ hats, setHats ] = useState({});
    const [ loading, setLoading ] = useState(false);
    useEffect(() => {
        setLoading(true);
        axios
        .get('http://localhost:5555/Hats')
        .then((response) => {
            setHats(response.data.data);
            setLoading(false);
    })
    .catch((error) => {
        console.log(error);
    });
    }, []);

  return (
    <div>Home</div>
  )
}

export default Home