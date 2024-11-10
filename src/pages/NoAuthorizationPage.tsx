import { 
  ShieldExclamationIcon,
  EnvelopeIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  ArrowDownTrayIcon,
  ArrowRightIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import Logo from '../assets/logo.svg';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthorizationRoleValidator } from '../utils/AuthorizationRoleValidator';
import AppRoutes from '../utils/AppRoutes';

const NoAuthorizationPage = () => {
  const { logout, refreshUserAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const refreshUser = async () => {
      const userData = await refreshUserAuth();
      if (userData == null) { return; }
      const authValidator = AuthorizationRoleValidator.getInstance();
      if (authValidator.hasAccessToAdministrationApp(userData.authorizations)) {
        navigate(AppRoutes.HOME);
      }
    }
    refreshUser();
  }, [navigate, refreshUserAuth]);

  const contactEmail = "kostuj.developers@gmail.com";
  const phoneNumber = "775 474 764";
  //const appStoreLink = "https://apps.apple.com/app/yourapp";
  const playStoreLink = "https://play.google.com/store/apps/details?id=cz.mendelu.xpaseka.kostuj&hl=cs&gl=US";

  return (

    <div className="min-h-screen py-4">
      <div className="flex flex-row items-center mb-8 gap-4">
        <img src={Logo} alt="App Logo" className="w-20" />
        <h1 className="text-3xl font-bold text-gray-900">
          Koštuj Administration
        </h1>
      </div>
      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-100 p-3">
              <ShieldExclamationIcon className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Access Restricted
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            You don't have authorization to access the administrative interface of Koštuj. 
            Please contact an administrator or use our mobile application instead as visitor of wine festivals.
          </p>
          <PrimaryButton
            onClick={logout}
            className='w-32'
          >
            Logout
          </PrimaryButton>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Contact Admin Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <LockClosedIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Contact Administrator
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Get in touch with our administrative team to request access or learn more about authorization requirements.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <EnvelopeIcon className="w-5 h-5 mr-3 text-blue-600" />
                <a href={`mailto:${contactEmail}`} className="hover:text-blue-600">
                  {contactEmail}
                </a>
              </div>
              <div className="flex items-center text-gray-700">
                <PhoneIcon className="w-5 h-5 mr-3 text-blue-600" />
                <a href={`tel:${phoneNumber}`} className="hover:text-blue-600">
                  {phoneNumber}
                </a>
              </div>
            </div>
          </div>

          {/* Mobile App Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <DevicePhoneMobileIcon className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Use Mobile App
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Access all user features through our mobile application. Download now to get started.
            </p>
            <div className="space-y-4">
              <a 
                href={playStoreLink}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <ArrowDownTrayIcon className="w-5 h-5 mr-3 text-gray-700" />
                  <span className="font-medium text-gray-700">Android: Play Store</span>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-500" />
              </a>
              <a 
                //href={playStoreLink}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <ArrowDownTrayIcon className="w-5 h-5 mr-3 text-gray-700" />
                  <span className="font-medium text-gray-700">iOS: App Store (DEV IN PROGRESS)</span>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            If you believe this is an error, please contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoAuthorizationPage