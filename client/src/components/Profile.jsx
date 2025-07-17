import React, { useContext, useState, useEffect } from 'react';
import getEnvironment from '../../getEnvironment';
import ThemeContext from '../themeContext';

const UpdateProfile = () => {
    const apiURL = getEnvironment();
    const { theme, user, setUser } = useContext(ThemeContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    const [showSlider, setShowSlider] = useState(false);

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
        setShowSlider(true);
        const info = document.getElementById("info");

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
                info.style.color = theme === "light" ? "green" : "chartreuse";
                info.innerText = "Profile updated successfully";
                setUser(data.data); // update context
            } else {
                info.style.color = "red";
                info.innerText = data.message || "Failed to update profile";
            }
        } catch (err) {
            console.error(err);
            info.style.color = "red";
            info.innerText = "An error occurred while updating";
        }

        setShowSlider(false);
    };

    return (
        <div className={`w-full h-dvh flex justify-center items-center ${theme === "light" ? "bg-white" : "bg-black"}`}>
            <form onSubmit={handleUpdate} className={`relative rounded-md w-[90dvw] md:w-100 p-8 overflow-hidden ${theme === "light" ? "bg-gray-300 shadow-2xl" : "bg-neutral-800"}`}>
                <div className='flex flex-col gap-8 items-center w-full'>
                    <h2 className={`text-4xl font-bold ${theme === "light" ? "text-black" : "text-white"}`}>Update Profile</h2>

                    <div className='flex gap-2 w-full'>
                        <div className='flex w-1/2'>
                            <img src="username.svg" alt="" className={`p-1 h-10 ${theme === "light" ? "" : "invert"}`} />
                            <input type="text" name="firstname" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className='p-1 border-2 border-gray-700 bg-white w-full rounded-sm h-10' />
                        </div>
                        <div className='flex w-1/2'>
                            <img src="username.svg" alt="" className={`p-1 h-10 ${theme === "light" ? "" : "invert"}`} />
                            <input type="text" name="lastname" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className='p-1 border-2 border-gray-700 bg-white w-full rounded-sm h-10' />
                        </div>
                    </div>

                    <div className='flex w-full'>
                        <img src="mail.svg" alt="" className={`p-1 h-10 ${theme === "light" ? "" : "invert"}`} />
                        <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className='p-1 border-2 border-gray-700 bg-white w-full rounded-sm h-10' />
                    </div>

                    <div className='flex w-full'>
                        <img src="username.svg" alt="" className={`p-1 h-10 ${theme === "light" ? "" : "invert"}`} />
                        <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className='p-1 border-2 border-gray-700 bg-white w-full rounded-sm h-10' />
                    </div>

                    <div className='flex-col w-full justify-center items-center'>
                        <button type="submit" disabled={showSlider} className='bg-gray-50 rounded-sm shadow-2xl hover:bg-gray-200 hover:shadow-2xl p-2 w-full font-medium'>Update</button>
                        <p id="info" className='text-center text-md mt-1 pt-1'></p>
                    </div>
                </div>

                <div className={`absolute bottom-0 left-0 h-1 bg-blue-500 w-30 slider ${showSlider ? "block animate-pulse" : "hidden"}`}></div>
            </form>
        </div>
    );
};

export default UpdateProfile;
