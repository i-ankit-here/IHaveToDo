import { useNavigate } from "react-router-dom"
import ThemeContext from '../themeContext';
import { useEffect, useContext, useState } from "react";
import getEnvironment from '../../getEnvironment';
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

function InviteVerify() {
    const navigate = useNavigate();
    const apiURL = getEnvironment();
    const { user } = useContext(ThemeContext);
    const [status, setStatus] = useState('verifying');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const urlParts = window.location.href.split('/');
        const token = urlParts[urlParts.length - 1];
        const todoId = urlParts[urlParts.length - 2];

        if (!user) {
            navigate(`/login?redirect=verify/${todoId}/${token}`);
            return;
        }

        const verifyInvite = async () => {
            try {
                const response = await fetch(`${apiURL}/api/v1/invite/verify/${todoId}/${token}`, {
                    credentials: 'include',
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setTimeout(() => {
                        navigate(`/todos/${todoId}`, { state: data });
                    }, 1500);
                } else {
                    throw new Error(data.message || 'Verification failed. The link may be invalid or expired.');
                }
            } catch (error) {
                setErrorMessage(error.message);
                setStatus('error');
            }
        };

        verifyInvite();
    }, [user, navigate, apiURL]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen themed-bg">
                <Loader2 className="h-8 w-8 animate-spin themed-text" />
                <p className="themed-text-secondary mt-4">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen themed-bg">
            <div className="p-8 rounded-lg themed-bg-secondary themed-border shadow-lg text-center max-w-sm">
                {status === 'verifying' && (
                    <>
                        <Loader2 className="h-12 w-12 mx-auto animate-spin themed-accent-text" />
                        <h1 className="text-2xl font-bold mt-4 themed-text">Verifying Invitation</h1>
                        <p className="themed-text-secondary mt-2">Please wait a moment...</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
                        <h1 className="text-2xl font-bold mt-4 themed-text">Success!</h1>
                        <p className="themed-text-secondary mt-2">You've been added to the project. Redirecting...</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
                        <h1 className="text-2xl font-bold mt-4 themed-text">Verification Failed</h1>
                        <p className="themed-text-secondary mt-2">{errorMessage}</p>
                        <Button className="mt-6" onClick={() => navigate('/')}>
                            Go to Dashboard
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default InviteVerify;