"use client";
import React, { useState, useEffect } from "react";

interface BookingProps {
  userName: string;
  userEmail: string;
}

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const BookingPage: React.FC<BookingProps> = ({ userName, userEmail }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    opportunity: "",
  });

  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: userName,
      email: userEmail,
    }));
  }, [userName, userEmail]);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, time }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(formData.name)) {
      setStatusMessage("⚠️ Name must not contain special characters.");
      return;
    }

    if (!formData.date || !formData.time || !formData.opportunity) {
      setStatusMessage("⚠️ Please complete all fields.");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      date: formData.date,
      time: formData.time,
      opportunity: formData.opportunity,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const booking = await response.json();
        setStatusMessage("✅ Booking confirmed!");
        setFormData((prev) => ({
          ...prev,
          date: "",
          time: "",
          opportunity: "",
        }));
      } else {
        const error = await response.json();
        setStatusMessage(
          `❌ Booking failed: ${error.message || "Please try again."}`
        );
      }
    } catch (error) {
      setStatusMessage("⚠️ Error connecting to server.");
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-banner">
        <h1 className="booking-banner-title">Book a Meeting</h1>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <label className="booking-label">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="booking-input"
        />

        <label className="booking-label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="booking-input"
        />

        <label className="booking-label">Select Date</label>
        <input
          type="date"
          name="date"
          min={today}
          value={formData.date}
          onChange={handleChange}
          required
          className="booking-input"
        />

        {formData.date && (
          <>
            <label className="booking-label">Select Time</label>
            <div className="booking-time-grid">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => handleTimeSelect(slot)}
                  className={`booking-time-slot ${
                    formData.time === slot ? "booking-selected-slot" : ""
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </>
        )}

        <label className="booking-label">Select Opportunity</label>
        <select
          name="opportunity"
          value={formData.opportunity}
          onChange={handleChange}
          required
          className="booking-select"
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="Freight Intelligence">
            Opportunity 1 – Freight Intelligence
          </option>
          <option value="Project Cerebrum">
            Opportunity 2 – Project Cerebrum
          </option>
          <option value="AJK Powertrains">
            Opportunity 3 – AJK Powertrains
          </option>
        </select>

        <button type="submit" className="booking-button">
          Book Now
        </button>
        {statusMessage && <p className="booking-status">{statusMessage}</p>}
      </form>
    </div>
  );
};

export default BookingPage;
