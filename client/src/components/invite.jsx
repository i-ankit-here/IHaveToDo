import { useState, useEffect, useContext } from 'react';
import ThemeContext from '../themeContext';
import getEnvironment from '../../getEnvironment';

// A simple close icon component
const CloseIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Renders a profile picture or a fallback with initials
const ProfilePicture = ({ user, theme }) => {
    // Assumes user object has `firstname` and optional `profilePictureUrl`
    const initial = user.firstname ? user.firstname[0].toUpperCase() : '?';
    
    // Themed colors for the fallback initial
    const fallbackBg = theme === 'light' ? 'bg-blue-100' : 'bg-blue-800';
    const fallbackText = theme === 'light' ? 'text-blue-800' : 'text-blue-200';

    if (user.profilePictureUrl) {
        return (
            <img
                src={user.profilePictureUrl}
                alt={user.firstname}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
        );
    }
    
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${fallbackBg} ${fallbackText} flex-shrink-0`}>
            {initial}
        </div>
    );
};


const Invite = ({ userIds, onClose, todoId, title, inviteeName }) => {
    const { theme } = useContext(ThemeContext);
    const apiURL = getEnvironment();

    // --- State for new invitations & existing members ---
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [inviteStatus, setInviteStatus] = useState({ message: '', isError: false });
    const [members, setMembers] = useState([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(true);
    const [errorMembers, setErrorMembers] = useState(null);

    // Effect to fetch the list of existing members
    useEffect(() => {
        if (!userIds || userIds.length === 0) {
            setIsLoadingMembers(false);
            return;
        }
        const fetchMembers = async () => {
            setIsLoadingMembers(true);
            try {
                const response = await fetch(`${apiURL}/api/v1/users/getUsersByIds`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userIds }),
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Failed to fetch members.');
                const result = await response.json();
                setMembers(result.data);
            } catch (err) {
                setErrorMembers(err.message);
            } finally {
                setIsLoadingMembers(false);
            }
        };
        fetchMembers();
    }, [userIds, apiURL]);

    // Handler for the new invite form submission
    const handleSendNewInvite = async (e) => {
        e.preventDefault();
        if (!email) {
            setInviteStatus({ message: 'Email address cannot be empty.', isError: true });
            return;
        }
        
        setIsSending(true);
        setInviteStatus({ message: '', isError: false });

        try {
            console.log("Sending invite to:", email, "for todoId:", todoId, "with title:", title, "by", inviteeName);
            const response = await fetch(`${apiURL}/api/v1/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    "inviteeEmail":email,
                    todoId,
                    title,
                    inviteeName }),
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to send invite.');
            
            setInviteStatus({ message: `Invitation successfully sent to ${email}!`, isError: false });
            setEmail(''); // Clear input on success
        } catch (err) {
            setInviteStatus({ message: err.message, isError: true });
        } finally {
            setIsSending(false);
        }
    };

    // --- Theming classes based on your original component ---
    const modalClasses = theme === "light"
        ? "bg-neutral-100 border-r-2 border-neutral-200 text-black"
        : "bg-lightGrey text-white"; // Assuming 'lightGrey' is a dark color in your setup
    
    const itemClasses = theme === "light"
        ? "bg-white"
        : "bg-lightGrey"; 

    const inputClasses = theme === "light"
        ? "bg-white border-gray-300 text-black placeholder-gray-400"
        : "bg-neutral-700 border-neutral-600 text-white placeholder-gray-400";

    const hrColor = theme === 'light' ? 'border-neutral-200' : 'border-neutral-600';

    return (
        <>
            {/* Backdrop to capture clicks outside the modal */}
            <div className="fixed inset-0 z-40" onClick={onClose}></div>

            {/* The Modal, using your requested absolute positioning and theming */}
            <div className={`absolute top-1/4 left-[30dvw] ${modalClasses} h-[50dvh] w-[40dvw] rounded-sm shadow-md p-4 flex flex-col z-50`}>
                
                {/* Header */}
                <div className="flex justify-between items-center pb-3 mb-3 border-b">
                    <h2 className="text-xl font-semibold">Invite people to work together</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-200 cursor-pointer transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                {/* Invite New People Section */}
                <div className="mb-2">
                    <form onSubmit={handleSendNewInvite} className="flex items-center gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address..."
                            className={`flex-grow p-2 border rounded-md ${inputClasses}`}
                        />
                        <button type="submit" disabled={isSending} className="px-3 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer disabled:bg-gray-400">
                            {isSending ? '...' : 'Invite'}
                        </button>
                    </form>
                    {inviteStatus.message && (
                        <p className={`mt-2 text-xs ${inviteStatus.isError ? 'text-red-500' : 'text-green-500'}`}>
                            {inviteStatus.message}
                        </p>
                    )}
                </div>

                <hr className={`border-t ${hrColor} my-2`}/>

                {/* People with Access Section */}
                <div className="flex-grow overflow-y-auto pr-2">
                     <h3 className="font-semibold mb-2 text-base">People with access</h3>
                     {isLoadingMembers ? (
                        <p className="text-sm">Loading...</p>
                    ) : errorMembers ? (
                        <p className="text-sm text-red-500">{errorMembers}</p>
                    ) : (
                        <ul>
                            {members.map(member => (
                                <li key={member._id} className={`flex items-center gap-3 p-2 rounded-md mb-2 ${itemClasses}`}>
                                    <ProfilePicture user={member} theme={theme} />
                                    <div>
                                        <p className="font-medium text-sm">{member.firstname} {member.lastname}</p>
                                        <p className="text-xs opacity-70">{member.email}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default Invite;