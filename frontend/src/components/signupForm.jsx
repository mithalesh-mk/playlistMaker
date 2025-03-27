import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/userContext/AuthProvider";

const SignupForm = () => {
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef();
  const [showCarousel, setShowCarousel] = useState(false);

  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const { handleLogin, user } = useAuth();

  const navigate = useNavigate();

  const fadeVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [navigate]);

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
        "http://localhost:3000/api/auth/register",
        input
      );
      if (resp.data.success) {
        toast({
          description: "OTP sent successfully",
        });
        setShowCarousel(true);
        setTimeout(() => ref.current?.click(), 100);
        
      } else {
        setError(resp.data.message);
        toast({
          description: resp.data.message,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast({
          description: 'Email already exists',
        });
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp = await axios.post(
        "http://localhost:3000/api/auth/verify-email",
        {
          otp,
        }
      );
      const data = await resp.data;
      if (data.success) {
        handleLogin(data.token, data.user);
        navigate("/choose-avatar");
        toast({
          title: "Account created successfully!",
          description: "Please select an avatar to continue.",
        });
      } else if (data.message === "Expired OTP") {
        setError("OTP expired, please try again");
        toast({
          description: "OTP expired, please try again",
        });
      } else {
        setError(data.message);
        toast({
          title: data.message,
        });
      }
    } catch (error) {
      console.log("error", error);
      if (error.response.status === 401) {
        toast({
          description: "OTP expired, please try again",
        });
      }
      if (error.response.status === 400) {
        toast({
          description: "Invalid OTP, provide correct OTP",
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
              <AnimatePresence mode="wait">
                {!showCarousel ? (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="w-full h-full">
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
                            {loading ? "wait..." : "Sign Up"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="h-[50vh]">
                      <form className="p-6 md:p-8" onSubmit={handleVerifyOtp}>
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col items-center text-center">
                            <h1 className="text-2xl font-bold">Enter OTP</h1>
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

                          <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "verifying...." : "Verify OTP"}
                          </Button>
                          {error === "OTP expired, please try again" && (
                            <p className="text-red-500 text-center">
                              OTP expired, please try again
                            </p>
                          )}
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ✅ Background Image (Restored) */}
              <div className="relative hidden bg-muted md:block">
                <img
                  src="https://images.pexels.com/photos/3585074/pexels-photo-3585074.jpeg"
                  alt="Background"
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
