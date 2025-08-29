import React from 'react'

const UserAvatar = ({user, online = null, profile = false}) => {
    let onlineClass = online === true? 'avatar-online' : '';
    let sizeClass = profile ? 'w-40' : 'w-8';
        return (
        <>
        { user.avatar_url &&
        (
            <div className={`avatar ${onlineClass}`}>
                <div className={`rounded-full ${sizeClass}`}>
                    <img src={user.avatar_url} alt={user.name} />
                </div>
            </div>
        )}
        { !user.avatar_url &&
           ( <div className={`avatar avatar-placeholder ${onlineClass}`}>
                <div className={`bg-neutral text-neutral-content rounded-full ${sizeClass}`}>
                    <span className='text-xl font-semibold'>{user.name.charAt(0).toUpperCase()}</span>
                </div>
            </div>
            )}
        </>
  )
}

export default UserAvatar