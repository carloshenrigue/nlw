

import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg'
import deletImg from '../assets/images/delete.svg'
import checKImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button';
import { Question } from '../components/Question';

import {RoomCode} from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';


import '../styles/room.scss';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';



type RoomParams = {
    id: string;
}
export function AdminRoom() {
   // const {user}  = useAuth();
   const history = useHistory();
    const parms = useParams<RoomParams>();
    const roomId = parms.id;
    //o useEffect dispara uma função sempre q uma informação mudar


    const {title, questions} = useRoom(roomId)

    async function handleEndRoom(){
        if(window.confirm('tem certeza que deseja excluir essa pergunta ?')){
            await database.ref(`rooms/${roomId}`).update({ 
                endedAt : new Date(),
            })
            history.push('/');
        } }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('tem certeza que deseja excluir essa pergunta ?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        } }
    
    async function handleCheckQuestionAsAnswerd(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered : true,
        });
    }
     
    async function handleHighlightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted:  true,
        });
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeast" />
                   <div>
                       <RoomCode code={roomId}/>
                   <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                   </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1> Sala {title}</h1>
                   { questions.length > 0 && <span> {questions.length} perguntas </span> }
                    </div> 


                    <div className ="question-list">
                    {questions.map(question =>{
                        return (
                            <Question 
                            key = {question.id}
                            content = {question.content}
                            author = {question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted = {question.isHighlighted }
                            >
                                { !question.isAnswered && (
                                    <>
                                     <button
                                     type="button"
                                     onClick={() => handleCheckQuestionAsAnswerd(question.id)}>
                                         <img src={checKImg} alt="marcar pergunta" />
                                     </button>
                                     <button
                                     type="button"
                                     onClick={() => handleHighlightQuestion(question.id)}>
                                         <img src={answerImg} alt="dar destaque pergunta" />
                                     </button>
                                     </>
                                )}
                                <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src={deletImg} alt="Remover pergunta" />
                                </button>
                               </ Question>
                        );
                    })}
                    </div>
            </main>
        </div>
    );
}