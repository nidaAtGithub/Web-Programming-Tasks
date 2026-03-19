// ============================================================
// Contact.tsx — Contact page with a controlled form
//
// Each input is a "controlled component":
//   - value={state}          → React controls what's shown
//   - onChange={handler}     → state updates on every keystroke
//
// On submit:
//   - e.preventDefault()     → stops page from reloading
//   - console.log(formData)  → logs all entered data
//   - form fields cleared    → state reset to empty strings
// ============================================================

import React, { useState } from 'react';

// Shape of the form data
interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {

  // ── Controlled form state ──────────────────────────────
  // Each field is stored in state. When the user types,
  // onChange updates the state, and value= keeps the input
  // in sync with state (this is what "controlled" means).
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  // Whether to show the success message after submit
  const [submitted, setSubmitted] = useState<boolean>(false);

  // ── Single onChange handler for all fields ─────────────
  // e.target.name matches the "name" attribute on each input,
  // so one handler updates whichever field changed.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,   // keep the other fields unchanged
      [name]: value,  // update only the field that changed
    }));

    // Hide success message if user starts typing again
    setSubmitted(false);
  };

  // ── Submit handler ─────────────────────────────────────
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 1. Prevent default browser form submission (no page reload)
    e.preventDefault();

    // 2. Log the entered data to the console
    console.log('Form submitted:', formData);

    // 3. Show success message in the UI
    setSubmitted(true);

    // 4. Clear all form fields back to empty strings
    setFormData({ name: '', email: '', message: '' });
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="page">
      <div className="card">
        <h1>Contact Us</h1>
        <p style={{ marginBottom: 24 }}>
          Fill in the form below and click Send. Your data will be
          logged to the browser console (press F12 to see it).
        </p>

        <form onSubmit={handleSubmit}>

          {/* Name field — controlled input */}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}        // controlled: value from state
              onChange={handleChange}      // updates state on every keystroke
              required
            />
          </div>

          {/* Email field — controlled input */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}       // controlled
              onChange={handleChange}
              required
            />
          </div>

          {/* Message field — controlled textarea */}
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              value={formData.message}     // controlled
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Send Message
          </button>

        </form>

        {/* Success message — shown after submit */}
        {submitted && (
          <div className="success-msg">
            Message sent! Check the browser console (F12) to see the logged data.
          </div>
        )}

      </div>
    </div>
  );
};

export default Contact;
