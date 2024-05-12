import React from 'react'
import SearchInput from './SearchInput';
import Conversations from './Conversations';
import LogoutButton from './LogoutButton';

function Sidebar() {
  return (
    <div className='border-r border-slate-500 p-4 flex flex-col'>
        <SearchInput/>
        <div className='divider px-4'/>
        <Conversations/>
        <LogoutButton/>
    </div>
  )
}

export default Sidebar;

// Sidebar is divided in three components
// search bar
// list of chats
// Logout button