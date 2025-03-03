import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import ProfileButton from "../components/buttons/ProfileButton"; 
import { getAuthenticatedUserDataWithDiagnoses } from "../firebase/firestore/users";
import useAlert from "../context/useAlert"; 
import { DiagList } from "../components/diagnosedList/DiagList";
import Loader from "../components/Loader"; 
import Action from "../components/dropdown/Action";
import { firestore } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const Home = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    // eslint-disable-next-line no-unused-vars
    const [userData, setUserData] = useState(null);
    const [diagnoses, setDiagnoses] = useState([]);

    const { showAlert } = useAlert();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/welcome');
            showAlert("You have been successfully logged out", "success");
        } catch (error) {
            showAlert("Error signing out", "error");
            console.error('Error signing out:', error);
        }
    };

    useEffect(() => {
        const fetchUserDataWithDiagnoses = async () => {
            if (!user) {
                console.error("No authenticated user found");
                return;
            }
    
            try {
                const { userData, diagnoses } = await getAuthenticatedUserDataWithDiagnoses();
                setUserData(userData);
                setDiagnoses(diagnoses);
            } catch (error) {
                console.error("Error fetching user data and diagnoses:", error);
            }
        };
    
        // Make sure to update the Firestore query to use modular API
        const unsubscribeDiagnoses = onSnapshot(
            collection(firestore, "Users", user.uid, "Diagnoses"),
            (snapshot) => {
                const updatedDiagnoses = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setDiagnoses(updatedDiagnoses);
            }
        );
    
        if (user) {
            fetchUserDataWithDiagnoses();
        }
    
        // Cleanup the listener when the component is unmounted or user changes
        return () => unsubscribeDiagnoses();
    }, [user]);
    

    if (loading) {
        return <div className="flex h-screen items-center justify-center size-max w-screen bg-slate-900"> <Loader/> </div>;
    }

    return (
        
        <div className="flex flex-col items-start w-screen bg-gradient-bg text-text-light min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center w-full px-4 sm:px-12 lg:px-12 py-4 bg-card-bg shadow-lg">
                <h3 className="text-5xl sm:text-6xl font-island-moments text-primary-color font-semibold" onClick={() => {navigate('/welcome')}}>Diascore</h3>
                <div className="flex gap-6">
                    <Action />
                    <ProfileButton 
                        fill="currentColor" 
                        size={24}     
                        className="transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-primary-color"    
                        // TODO: Add onClick function to navigate to user profile page
                        onClick={handleSignOut} // Temporary onClick function                
                    />
                </div>
            </div>

            <div className="text-left mx-auto justify-center items-center mt-60">
                <DiagList Diagnoses={(diagnoses)} />
            </div>
        </div>
    );
};

export default Home;
