import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';

const Dealers = () => {
    const [dealersList, setDealersList] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState("All");

    // Mock active deployment endpoint dynamic logic simulation trace
    useEffect(() => {
        const fetchDealers = async () => {
            try {
                const res = await fetch(`/djangoapp/get_dealers/${selectedState}`);
                const data = await res.json();
                setDealersList(data);
            } catch (err) {
                console.error("Error fetching dealers data container rows:", err);
            }
        };
        fetchDealers();
    }, [selectedState]);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh' }}>
            <Header />
            <div style={{ padding: '20px' }}>
                <h2 style={{ color: '#5dd1c8', marginBottom: '15px' }}>Dealership Network Grid Showcase</h2>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Filter Framework Configuration by State Selector:</label>
                    <select 
                        onChange={(e) => setSelectedState(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                    >
                        <option value="All">All States (Full Distribution Layout)</option>
                        <option value="Kansas">Kansas</option>
                        <option value="Texas">Texas</option>
                    </select>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Dealer Name</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>City</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Address</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Zip Code</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>State Code Tag</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Review Action Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dealersList.map((dealer) => (
                            <tr key={dealer.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{dealer.id}</td>
                                <td style={{ padding: '12px', border: '1px solid #dee2e6', color: '#007bff' }}>{dealer.full_name}</td>
                                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{dealer.city}</td>
                                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{dealer.address}</td>
                                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{dealer.zip}</td>
                                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{dealer.state}</td>
                                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                                    <a 
                                        href={`/postreview/${dealer.id}`} 
                                        style={{ color: '#5dd1c8', fontWeight: 'bold', textDecoration: 'none' }}
                                    >
                                        Review Dealer
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dealers;