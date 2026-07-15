import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./Dealers.css";

const Dealer = () => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  let id = params.id;

  const dealer_url = `/djangoapp/dealer/${id}`;
  const reviews_url = `/djangoapp/reviews/dealer/${id}`;

  const get_dealer = async () => {
    const res = await fetch(dealer_url, { method: "GET" });
    const output = await res.json();
    if (output.status === 200 && output.dealer) {
      setDealer(output.dealer);
    }
  };

  const get_reviews = async () => {
    const res = await fetch(reviews_url, { method: "GET" });
    const output = await res.json();
    if (output.status === 200 && output.reviews) {
      if (output.reviews.length > 0) {
        setReviews(output.reviews);
      } else {
        setUnreviewed(true);
      }
    }
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "turquoise" }}>{dealer?.full_name || "Loading Dealer..."}</h1>
        <button 
          onClick={() => navigate(`/postreview/${id}`)}
          style={{ padding: "10px 20px", backgroundColor: "turquoise", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          Post Review
        </button>
      </div>
      
      {dealer && (
        <div className="dealer-details-card" style={{ padding: "15px", backgroundColor: "#f9f9f9", marginTop: "10px", borderRadius: "5px" }}>
          <p><strong>City:</strong> {dealer.city} | <strong>Address:</strong> {dealer.address}</p>
          <p><strong>State:</strong> {dealer.state} | <strong>Zip:</strong> {dealer.zip}</p>
        </div>
      )}
      
      <div className="reviews_panel" style={{ marginTop: "20px" }}>
        <h3 style={{ borderBottom: "2px solid turquoise", paddingBottom: "5px" }}>Dealer Feedback</h3>
        {reviews.length === 0 && !unreviewed ? (
          <p>Loading feedback grids...</p>
        ) : unreviewed ? (
          <p>No feedback posted yet for this dealership setup.</p>
        ) : (
          reviews.map((review, index) => (
            <div className="review_card" key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0", borderRadius: "4px" }}>
              <span style={{ fontWeight: "bold", color: "turquoise", marginRight: "10px" }}>
                [{review.sentiment || "neutral"}]
              </span>
              <span>{review.review}</span>
              <div style={{ fontStyle: "italic", fontSize: "0.85em", color: "#666", marginTop: "5px" }}>
                By: {review.name} {review.car_make ? `(${review.car_make} ${review.car_model} ${review.car_year})` : ""}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;