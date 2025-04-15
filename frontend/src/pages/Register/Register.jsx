import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserIcon, MailIcon, LockClosedIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline'; // Using outline icons

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear related errors on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
    if (name === 'password' || name === 'confirmPassword') {
      setErrors(prev => ({ ...prev, confirmPassword: null }));
    }
    setSubmitError(null);
    
    // Re-validate password criteria live (optional, can be complex)
    if (name === 'password') {
      validatePasswordCriteria(value);
    }
  };
  
  // Separate function to validate password criteria for live feedback
  const validatePasswordCriteria = (passwordValue) => {
      let passwordErrors = { ...errors }; // Start with existing errors
      
      const criteria = {
          length: passwordValue.length >= 8,
          lowercase: /[a-z]/.test(passwordValue),
          uppercase: /[A-Z]/.test(passwordValue),
          number: /\d/.test(passwordValue),
          // symbol: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue), // Optional: Add symbol check
      };
      
      // Update error state based on criteria
      passwordErrors.length = criteria.length ? null : "Au moins 8 caractères.";
      passwordErrors.lowercase = criteria.lowercase ? null : "Au moins une minuscule.";
      passwordErrors.uppercase = criteria.uppercase ? null : "Au moins une majuscule.";
      passwordErrors.number = criteria.number ? null : "Au moins un chiffre.";
      // passwordErrors.symbol = criteria.symbol ? null : "Au moins un symbole."; // If symbol check added
      
      // Only update password specific errors, keep others
      setErrors(prev => ({ 
          ...prev, 
          password_length: passwordErrors.length,
          password_lowercase: passwordErrors.lowercase,
          password_uppercase: passwordErrors.uppercase,
          password_number: passwordErrors.number,
          // password_symbol: passwordErrors.symbol
      }));
  }

  const validateForm = () => {
    let newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "Le nom d'utilisateur est obligatoire.";
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est obligatoire.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide.";
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est obligatoire.";
    } else {
        // Set errors based on final password criteria check
        const passwordCriteriaErrors = {
            length: formData.password.length < 8,
            lowercase: !/[a-z]/.test(formData.password),
            uppercase: !/[A-Z]/.test(formData.password),
            number: !/\d/.test(formData.password),
        };
        if (Object.values(passwordCriteriaErrors).some(v => v)) {
             newErrors.password = "Le mot de passe ne respecte pas les critères.";
             // Also ensure individual criteria errors are set for display
             if (passwordCriteriaErrors.length) newErrors.password_length = "Au moins 8 caractères.";
             if (passwordCriteriaErrors.lowercase) newErrors.password_lowercase = "Au moins une minuscule.";
             if (passwordCriteriaErrors.uppercase) newErrors.password_uppercase = "Au moins une majuscule.";
             if (passwordCriteriaErrors.number) newErrors.password_number = "Au moins un chiffre.";
        }
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    } else if (!formData.confirmPassword) { // Also check if confirm is empty
       newErrors.confirmPassword = "Veuillez confirmer le mot de passe.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).filter(key => !key.startsWith('password_')).length === 0; // Only count main field errors for submission block
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const payload = {
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
        };
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, payload);
        

        // const response = await axios.post('https://www.backend.dsp5-archi-f24a-15m-g8.fr/api/auth/register', payload);
        
        if (response.data.success) {
             alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            navigate('/login');
        } else {
             throw new Error(response.data.message || "Une erreur inconnue est survenue.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        setSubmitError(error.response?.data?.message || error.message || "Erreur lors de l'inscription.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
   // Helper for input classes
   const getInputClassName = (fieldName) => {
       return `
           appearance-none block w-full px-3 py-3 pl-10 border rounded-md shadow-sm 
           placeholder-gray-400 text-gray-900 
           focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm 
           ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'}
       `;
   }
   
   // Helper for password criteria item
   const CriteriaItem = ({ condition, text }) => (
       <li className={`flex items-center text-xs ${condition ? 'text-green-600' : 'text-gray-500'}`}>
           {condition ? 
              <CheckCircleIcon className="h-4 w-4 mr-1.5 flex-shrink-0" /> : 
              <ExclamationCircleIcon className="h-4 w-4 mr-1.5 flex-shrink-0 text-gray-400" />}
           {text}
       </li>
   );

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Moved "Already member?" to the top */} 
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-4">
            <p className="text-sm text-gray-600">
                Déjà membre ?{" "}
                <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
                    Se connecter
                </Link>
            </p>
        </div>
        
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          {/* Optional: Keep logo here or move it above "Already member?" */}
          {/* <img className="mx-auto h-12 w-auto" src="/images/logo.png" alt="Thé Tip Top" /> */}
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900">
            Créer un compte
          </h2>
          {/* Subtitle */}
          <p className="mt-2 text-center text-sm text-gray-500">
            Rejoignez Thé Tip Top et participez !
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
           {submitError && (
                 <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-md text-sm" role="alert">
                    {submitError}
                </div>
            )}
          <div className="space-y-4">
            {/* Username Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="userName"
                name="userName"
                type="text"
                required
                value={formData.userName}
                onChange={handleChange}
                className={getInputClassName('userName')}
                placeholder="Nom d'utilisateur"
              />
              {errors.userName && <p className="text-red-500 text-xs mt-1 pl-1">{errors.userName}</p>}
            </div>
            
            {/* Email Input */}
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={getInputClassName('email')}
                placeholder="Adresse Email"
              />
               {errors.email && <p className="text-red-500 text-xs mt-1 pl-1">{errors.email}</p>}
            </div>
            
            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={getInputClassName('password')}
                placeholder="Mot de passe"
              />
              {/* Display main password error OR criteria hints */}
              {errors.password && !Object.keys(errors).some(k => k.startsWith('password_')) && 
                <p className="text-red-500 text-xs mt-1 pl-1">{errors.password}</p>} 
            </div>
            
            {/* Password Criteria Hints */} 
             <ul className="space-y-1 pl-1">
                <CriteriaItem condition={!errors.password_length && formData.password.length > 0} text="Au moins 8 caractères" />
                <CriteriaItem condition={!errors.password_lowercase && formData.password.length > 0} text="Contient une minuscule (a-z)" />
                <CriteriaItem condition={!errors.password_uppercase && formData.password.length > 0} text="Contient une majuscule (A-Z)" />
                <CriteriaItem condition={!errors.password_number && formData.password.length > 0} text="Contient un chiffre (0-9)" />
                 {/* <CriteriaItem condition={!errors.password_symbol && formData.password.length > 0} text="Contient un symbole" /> */} 
            </ul>
            
            {/* Confirm Password Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={getInputClassName('confirmPassword')}
                    placeholder="Confirmer le mot de passe"
                 />
               {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 pl-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-150 ${isSubmitting ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}`}
            >
              {isSubmitting ? 'Inscription en cours...' : 'Créer mon compte'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Register;
