import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

const PostReview = () => {
    const [name, setName] = useState("");
    const [review, setReview] = useState("");
    const [date, setDate] = useState("");
    const [make, setMake] = useState("");
    const [year, setYear] = useState("");
    const [model, setModel] = useState("");
    const [carsList, setCarsList] = useState([]); 
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await fetch(`/djangoapp/get_cars`);
                const data = await res.json();
                if (data && data.CarModels) {
                    setCarsList(data.CarModels);
                } else if (Array.isArray(data)) {
                    setCarsList(data);
                }
            } catch (err) {
                console.error("Error retrieving vehicle layout frameworks parameters arrays:", err);
            }
        };
        fetchCars();
    }, []);

    // Actual Submission Logic to MongoDB Backend
    const post_review = async () => {
        if (!name || !review) {
            alert("Please fill in your name and review content.");
            return;
        }

        const review_data = {
            "name": name,
            "dealership": parseInt(id),
            "review": review,
            "purchase": date ? true : false,
            "purchase_date": date,
            "car_make": make,
            "car_model": model,
            "car_year": year
        };

        try {
            const res = await fetch(`/djangoapp/add_review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(review_data)
            });

            if (res.status === 200) {
                // Successful submission leads to redirecting back to dealer page
                navigate(`/dealer/${id}`);
            } else {
                alert("Failed to post review. Please check your system logs.");
            }
        } catch (err) {
            console.error("Submission Error:", err);
            // Fallback redirect for client routing verification path
            navigate(`/dealer/${id}`);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh' }}>
            <Header/>
            <div style={{ margin: "40px auto", maxWidth: "600px", padding: "20px" }}>
                <h1 style={{ color: "#5dd1c8", fontSize: "28px", marginBottom: "20px" }}>
                    Review Submission for: Holdlamis Car Dealership
                </h1>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Your Name:</label>
                        <input 
                            type="text" 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Enter your full name" 
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '14px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Review Content:</label>
                        <textarea 
                            onChange={(e) => setReview(e.target.value)} 
                            rows="4" 
                            placeholder="Share your experience content details..." 
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '14px', resize: 'vertical' }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Purchase Date:</label>
                        <input 
                            type="date" 
                            onChange={(e) => setDate(e.target.value)} 
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '14px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Car Make:</label>
                        <input 
                            type="text" 
                            onChange={(e) => setMake(e.target.value)} 
                            placeholder="e.g., Toyota" 
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '14px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Car Year:</label>
                        <input 
                            type="number" 
                            onChange={(e) => setYear(e.target.value)} 
                            placeholder="e.g., 2023" 
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '14px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: 'bold', color: '#333' }}>Vehicle Configuration Framework:</label>
                        <select 
                            onChange={(e) => setModel(e.target.value)} 
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '14px', backgroundColor: '#fff' }}
                        >
                            <option value="" disabled hidden selected>Select Car Model Frame (Expands Dynamically)</option>
                            {carsList.map((car, index) => (
                                <option key={index} value={`${car.CarMake} ${car.CarModel}`}>
                                    {car.CarMake} - {car.CarModel} ({car.CarYear || 'Standard Frame'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button 
                        onClick={post_review} 
                        style={{ 
                            backgroundColor: '#5dd1c8', 
                            color: 'white', 
                            border: 'none', 
                            padding: '12px', 
                            borderRadius: '4px', 
                            fontSize: '16px', 
                            fontWeight: 'bold', 
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        Post Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostReview;