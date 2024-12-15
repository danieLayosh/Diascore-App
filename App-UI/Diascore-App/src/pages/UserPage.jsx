import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import GreenCoverButton from "../components/buttons/GreenCoverButton";
import ProfileButton from "../components/buttons/ProfileButton"; // Import ProfileButton component

const UserPage = () => {
    const { user, loading } = useAuth(); // State to store user data
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/home'); // Redirect to the home page after sign out
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="flex flex-col items-start w-screen bg-gradient-bg text-text-light min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center w-full px-4 sm:px-12 lg:px-12 py-4 bg-card-bg shadow-lg">
                <h3 className="text-5xl sm:text-6xl font-island-moments text-primary-color font-semibold">Diascore</h3>
                {/* Profile Button Section */}
                <div className="flex gap-4">
                    <button>
                        {/* Profile Button with Icon */}
                        <ProfileButton 
                            fill="currentColor" 
                            size={24}     
                            className="transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-primary-color"                         />
                    </button>
                </div>
            </div>

            <div className="mt-20 text-left mx-auto">
                {user ? (
                    <div className="text-4xl">
                        <p>You are successfully logged in as:</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Display Name:</strong> {user.displayName || 'N/A'}</p> {/* Display name may not always be available */}
                    </div>
                ) : (
                    <p>Loading user data...</p> // Show loading state if user data is not yet fetched
                )}
                <div className="flex gap-4 mt-40 mx-44">
                    {/* Log Out Button */}
                    <GreenCoverButton text="Log Out" defaultColor="black" onClick={handleSignOut} />            
                </div>
            </div>
        </div>
    );
};

export default UserPage;
