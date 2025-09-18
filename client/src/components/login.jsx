import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import getEnvironment from '../../getEnvironment';
import ThemeContext from '../themeContext';

// 1. Import Shadcn UI components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
    const apiURL = getEnvironment();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUser } = useContext(ThemeContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showSlider, setShowSlider] = useState(false);

    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const submit = async (event) => {
        event.preventDefault();
        setFeedback({ message: '', type: '' }); 

        if (!password || !username) {
            setFeedback({ message: "Username and password are required", type: 'error' });
            return;
        }

        setShowSlider(true);

        try {
            const formData = { username, password };
            const response = await fetch(`${apiURL}/api/v1/users/login`, {
                method: 'POST',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include"
            });
            const data = await response.json();

            if (data.success) {
                setFeedback({ message: "Login successful! Redirecting...", type: 'success' });
                setUser(data?.data?.user);
                const redirect = searchParams.get("redirect") || "/dashboard";
                setTimeout(() => navigate(redirect), 1000);
            } else {
                setFeedback({ message: data.message || "An unknown error occurred", type: 'error' });
            }
        } catch (error) {
            console.error(error);
            setFeedback({ message: "Failed to connect to the server.", type: 'error' });
        } finally {
            setShowSlider(false);
        }
    };

    return (
        <div className="flex h-dvh w-full items-center justify-center bg-background p-4 pb-30">
            <Card className="relative w-full max-w-md overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-3xl text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">Enter your credentials to continue.</CardDescription>
                </CardHeader>
                <form onSubmit={submit}>
                    <CardContent className="space-y-4">
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="flex items-center">
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="password">Password</Label>
                             <div className="flex items-center">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex mt-12 flex-col gap-4">
                        <Button type="submit" disabled={showSlider} className="w-full cursor-pointer">
                           Sign In
                        </Button>
                        {feedback.message && (
                            <p className={`text-sm ${feedback.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
                                {feedback.message}
                            </p>
                        )}
                    </CardFooter>
                </form>
                <div className={`absolute bottom-0 left-0 h-1 w-30 bg-primary slider ${showSlider ? "block" : "hidden"}`}></div>
            </Card>
        </div>
    );
}

export default Login;