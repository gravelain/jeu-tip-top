import React, { useState } from "react";
import axios from 'axios'; // Import axios for API call
import StaticPageLayout from '../../components/StaticPageLayout'; // Import the layout
// Removed: import "../Contact/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error for the field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    setSubmitSuccess(false); // Clear success message on new change
    setSubmitError(null); // Clear submission error on new change
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est obligatoire.";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Le nom est obligatoire.";
      }
      if (!formData.subject.trim()) {
        newErrors.subject = "Le sujet est obligatoire.";
      }
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est obligatoire.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Le message est obligatoire.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);

    if (validateForm()) {
      setIsSubmitting(true);
      // Create payload matching backend expectations
      const payload = {
          userName: `${formData.firstName} ${formData.lastName}`, // Combine first and last name for 'nom'
          email: formData.email, // Map email to adresse_mail
          subject: formData.subject,
          message: formData.message
      };
      
      try {
        // Use environment variable for API URL is better practice, but keeping localhost for now
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact/contact`,payload); // Corrected URL: removed '/send' 
        //const response = await axios.post('https://www.api.dsp5-archi-f24a-15m-g3.fr/api/contact/', payload); 
        
        console.log('Backend Response:', response.data); // <-- Log the actual response data

        // Check backend success message (adjust if backend sends different success indicator)
        if (response.data.message === "Votre message a bien été envoyé avec succès !") { // More specific check
            setSubmitSuccess(true);
            setFormData({ firstName: "", lastName: "", subject: "", email: "", message: "" }); // Reset form
            setErrors({});
        } else {
            // If backend indicates success differently, adjust here
            // Otherwise, assume non-specific success response might be an issue
             throw new Error(response.data.message || 'Une erreur inattendue est survenue côté serveur.');
        }

      } catch (error) {
        console.error("Contact form submission error:", error);
        // Check for specific backend error structure if available
        setSubmitError(error.response?.data?.error || error.message || "Erreur lors de l'envoi du formulaire.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Helper function to get input class names with error state
  const getInputClassName = (fieldName) => {
    let baseClasses = "appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm";
    let borderClasses = errors[fieldName] ? "border-red-500" : "border-gray-300";
    let roundingClasses;
    switch (fieldName) {
        case 'firstName': roundingClasses = 'rounded-t-md'; break;
        case 'message': roundingClasses = 'rounded-b-md'; break;
        default: roundingClasses = 'rounded-none';
    }
    return `${baseClasses} ${borderClasses} ${roundingClasses}`;
  }
  
  const getTextAreaClassName = (fieldName) => {
    let baseClasses = "appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-b-md";
    let borderClasses = errors[fieldName] ? "border-red-500" : "border-gray-300";
    return `${baseClasses} ${borderClasses}`;
}

  // Use StaticPageLayout
  return (
    <StaticPageLayout title="Contactez-nous">
      {/* Center the form container within the layout */}
      <div className="max-w-md mx-auto w-full space-y-8 bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-200">
        {/* Removed redundant title h2 */}
        <form onSubmit={handleSubmit} className="space-y-6">
            {submitSuccess && (
                 <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert" id="success-message">
                    <span className="block sm:inline">Votre message a été envoyé  ! Nous vous répondrons bientôt.</span>
                </div>
            )}
             {submitError && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert" id="error-message">
                    <span className="block sm:inline">Erreur: {submitError}</span>
                </div>
            )}
          <div className="rounded-md shadow-sm -space-y-px">
             {/* First Name */}
            <div>
              <label htmlFor="firstName" className="sr-only">Prénom</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={getInputClassName('firstName')}
                placeholder="Prénom *"
              />
               {errors.firstName && <p className="text-red-500 text-xs italic pt-1">{errors.firstName}</p>}
            </div>
             {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="sr-only">Nom</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={getInputClassName('lastName')}
                placeholder="Nom *"
              />
                {errors.lastName && <p className="text-red-500 text-xs italic pt-1">{errors.lastName}</p>}
            </div>
            {/* Email */}
            <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={getInputClassName('email')}
                    placeholder="Adresse Email *"
                 />
                {errors.email && <p className="text-red-500 text-xs italic pt-1">{errors.email}</p>}
            </div>
            {/* Subject */}
            <div>
                <label htmlFor="subject" className="sr-only">Sujet</label>
                <input
                    id="subject"
                    name="subject"  
                    type="text"
                    autoComplete="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={getInputClassName('subject')}  
                    placeholder="Sujet *"
                />
                {errors.subject && <p className="text-red-500 text-xs italic pt-1">{errors.subject}</p>}
            </div>      
            {/* Message */}
            <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={getTextAreaClassName('message')}
                    placeholder="Votre message *"
                    rows="4"
                ></textarea>
                 {errors.message && <p className="text-red-500 text-xs italic pt-1">{errors.message}</p>}
            </div>
          </div>

          <div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}`}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </div>
        </form>
      </div>
    </StaticPageLayout>
  );
};

export default Contact;
