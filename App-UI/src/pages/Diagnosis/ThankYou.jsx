import { Link } from 'react-router-dom';

export const ThankYou = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-bg text-text-light p-4">
            <div className="bg-card-bg p-8 rounded-lg shadow-lg text-center max-w-md">
                <h1 className="text-4xl font-island-moments text-primary-color mb-4">תודה רבה!</h1>
                <p className="text-xl mb-6">התשובות שלך נשלחו בהצלחה.</p>
                <p className="text-lg mb-8">המטפל יקבל את התשובות ויטפל בהן בהקדם.</p>
                <Link 
                    to="/"
                    className="inline-block bg-primary-color text-white px-6 py-2 rounded-md hover:bg-primary-color-dark transition-colors"
                >
                    חזרה לדף הבית
                </Link>
            </div>
        </div>
    );
}; 