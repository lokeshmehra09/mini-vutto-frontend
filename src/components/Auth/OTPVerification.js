import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Link as MuiLink,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Timer as TimerIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const inputRefs = useRef([]);

  // Get email and registration data from location state or query params
  const email = location.state?.email || new URLSearchParams(location.search).get('email');
  const message = location.state?.message || 'Please check your email for OTP verification code';
  const registrationData = location.state?.registrationData || {};

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    // Focus first input on mount
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input when digit is entered
    if (value && index < 5) {
      setTimeout(() => {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }, 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send the complete registration data along with OTP
      const result = await verifyOTP(email, otpString, registrationData);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      // Send the complete registration data for resending OTP
      const result = await resendOTP(email, registrationData);
      
      if (result.success) {
        setTimeLeft(600); // Reset timer to 10 minutes
        setCanResend(false);
        setOtp(['', '', '', '', '', '']); // Clear OTP inputs
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <EmailIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Verify Your Email
            </Typography>
            <Typography variant="body1" color="textSecondary">
              We've sent a 6-digit verification code to
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
              {email}
            </Typography>
          </Box>

          {message && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
              Enter the verification code below
            </Typography>

            {/* OTP Input Fields */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => {
                    if (el) {
                      inputRefs.current[index] = el;
                      console.log(`InputRef ${index} set:`, el);
                    }
                  }}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: '1.5rem' }
                  }}
                  sx={{
                    width: '60px',
                    '& .MuiOutlinedInput-root': {
                      height: '60px',
                    }
                  }}
                />
              ))}
            </Box>

            {/* Timer */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <TimerIcon color="action" />
                <Typography variant="body2" color="textSecondary">
                  Code expires in: {formatTime(timeLeft)}
                </Typography>
              </Box>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || otp.join('').length !== 6}
              sx={{ mb: 2, py: 1.5 }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Verifying...
                </Box>
              ) : (
                'Verify & Complete Registration'
              )}
            </Button>

            {/* Resend OTP */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Didn't receive the code?
              </Typography>
              <Button
                onClick={handleResendOTP}
                disabled={!canResend || resendLoading}
                startIcon={resendLoading ? <CircularProgress size={16} /> : <RefreshIcon />}
                sx={{ textTransform: 'none' }}
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </Button>
            </Box>

            {/* Back to Register */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Wrong email?{' '}
                <MuiLink 
                  component="button" 
                  type="button"
                  onClick={() => navigate('/register')}
                  sx={{ textDecoration: 'none' }}
                >
                  Go back
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default OTPVerification;
