import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/shared/Spinner';
import Layout from '../components/shared/Layout/Layout';
// import { initializeApp } from 'firebase/app'; // Import Firebase
import { database } from "./firebase";
import { ref, query, equalTo, get } from 'firebase/database'; // Import Realtime Database functions

// import { firebaseConfig } from './firebase';
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

const HomePage = () => {
    const { loading, error, user } = useSelector((state) => state.auth);
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const dataRef = ref(database, 'UserDetails');
            const q = query(dataRef, equalTo('uniqueId', user?.uid));

            // console.log(user?.uid);
            const snapshot = await get(q);

            // if (!snapshot.exists()) {
            //     navigate('/contact');
            //     return;
            // }

            setData(snapshot.val());
        };

        fetchData();
    }, [user, navigate]);

    return (
        <Layout>
            <div>
                <br />
                <h1 style={{ fontSize: "26px" }}>Dashboard</h1>
                <br /><br /><br />
                <form>
                    <div className="form-group" style={{ display: "flex", alignItems: "center" }}>
                        <label htmlFor="pnr" style={{ marginRight: "10px" }}>Enter PNR</label>
                        <input type="text" className="form-control" id="pnr" style={{ border: "1px solid #000" }} placeholder="Enter your PNR" />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button type="submit" className="btn btn-primary" style={{ color: "black" }}>Submit</button>
                    </div>
                </form>
            </div>

        </Layout>
    );
};

export default HomePage;
