import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
import { Link, useNavigate } from 'react-router-dom';


import { useAuth } from "@/userContext/AuthProvider"

const SignupForm = () => {
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  const [input, setInput] = useState({
    username: '',
    email: '',
    password: '',
  });
  const { toast } = useToast();
  const {handleLogin} = useAuth()

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp = await axios.post(
        'http://localhost:3000/api/auth/register',
        input
      );
      if (resp.data.success) {
        toast({
          description: 'OTP sent successfully',
        });
        ref.current.click();
      } else {
        setError(resp.data.message);
        toast({
          description: resp.data.message,
        });
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
        'http://localhost:3000/api/auth/verify-email',
        {
          otp,
        }
      );
      const data = await resp.data;
      if (data.success) {
        handleLogin(data.token, data.user)
        console.log(data.user,'user in singup')
        navigate("/choose-avatar"); 
        toast({
          title: "Account created successfully!",
          description: "Please select an avatar to continue.",
        })
      } else if (data.message === 'Expired OTP') {
        setError('OTP expired, please try again');
        toast({
          description: 'OTP expired, please try again',
        });
      } else {
        setError(data.message);
        toast({
            title: data.message,
            
          })
      }
    } catch (error) {
        console.log('error',error)
      if (error.response.status === 401) {
        toast({
          description: 'OTP expired, please try again',
        });
      }
      if (error.response.status === 400) {
        toast({
          description: 'Invalid OTP, provide correct OTP',
        });
      }
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
            <CardContent className="grid p-0 md:grid-cols-2">
              <Carousel>
                <CarouselContent>
                  <CarouselItem>
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center text-center">
                          <p className="text-balance text-muted-foreground">
                            Create Your Account
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            onChange={handleChange}
                            value={input.username}
                            type="text"
                            placeholder="john Doe"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={input.email}
                            placeholder="johndoe@example.com"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                          </div>
                          <Input
                            id="password"
                            type="password"
                            name="password"
                            onChange={handleChange}
                            value={input.password}
                            required
                          />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full">
                          {loading?'wait...':'Sign Up'}
                        </Button>
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                          <span className="relative z-10 bg-background px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <Button variant="outline" className="w-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                fill="currentColor"
                              />
                            </svg>
                            <span className="sr-only">Login with Apple</span>
                          </Button>
                          <Button variant="outline" className="w-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                              />
                            </svg>
                            <span className="sr-only">Login with Google</span>
                          </Button>
                          <Button variant="outline" className="w-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                                fill="currentColor"
                              />
                            </svg>
                            <span className="sr-only">Login with Meta</span>
                          </Button>
                        </div>
                        <div className="text-center text-sm">
                          Already have an account?{' '}
                          <Link
                            to={'/login'}
                            className="underline underline-offset-4"
                          >
                            Login
                          </Link>
                        </div>
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
                          {loading? 'verifying....': 'Verify Otp'}
                        </Button>
                        {error === 'OTP expired, please try again' && (
                          <p className="text-red-500 text-center">
                            OTP expired, please try again
                          </p>
                        )}
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

export default SignupForm;
