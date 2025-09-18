import { useState, useEffect, useContext } from 'react';
import ThemeContext from '../themeContext';
import getEnvironment from '../../getEnvironment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const ProfilePicture = ({ user }) => {
    const initial = user.firstname ? user.firstname[0].toUpperCase() : '?';

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
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold themed-bg-accent themed-accent-text flex-shrink-0">
            {initial}
        </div>
    );
};


const Invite = ({ userIds, onClose, todoId, title, inviteeName }) => {
    const apiURL = getEnvironment();

    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [inviteStatus, setInviteStatus] = useState({ message: '', isError: false });
    const [members, setMembers] = useState([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(true);
    const [errorMembers, setErrorMembers] = useState(null);

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

    const handleSendNewInvite = async (e) => {
        e.preventDefault();
        if (!email) {
            setInviteStatus({ message: 'Email address cannot be empty.', isError: true });
            return;
        }

        setIsSending(true);
        setInviteStatus({ message: '', isError: false });

        try {
            const response = await fetch(`${apiURL}/api/v1/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "inviteeEmail": email,
                    todoId,
                    title,
                    inviteeName
                }),
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to send invite.');

            setInviteStatus({ message: `Invitation successfully sent to ${email}!`, isError: false });
            setEmail('');
        } catch (err) {
            setInviteStatus({ message: err.message, isError: true });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}></div>

            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 themed-bg-secondary themed-text w-[40dvw] max-w-lg min-w-[320px] rounded-lg shadow-lg p-6 flex flex-col z-50 max-h-[80vh]">

                <div className="flex justify-between items-center pb-3 mb-4 border-b ">
                    <h2 className="text-xl font-semibold">Invite Members</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="mb-4">
                    <form onSubmit={handleSendNewInvite} className="flex items-center gap-2">
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address..."
                            className="flex-grow themed-bg themed-border"
                        />
                        <Button type="submit" disabled={isSending} className="themed-accent-bg">
                            {isSending ? 'Sending...' : 'Invite'}
                        </Button>
                    </form>
                    {inviteStatus.message && (
                        <p className={`mt-2 text-xs ${inviteStatus.isError ? 'text-red-500' : 'text-green-500'}`}>
                            {inviteStatus.message}
                        </p>
                    )}
                </div>

                <div className="flex-grow overflow-y-auto pr-2">
                    <h3 className="font-semibold mb-2 text-base themed-text-secondary">People with access</h3>
                    {isLoadingMembers ? (
                        <p className="text-sm themed-text-secondary">Loading...</p>
                    ) : errorMembers ? (
                        <p className="text-sm text-red-500">{errorMembers}</p>
                    ) : (
                        <ul className="space-y-2">
                            {members.map(member => (
                                <li key={member._id} className="flex items-center gap-3 p-2 rounded-md">
                                    <ProfilePicture user={member} />
                                    <div>
                                        <p className="font-medium text-sm themed-text">{member.firstname} {member.lastname}</p>
                                        <p className="text-xs themed-text-secondary">{member.email}</p>
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