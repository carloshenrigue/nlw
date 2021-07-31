import { useAuth } from '../hooks/useAuth'
import { useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'


import illustrationImg  from  '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { Button } from '../components/Button';


import '../styles/auth.scss';
import { database } from '../services/firebase'





export function Home(){
    const history = useHistory();
    const {user, singnInWithGoogle} = useAuth()
    const [roomCode, setRoomCode ] = useState('');

    async function handleCreateRoom(){
        if(!user) {
           await singnInWithGoogle()
        }

            history.push('/rooms/new');
        }
        async function handleJoinRoom(event: FormEvent){
         event.preventDefault();

         if(roomCode.trim() === '') {
             return;
         }
         const roonRef = await database.ref(`rooms/${roomCode}`).get();

         if(!roonRef.exists()) {
             alert('Room does not exist');
             return;
         }

         if(roonRef.val().endedAt) {
            alert('Room closed');
            return;
        }
         history.push(`/rooms/${roomCode}`);
        }
    return(
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as duvidas da sua audiencia em tempo real</p>
            </aside>
            <main>
              
                <div className ='main-content'>
                    <img src={logoImg} alt="letmeask" />
                    <button onClick={handleCreateRoom} className="create-run">
                        <img src={googleIconImg} alt="çogo google" />
                        <p>Crie sua sala no Google</p>
                    </button>
                    <div className="saparator">
                        ou entre em uma sala
                    </div>
                    <form >
                        <input 
                        type="text" 
                        placeholder="digite o codigo da sala"
                       onChange = {event => setRoomCode(event.target.value)}
                     value={roomCode}
                        />
                        <Button  onClick={handleJoinRoom} type="submit">
                            Entre na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
        
    )
    }
