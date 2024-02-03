import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { balanceAtom, tokenAtom, userAtom } from "../atoms"
import axios, { all } from "axios";
import { useEffect, useRef, useState } from "react";

export function Dashboard(){
    let global = 0;
    const user = useRecoilValue(userAtom);
    const balance = useRecoilValue(balanceAtom);
    const currentUser = user.currentUser;
    const allUsers = user.user;


    return <div>
        <div className=" flex justify-between">
            <div>Payments App</div>
            <div className="flex">
                <div>Hello, {currentUser.firstName} {currentUser.lastName}</div>
                <div className=" bg-gray-300 rounded-full p-2">{getInitails(currentUser.firstName+" "+currentUser.lastName)}</div>
            </div>
        </div>
        <div>Your balance ₹{Number(balance).toFixed(2)}</div>
        <div>Users</div>
        <input type="text" className=" border-gray-200 border-2 rounded-md w-full py-1"/>
        {allUsers.map(function(user){if(user._id!=currentUser._id){return <UserCard key={global++} user = {user}></UserCard>}})}
    </div>
}

function UserCard({user}){
    const [Jwt_Token, setJwt_Token] = useRecoilState(tokenAtom);
    const setBalance = useSetRecoilState(balanceAtom)
    let amount;
    const divRef = useRef();
    function card(){
        divRef.current.style.display = "block";
    }
    function closeCard(){
        divRef.current.style.display = "none";
    }
    const clicked = (e) => {e.stopPropagation()}

    async function sendData(){
        try{
            const response = await axios.post("http://localhost:3000/api/vi/account/transfer",{
            "to": user._id,
            amount
        },{
                headers: {
                    "authorization": "Bearer "+ Jwt_Token
                }
            })
            
            const account = await axios.get("http://localhost:3000/api/vi/account/balance",{
                headers: {
                    "authorization": "Bearer "+ Jwt_Token
                }
            })
            closeCard()
            setBalance(account.balance);
        }catch(err){
            console.log(err);
        }
    }

    return <div>
        <div ref={divRef} className=" bg-gray-500 h-screen w-screen z-[10] fixed bg-opacity-25 " onClick={closeCard} style={{display: "none"}}>
            <div className="bg-white mx-40 mt-40 z-2" onClick={clicked}>
                <div className="text-black font-bold text-3xl">Send Money</div>
                <div className="flex">
                    <div className="bg-green-600 rounded-full p-2 text-white">{getInitails(user.firstName+" "+user.lastName)}</div>
                    <div className="font-bold text-2xl ">{user.firstName+" "+user.lastName}</div>
                </div>
                <div>amount</div>
                <input type="number" placeholder="" className=" border-gray-200 border-2 rounded-md w-full py-1" onChange={function(e){
                        amount = e.target.value;
                    }}/>
                <button className=" bg-green-600" onClick={sendData}>Initiate transfer</button>
            </div>
        </div>
        <div className="flex justify-between">
            <div className="flex">
                <div>logo</div>
                <div>{user.firstName} {user.lastName}</div>
            </div>
            <div>
                <button className=" bg-black text-white" onClick={card}>Send Money</button>
            </div>
        </div>
    </div>
}

function getInitails(name){

    let parts = name.split(' ')
    let initials = '';
    initials+=parts[0][0];
    initials+=parts[parts.length-1][0];
    return initials;
}