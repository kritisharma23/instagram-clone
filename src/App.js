import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //logged in
        setUser(authUser);
      }
      else{
        //logged out
        setUser(null);
      }
    });
    return ()=>{
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot =>{
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  // Sign Up
  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error => alert(error.message)));
    setOpen(false);
  }

  // Sign In
  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch(error => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup"> 
        <center>
          <img className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="LOGO"/>
        </center>
        <Input placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input placeholder="email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <Input placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={signUp}>Sign Up</Button>
        </form>
      </div>
      </Modal>


      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup"> 
        <center>
          <img className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="LOGO"/>
        </center>
        <Input placeholder="email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <Input placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={signIn}>Sign In</Button>
        </form>
      </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
        alt="LOGO"/>

      {user ? (
        <Button onClick={()=>auth.signOut()}>Logout</Button>
      ):(
        <div className="app__loginContainer">
          <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={()=>setOpen(true)}>Sign Up</Button>
        </div>  
      )}
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post})=>(
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} right_column={false}/>
            ))
          }
        </div>
        <div className="app__postsRight">
          <Post key='' username="google(@google)" right_column={true} 
          caption="Masks are still important. Wear a mask and save lives. #GoogleDoodle" 
          imageUrl="https://www.google.com/logos/doodles/2021/get-vaccinated-wear-a-mask-save-lives-june-22-6753651837109280-2xa.gif"/>
        </div> 
      </div>
      <div className="app__uploadPost">
            {user?.displayName? (
              console.log("Display Name Present"),
              <ImageUpload username={user.displayName}/>
              ): (
              <h3>Sorry! You have to login to upload your posts.</h3>
            )}
      </div>
    </div>
    
  );
}

export default App;
