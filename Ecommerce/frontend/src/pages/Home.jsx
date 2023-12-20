import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BSinfoCircle } from 'react-icons/bs';
import { MdOutelineAddBox, MdOutelineDelete } from 'react-icons/md'
import { error } from 'console';

const Home = () => {
    const [hats, setHats] = useState({});
    const [loading, setLoading] = useState(false);
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
                setLoading(false);
            });
    }, []);

    return (
        <div className='p-4'>
            <div className='flex justify-between items center'>
                <h1 className='text 3x1 my-8'>Hats List</h1>
                <Link to='/hats/create'>
                    <MdOutelineAddBox className=' text-sky-800 text 4x1' />

                </Link>
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <table className='w-full border-seperate border spacing-2'>
                    <thead>
                        <tr>
                            <th className='border border-slate-600 rounded-md'>No</th>
                            <th className='border border-slate-600 rounded-md'>Title</th>
                            <th className='border border-slate-600 rounded-md'>Price</th>
                            <th className='border border-slate-600 rounded-md'>SKU</th>
                            <th className='border border-slate-600 rounded-md'>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hats.map((hats, index) => (
                            <tr keys={hats._id}className='h-8'>
                                <td className='border border-slate-700 rounded-md text-center'>

                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            )}
        </div>
    )
}

export default Home