import React, { useContext, useState, useEffect } from 'react';
import getEnvironment from '../../getEnvironment';
import ThemeContext from '../themeContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Loader2 } from 'lucide-react';

const UpdateProfile = () => {
    const apiURL = getEnvironment();
    const { user, setUser } = useContext(ThemeContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    useEffect(() => {
        if (user) {
            setFirstName(user.firstname || "");
            setLastName(user.lastname || "");
            setEmail(user.email || "");
            setUsername(user.username || "");
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setFeedback({ message: '', type: '' });

        const updatedData = {
            firstname: firstName,
            lastname: lastName,
            email: email,
            username: username
        };

        try {
            const response = await fetch(`${apiURL}/api/v1/users/updateProfile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updatedData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setFeedback({ message: "Profile updated successfully!", type: 'success' });
                setUser(data.data);
            } else {
                setFeedback({ message: data.message || "Failed to update profile.", type: 'error' });
            }
        } catch (err) {
            console.error(err);
            setFeedback({ message: "An error occurred while updating.", type: 'error' });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center themed-bg p-4">
            <Card className="w-full max-w-lg themed-bg-secondary themed-border">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold themed-text">Update Your Profile</CardTitle>
                    <CardDescription className="themed-text-secondary">Keep your personal information up to date.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 themed-text-secondary" />
                                <Input
                                    type="text"
                                    name="firstname"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className='pl-10 themed-bg themed-border'
                                    required
                                />
                            </div>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 themed-text-secondary" />
                                <Input
                                    type="text"
                                    name="lastname"
                                    placeholder="Last Name"
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
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='pl-10 themed-bg themed-border'
                                required
                            />
                        </div>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 themed-text-secondary" />
                            <Input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='pl-10 themed-bg themed-border'
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isUpdating} className='w-full themed-accent-bg'>
                            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isUpdating ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center h-8">
                    {feedback.message && (
                        <p className={`text-center text-sm ${feedback.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                            {feedback.message}
                        </p>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default UpdateProfile;