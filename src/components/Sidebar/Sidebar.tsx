import { HomeIcon, UserIcon, Cog6ToothIcon, KeyIcon } from '@heroicons/react/24/solid';
import { Button } from '@nextui-org/react';
import SidebarItem from './SidebarItem';
import { useAuth } from '../../context/AuthProvider';

const Sidebar = () => {
  const { logout, getUserData } = useAuth();

  return (
    <div className="h-screen w-64 flex flex-col bg-lightContainer rounded-xl sticky top-0">
      <div className="flex items-center justify-center h-16">
        <h1 className="text-2xl font-bold">Koštuj</h1>
      </div>
      <nav className="flex-1 flex items-center flex-col mt-4">
        <SidebarItem path="/" text="Home" Icon={HomeIcon} />
        <SidebarItem path="/profile" text="Profile" Icon={UserIcon} />
        <SidebarItem path="/feastCatalogues" text="Catalogues" Icon={Cog6ToothIcon} />
        <SidebarItem path="/signIn" text="Sign In" Icon={KeyIcon} />
        <SidebarItem path="/settings" text="Settings" Icon={Cog6ToothIcon} />
      </nav>
      { getUserData() && <div className="p-4">
          <p className="text-center">Logged in as {getUserData()?.email}</p>
        </div>
      }
      <div className="p-4">
        <Button color="primary" className="w-full" onPress={() => {
            logout();
        }}>
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Sidebar