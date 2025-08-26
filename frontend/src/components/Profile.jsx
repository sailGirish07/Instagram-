// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../public/styles/profile.css'
// import createPostIcon from '../assets/create-post.png.png';

// export default function Profile() {
//     const [user, setUser] = useState(null);
//     const [posts, setPosts] = useState([]);
//     const navigate = useNavigate();
//     const token = localStorage.getItem('token');

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const resUser = await axios.get('http://localhost:8080/profile', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setUser(resUser.data);

//                 const resPosts = await axios.get('http://localhost:8080/profile-posts', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setPosts(resPosts.data);
//             } catch (err) {
//                 console.error(err);
//                 alert('Failed to fetch profile. Please login again.');
//                 navigate('/login');
//             }
//         };

//         fetchProfile();
//     }, [navigate, token]);

//     if (!user) return <p>Loading...</p>;

//     return (
//         <div className="profile-container"> 
//         <img src={createPostIcon} className="post" onClick={() => navigate('/post')}/>
//             <div className="profile-header">
//                 {/* <h2>{user.userName}</h2> */}
//                 {/* <i className='post' onClick={() => navigate('/post')}>@</i> */}
                
//             </div>

//             <div className='profile-body'>
//                 <div className='left-body'>
//                     <div className='profile-pic'>
//                          <h2>{user.userName}</h2>
//                         <img src={user.profilePic || "https://via.placeholder.com/150"} alt="Profile" />
//                          <div className="profile-bio">
//                         <p><strong>{user.fullName}</strong></p>
//                         <p>{user.bio || "Bio"}</p>
//                     </div>
//                     </div>
//                     {/* <div className="profile-bio">
//                         <p><strong>{user.fullName}</strong></p>
//                         <p>{user.bio || "Bio"}</p>
//                     </div> */}
//                 </div>
//                 <div className='right-body'>
//                     <div className="profile-stats">
//                         <p><strong>{posts.length}</strong> Posts</p>
//                         <p><strong>{user.followers.length}</strong> Followers</p>                         
//                         <p><strong>{user.following.length}</strong> Following</p>
//                     </div>
//                 </div>
//             </div>

//             <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>

//             <div className="posts-grid">
//                 {posts.length === 0 && <p>No posts yet</p>}
//                 {posts.map(post => (
//                     <div key={post._id} className="post-card">
//                         <img src={post.media} alt="post" />
//                         <p>{post.caption}</p>
//                         <p>Likes: {post.likes.length}</p>
//                         <p>Comments: {post.comments.length}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../public/styles/profile.css';
import createPostIcon from '../assets/create-post.png.png';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch user profile
                const resUser = await axios.get('http://localhost:8080/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(resUser.data);

                // Fetch user posts
                const resPosts = await axios.get('http://localhost:8080/profile-posts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPosts(resPosts.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                alert('Failed to fetch profile. Please login again.');
                navigate('/login');
            }
        };

        fetchProfile();
    }, [navigate, token]);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="profile-container"> 
            <img 
                src={createPostIcon} 
                className="post-icon" 
                alt="Create Post" 
                onClick={() => navigate('/post')} 
            />

            {/* <div className="profile-header">
                <h2>{user.userName}</h2>
            </div> */}

            <div className="profile-body">
                <div className="left-body">
                    <div className="profile-pic">
                        <h2>{user.userName}</h2>
                        <img src={user.profilePic || "https://via.placeholder.com/150"} alt="Profile" />
                        <div className="profile-bio">
                            <p><strong>{user.fullName}</strong></p>
                            <p>{user.bio || "Bio"}</p>
                        </div>
                    </div>
                </div>

                <div className="right-body">
                    <div className="profile-stats">
                        <p><strong>{posts.length}</strong> Posts</p>
                        <p><strong>{user.followers?.length || 0}</strong> Followers</p>
                        <p><strong>{user.following?.length || 0}</strong> Following</p>
                    </div>
                </div>
            </div>

            <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>

            <div className="posts-grid">
                {posts.length === 0 && <p>No posts yet</p>}
                {posts.map(post => (
                    <div key={post._id} className="post-card">
                        <img src={`http://localhost:8080${post.media}`} alt="post" />
                        <p>{post.caption}</p>
                        <p>Likes: {post.likes?.length || 0}</p>
                        <p>Comments: {post.comments?.length || 0}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
