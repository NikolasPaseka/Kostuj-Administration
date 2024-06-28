import { HomeIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { Button } from '@nextui-org/react';
import SidebarItem from './SidebarItem';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 flex flex-col bg-lightContainer rounded-xl">
      <div className="flex items-center justify-center h-16">
        <h1 className="text-2xl font-bold">Koštuj</h1>
      </div>
      <nav className="flex-1 flex items-center flex-col mt-4">
        <SidebarItem path="/" text="Home" Icon={HomeIcon} />
        <SidebarItem path="/profile" text="Profile" Icon={UserIcon} />
        <SidebarItem path="/settings" text="Settings" Icon={Cog6ToothIcon} />
        <SidebarItem path="/settings" text="Settings" Icon={Cog6ToothIcon} />
        <SidebarItem path="/settings" text="Settings" Icon={Cog6ToothIcon} />
        <SidebarItem path="/settings" text="Settings" Icon={Cog6ToothIcon} />
      </nav>
      <div className="p-4">
        <Button color="primary" className="w-full">
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Sidebar