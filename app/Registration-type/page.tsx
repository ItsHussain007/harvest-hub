"use client";

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowRight, ArrowLeft, Check, Eye, EyeOff, Building2, User, Mail, Facebook } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  accountType: 'individual' | 'business' | null;
  businessName?: string;
  registrationNumber?: string;
  businessDocument?: File | null;
  phoneNumber?: string;
  dateOfBirth?: string;
}

interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
  accountType?: string;
  businessName?: string;
  registrationNumber?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

interface PasswordStrength {
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasUpperCase: boolean;
}

const UserTypeCard: React.FC<{ title: string; description: string; icon: React.ReactNode; isSelected: boolean; onClick: () => void }> = ({ title, description, icon, isSelected, onClick }) => (
  <div onClick={onClick} className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
    <div className="flex gap-4">
      <div className={isSelected ? 'text-green-600' : 'text-gray-400'}>{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {isSelected && <div className="absolute top-4 right-4"><Check className="w-5 h-5 text-green-600" /></div>}
    </div>
  </div>
);

const SocialLoginButton: React.FC<{ provider: string; icon: React.ReactNode; onClick: () => void }> = ({ provider, icon, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
    {icon}<span className="font-medium">Continue with {provider}</span>
  </button>
);

const RegistrationPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loginMethod, setLoginMethod] = useState<'email' | 'google' | 'facebook' | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '', firstName: '', lastName: '', password: '', confirmPassword: '', accountType: null,
    businessName: '', registrationNumber: '', businessDocument: null, phoneNumber: '', dateOfBirth: '',
  });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false, hasNumber: false, hasSpecialChar: false, hasUpperCase: false,
  });
  const [twoFactorData, setTwoFactorData] = useState<{ qrCode?: string; backupCodes?: string[] }>({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => {
    const strengthChecks = {
      hasMinLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
    };
    setPasswordStrength(strengthChecks);
    return Object.values(strengthChecks).every(check => check);
  };
  const validatePhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D+/g, '');
    if (!cleaned) return { isValid: false, error: 'Phone number is required' };
    if (cleaned.startsWith('44') && cleaned.length === 12) phone = '0' + cleaned.slice(2);
    if (!/^07\d{9}$/.test(phone)) return { isValid: false, error: 'Enter a valid UK mobile number (07xxxxxxxxx)' };
    return { isValid: true };
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setLoginMethod(provider);
    console.log(`Signing in with ${provider}`);
    setStep(1);
  };
  const handleEmailLogin = () => {
    setLoginMethod('email');
    setStep(1);
  };

  const validateStep = (currentStep: number) => {
    const newErrors: FormErrors = {};
    if (currentStep === 1 && !formData.accountType) newErrors.accountType = 'Please select an account type';
    if (currentStep === 2 && loginMethod === 'email') {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    }
    if (currentStep === 3 && loginMethod === 'email') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (formData.accountType === 'business') {
        if (!formData.businessName?.trim()) newErrors.businessName = 'Business name is required';
        if (!formData.registrationNumber?.trim()) newErrors.registrationNumber = 'Registration number is required';
      }
      if (formData.accountType === 'individual') {
        const phoneValidation = validatePhoneNumber(formData.phoneNumber || '');
        if (!phoneValidation.isValid) newErrors.phoneNumber = phoneValidation.error;
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      }
    }
    if (currentStep === 4 && loginMethod === 'email') {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (!validatePassword(formData.password)) newErrors.password = 'Password does not meet requirements';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (loginMethod !== 'email' && step === 1) setStep(4);
      else setStep(step + 1);
    }
  };
  const handleBack = () => step > 0 && setStep(step - 1);

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setLoading(true);
    try {
      const response = await fetch('/api/user-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          accountType: formData.accountType,
          businessName: formData.accountType === 'business' ? formData.businessName : undefined,
          registrationNumber: formData.accountType === 'business' ? formData.registrationNumber : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      setTwoFactorData({ qrCode: data.twoFactorSecret, backupCodes: data.backupCodes });
      setStep(5); // New success step
    } catch (err: any) {
      setErrors({ ...errors, password: err.message });
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sign Up</h2>
            <SocialLoginButton provider="Google" icon={<svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" /></svg>} onClick={() => handleSocialLogin('google')} />
            <SocialLoginButton provider="Facebook" icon={<Facebook className="w-5 h-5 text-blue-600" />} onClick={() => handleSocialLogin('facebook')} />
            <SocialLoginButton provider="Email" icon={<Mail className="w-5 h-5 text-gray-600" />} onClick={handleEmailLogin} />
            <div className="pt-4 text-center">
              <p className="text-sm text-gray-500">Already have an account? <a href="/login" className="text-green-600 font-medium">Log in</a></p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Account Type</h2>
            <UserTypeCard title="Individual Account" description="Personal account for individual use" icon={<User size={24} />} isSelected={formData.accountType === 'individual'} onClick={() => setFormData({ ...formData, accountType: 'individual' })} />
            <UserTypeCard title="Business Account" description="Account for businesses and organizations" icon={<Building2 size={24} />} isSelected={formData.accountType === 'business'} onClick={() => setFormData({ ...formData, accountType: 'business' })} />
            {errors.accountType && <p className="mt-1 text-sm text-red-500">{errors.accountType}</p>}
          </div>
        );
      case 2:
        return (
          <div className="w-full">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">What's your email?</label>
            <input type="email" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter your email address" className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`} />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 w-full">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" id="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="Enter your first name" className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`} />
              {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Enter your last name" className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`} />
              {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
            </div>
            {formData.accountType === 'business' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input type="text" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} placeholder="Enter business name" className={`w-full px-4 py-3 rounded-lg border ${errors.businessName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`} />
                  {errors.businessName && <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input type="text" value={formData.registrationNumber} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} placeholder="Enter registration number" className={`w-full px-4 py-3 rounded-lg border ${errors.registrationNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`} />
                  {errors.registrationNumber && <p className="mt-1 text-sm text-red-500">{errors.registrationNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Document</label>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFormData({ ...formData, businessDocument: e.target.files?.[0] || null })} className="w-full" />
                  <p className="text-xs text-gray-500 mt-1">Upload business registration document (PDF, DOC, DOCX)</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="Enter phone number" className={`w-full px-4 py-3 rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`} />
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className={`w-full px-4 py-3 rounded-lg border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`} />
                  {errors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>}
                </div>
              </>
            )}
          </div>
        );
      case 4:
        if (loginMethod !== 'email') {
          return (
            <div className="text-center py-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Account Created!</h2>
              <p className="text-gray-600">You've successfully created your account with {loginMethod} authentication.</p>
              <button onClick={() => window.location.href = '/dashboard'} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg">Go to Dashboard</button>
            </div>
          );
        }
        return (
          <div className="space-y-4 w-full">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} id="password" value={formData.password} onChange={(e) => { setFormData({ ...formData, password: e.target.value }); validatePassword(e.target.value); }} placeholder="Enter your password" className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all pr-10`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-gray-700">Password requirements:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: 'At least 8 characters', met: passwordStrength.hasMinLength },
                    { label: 'Contains a number', met: passwordStrength.hasNumber },
                    { label: 'Contains a special character', met: passwordStrength.hasSpecialChar },
                    { label: 'Contains an uppercase letter', met: passwordStrength.hasUpperCase },
                  ].map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-600' : 'bg-gray-200'}`}>{req.met && <Check className="w-3 h-3 text-white" />}</div>
                      <span className={`text-sm ${req.met ? 'text-green-600' : 'text-gray-500'}`}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type={showPassword ? 'text' : 'password'} id="confirmPassword" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Confirm your password" className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`} />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Created!</h2>
            <p className="text-gray-600 mb-4">Please verify your email. Set up 2FA by scanning this QR code:</p>
            {twoFactorData.qrCode && <QRCodeSVG value={twoFactorData.qrCode} size={150} className="mx-auto mb-4" />}
            <p className="text-gray-600 mb-2">Backup Codes (save these securely):</p>
            <ul className="text-sm text-gray-700 mb-4">{twoFactorData.backupCodes?.map((code, i) => <li key={i}>{code}</li>)}</ul>
            <button onClick={() => window.location.href = '/dashboard'} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg">Go to Dashboard</button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderMobileProgress = () => {
    if (step === 0) return null;
    const totalSteps = loginMethod === 'email' ? 5 : 2;
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 md:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          {step > 1 && <button onClick={handleBack} className="flex items-center text-gray-600 gap-1.5 py-1"><ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back</span></button>}
          <div className="flex gap-1.5 absolute left-1/2 -translate-x-1/2">{Array.from({ length: totalSteps }, (_, i) => i + 1).map(num => <div key={num} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${step >= num ? 'bg-green-600 w-4' : 'bg-gray-200'}`} />)}</div>
          <div className="w-10" />
        </div>
      </div>
    );
  };

  const renderDesktopProgress = () => {
    if (step === 0) return null;
    const labels = loginMethod === 'email' ? ['Account Type', 'Email', 'Personal Info', 'Password', 'Success'] : ['Account Type', 'Complete'];
    const totalSteps = labels.length;
    return (
      <div className="hidden md:flex justify-between mb-8 relative">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((number, index) => (
          <div key={number} className="flex-1 text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= number ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}>{step > number ? <Check className="w-5 h-5" /> : number}</div>
            <p className={`text-sm ${step >= number ? 'font-medium text-gray-900' : 'text-gray-500'}`}>{labels[index]}</p>
          </div>
        ))}
        <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200 -z-10"><div className="h-full bg-green-600 transition-all duration-300" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} /></div>
      </div>
    );
  };

  const getHeaderText = () => {
    return ['Sign up to continue', 'Choose Account Type', "What's your email?", 'Tell us about yourself', 'Create a password', 'All set!'][step] || '';
  };
  const getSubHeaderText = () => {
    return ['Select how you want to sign up', 'Select the type of account you want to create', "We'll use this to keep your account secure", 'Help us personalize your experience', "Make sure it's secure", 'Your account is ready'][step] || '';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 md:bg-gray-100">
      <Header cartTotal={0} />
      {renderMobileProgress()}
      <main className="flex-grow md:py-12">
        <div className="w-full md:max-w-xl mx-auto">
          <div className="md:hidden">
            <div className="bg-white min-h-screen px-5 pt-16 pb-20">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{getHeaderText()}</h1>
                <p className="text-sm text-gray-500">{getSubHeaderText()}</p>
              </div>
              <div className="space-y-6">{getStepContent()}</div>
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
                {step > 0 && (
                  <button
                    onClick={step === 4 && loginMethod === 'email' ? handleSubmit : step === 5 ? () => window.location.href = '/dashboard' : handleNext}
                    disabled={loading}
                    className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-4 rounded-xl shadow-sm transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Processing...' : step === 4 && loginMethod === 'email' ? 'Create Account' : step === 5 ? 'Go to Dashboard' : 'Continue'}
                  </button>
                )}
                {step === 0 && <p className="text-center text-xs text-gray-500 mt-4">Already have an account? <a href="/login" className="text-green-600 font-medium">Login</a></p>}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
              <p className="text-base text-gray-600">Already have an account? <a href="/login" className="text-green-600 hover:text-green-700 font-medium">Log in</a></p>
            </div>
            {renderDesktopProgress()}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="space-y-6">
                {getStepContent()}
                {step > 0 && (
                  <div className="flex gap-4 pt-4">
                    {step > 1 && <button onClick={handleBack} className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"><ArrowLeft className="w-5 h-5" />Back</button>}
                    <button
                      onClick={step === 4 && loginMethod === 'email' ? handleSubmit : step === 5 ? () => window.location.href = '/dashboard' : handleNext}
                      disabled={loading}
                      className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Processing...' : step === 4 && loginMethod === 'email' ? 'Create Account' : step === 5 ? 'Go to Dashboard' : 'Next'}
                      {step !== 4 && step !== 5 && <ArrowRight className="w-5 h-5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegistrationPage;