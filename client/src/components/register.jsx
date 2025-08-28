import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import getEnvironment from '../../getEnvironment';
import ThemeContext from '../themeContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, KeyRound, Loader2 } from 'lucide-react';

const Register = () => {
    const apiURL = getEnvironment();
    const Navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const { theme } = useContext(ThemeContext);

    const submit = async (event) => {
        event.preventDefault();
        setIsSending(true);
        setFeedback({ message: '', type: '' });

        if (repeatPassword !== password) {
            setFeedback({ message: "Passwords do not match.", type: 'error' });
            setIsSending(false);
            return;
        }

        const formData = {
            username,
            password,
            firstname: firstName,
            lastname: lastName,
            email
        };

        try {
            const response = await fetch(`${apiURL}/api/v1/users/register`, {
                method: 'POST',
                headers: { "Content-type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setFeedback({ message: "Registration successful! Redirecting...", type: 'success' });
                setTimeout(() => Navigate("/dashboard"), 1500);
            } else {
                setFeedback({ message: data.message || "Registration failed. Please try again.", type: 'error' });
            }
        } catch (error) {
            setFeedback({ message: "An unexpected error occurred.", type: 'error' });
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center themed-bg p-4">
            <Card className="w-full max-w-md themed-bg-secondary themed-border">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold themed-text">Create an Account</CardTitle>
                    <CardDescription className="themed-text-secondary">Enter your details to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 themed-text-secondary" />
                                <Input
                                    name='firstname'
                                    type="text"
                                    placeholder='First Name'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className='pl-10 themed-bg themed-border'
                                    required
                                />
                            </div>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 themed-text-secondary" />
                                <Input
                                    name='lastname'
                                    type="text"
                                    placeholder='Last Name'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className='pl-10 themed-bg themed-border'
                                    required
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 themed-text-secondary" />
                            <Input
                                name='email'
                                type="email"
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='pl-10 themed-bg themed-border'
                                required
                            />
                        </div>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 themed-text-secondary" />
                            <Input
                                name="username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='pl-10 themed-bg themed-border'
                                required
                            />
                        </div>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 themed-text-secondary" />
                            <Input
                                name='password'
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='pl-10 themed-bg themed-border'
                                required
                            />
                        </div>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 themed-text-secondary" />
                            <Input
                                name="repeatPassword"
                                type="password"
                                placeholder="Confirm Password"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                className='pl-10 themed-bg themed-border'
                                required
                            />
                        </div>
                        <Button type='submit' disabled={isSending} className='w-full themed-accent-bg'>
                            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSending ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center">
                    {feedback.message && (
                        <p className={`text-center text-sm ${feedback.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                            {feedback.message}
                        </p>
                    )}
                    <p className="mt-4 text-center text-sm themed-text-secondary">
                        Already have an account?{' '}
                        <a href="/login" className="font-semibold themed-accent-text hover:underline">
                            Log in
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Register;