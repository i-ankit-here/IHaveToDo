import { useNavigate } from "react-router-dom"
import ThemeContext from '../themeContext';
import { useEffect, useContext } from "react";
import getEnvironment from '../../getEnvironment';

function InviteVerify() {
    const navigate = useNavigate();
    const apiURL = getEnvironment();
    const { user, theme, setTheme } = useContext(ThemeContext);
    const token = window.location.href.split('/').pop(); // Extract the token from the URL
    const todoId = window.location.href.split('/')[window.location.href.split('/').length - 2]; // Extract the todoId from the URL
    useEffect(() => {
        console.log(user, token, todoId, window.location.href);
        if (!user) {
            navigate(`/login?redirect=verify/${todoId}/${token}`);
        }
        const verifyInvite = async () => {
            const response = await fetch(`${apiURL}/api/v1/invite/verify/${todoId}/${token}`,{
                credentials: 'include',
            });
            console.log("Response from verification:", response);
            if (response.ok) {
                const data = await response.json();
                console.log("Verification successful:", data);
                // Redirect to the todo page or show a success message
                navigate(`/todos/${todoId}`, { state: data });
            } else {
                // Handle verification failure
            }
        };
        verifyInvite();
    }, [token]);
    if(!user) return null; // Prevent rendering if user is not logged in
    return (
        <div>
            <h1>Invitation Verification</h1>
            <p>Please wait while we verify your invitation...</p>
        </div>
    )
}

export default InviteVerify
