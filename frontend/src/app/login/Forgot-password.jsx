import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast"

import axios from 'axios';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from '@/components/ui/carousel';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  const { toast } = useToast()

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp = await axios.post(
        'http://localhost:3000/api/auth/forgot-password',
        { email }
      );
      if (resp.data.success) {
        toast({
            description: "OTP sent successfully",
          })
        ref.current.click();
      } else {
        setError(resp.data.message);
        toast({
            description: resp.data.message
        })
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp = await axios.post(
        'http://localhost:3000/api/auth/verify-otp',
        {
          email,
          otp,
        }
      );
      const data = await resp.data;
      if (data.success) {
        console.log('OTP verified successfully');
        toast({
            description: "OTP verified successfully",
            })
        ref.current.click();
      } else if (data.message === 'Expired OTP') {
        setError('OTP expired, please try again');
        toast({
            description: "OTP expired, please try again",
            })
      } else {
        setError(data.message);
      }
    } catch (error) {
      if(error.response.status === 401){
        toast({
            description: "OTP expired, please try again",
            })
      }
        console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp = await axios.post(
        'http://localhost:3000/api/auth/reset-password',
        {
          email,
          otp,
          newPassword: password,
        }
      );
      const { success, message } = await resp.data;
      if (success) {
        console.log('Password reset successfully');
        toast({
            description: "Password reset successfully",
            })
        navigate('/login');
      } else {
        setError(message);
        toast({
            description: message,
            })
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            {error && <p className="text-red-500">{error}</p>}
            <CardContent className="grid p-0 md:grid-cols-2 h-[400px]">
              <Carousel>
                <CarouselContent>
                  <CarouselItem>
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center text-center">
                          <h1 className="text-2xl font-bold">
                            Forget Password
                          </h1>
                        </div>
                        <div className="grid gap-2 mt-12">
                          <Label htmlFor="email" className="mb-2">
                            Enter your registered email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full"
                        >
                          Get Otp
                        </Button>
                      </div>
                    </form>
                  </CarouselItem>
                  <CarouselItem>
                    <form className="p-6 md:p-8" onSubmit={handleVerifyOtp}>
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center text-center">
                          <h1 className="text-2xl font-bold">Enter Otp</h1>
                        </div>
                        <div className="grid gap-2 mt-12">
                          <InputOTP maxLength={6} onChange={(e) => setOtp(e)}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full"
                        >
                          Verify Otp
                        </Button>
                        {error === 'OTP expired, please try again' && (
                          <p className="text-red-500 text-center">
                            OTP expired, please try again
                          </p>
                        )}
                      </div>
                    </form>
                  </CarouselItem>
                  <CarouselItem>
                    <form className="p-6 md:p-8" onSubmit={handleResetPassword}>
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center text-center">
                          <h1 className="text-2xl font-bold">
                            Enter New Password
                          </h1>
                        </div>
                        <div className="grid gap-2 mt-12">
                          <Input
                            id="Password"
                            type="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full">
                          Reset Password
                        </Button>
                      </div>
                    </form>
                  </CarouselItem>
                </CarouselContent>
                <CarouselNext ref={ref} className="z-50 hidden" />
              </Carousel>

              <div className="relative hidden bg-muted md:block">
                <img
                  src="https://images.pexels.com/photos/3585074/pexels-photo-3585074.jpeg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
