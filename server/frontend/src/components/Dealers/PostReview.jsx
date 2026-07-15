import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./Dealers.css";

const PostReview = () => {
  const [cars, setCars] = useState([]);
  const [carMake, setCarMake] = useState("");
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [dealer, setDealer] = useState({});
  
  const params = useParams();
  const navigate = useNavigate();
  let dealerId = params.id;

  const get_cars_list = async () => {
    try {
      const res = await fetch("/djangoapp/get_cars", { method: "GET" });
      const output = await res.json();
      console.log("Cars API Output:", output); // Debug log framework trace
      const carList = output.CarModels || output.car_models || [];
      setCars(carList);
    } catch (error) {
      console.error("Failed to fetch vehicles list:", error);
    }
  };

  const get_dealer_details = async () => {
    try {
      const res = await fetch(`/djangoapp/dealer/${dealerId}`, { method: "GET" });
      const output = await res.json();
      if (output.status === 200 && output.dealer) {
        setDealer(output.dealer);
      }
    } catch (error) {
      console.error("Failed to fetch dealer data maps:", error);
    }
  };

  useEffect(() => {
    get_cars_list();
    get_dealer_details();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carMake) {
      alert("Please select a car model frame from the dropdown list!");
      return;
    }
    const carDetails = carMake.split(" "); 
    const payload = {
      name: name,
      dealership: dealerId,
      review: review,
      car_make: carDetails[0] || "",
      car_model: carDetails[1] || "",
      car_year: carDetails[2] || ""
    };

    const res = await fetch("/djangoapp/add_review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (res.status === 200) {
      navigate(`/dealer/${dealerId}`);
    }
  };

  return (
    <div style={{ margin: "40px", padding: "20px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "turquoise" }}>Review Submission for: {dealer?.full_name || "Dealer Profile"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "600px" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontWeight: "bold" }}>Your Name:</label>
          <input type="text" placeholder="Enter your full name" required onChange={(e) => setName(e.target.value)} style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontWeight: "bold" }}>Review Content:</label>
          <textarea placeholder="Share your experience content details..." required onChange={(e) => setReview(e.target.value)} rows="5" style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontWeight: "bold" }}>Vehicle Configuration Framework:</label>
          <select required onChange={(e) => setCarMake(e.target.value)} style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "#fff" }}>
            <option value="">Select Car Model Frame (Expands Dynamically)</option>
            {cars && cars.length > 0 ? (
              cars.map((car, idx) => (
                <option key={idx} value={`${car.CarMake} ${car.CarModel} ${car.CarYear}`}>
                  {car.CarMake} - {car.CarModel} ({car.CarYear})
                </option>
              ))
            ) : (
              <option disabled value="">No models available in backend storage</option>
            )}
          </select>
        </div>
        
        <button type="submit" style={{ padding: "12px", backgroundColor: "turquoise", color: "#fff", cursor: "pointer", border: "none", borderRadius: "4px", fontWeight: "bold", fontSize: "1.05em", marginTop: "10px" }}>
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default PostReview;