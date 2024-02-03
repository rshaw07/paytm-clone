import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { balanceAtom, tokenAtom, userAtom } from '../atoms';

export function SignUpPage(){
    const navigate = useNavigate();
    const [Jwt_Token, setJwt_Token] = useRecoilState(tokenAtom);
    const setUsers = useSetRecoilState(userAtom);
    const setBalance = useSetRecoilState(balanceAtom);
    let firstName, lastName, username, password;

    async function sendData(){
        try{
            const response = await axios.post("http://localhost:3000/api/vi/user/signup",{
            firstName,
            lastName,
            username,
            password
        })
            console.log(response.data)
            setJwt_Token(response.data.token);
            const res = await axios.get("http://localhost:3000/api/vi/user/bulk",{
                headers: {
                    "authorization": "Bearer "+ Jwt_Token
                }
            })
            setUsers(res.data)
            
            const account = await axios.get("http://localhost:3000/api/vi/account/balance",{
                headers: {
                    "authorization": "Bearer "+ Jwt_Token
                }
            })
            setBalance(account.balance);

            navigate('/dashboard')
        }catch(err){
            console.log(err)
        }
    }

    return <div className=" bg-[#7f7f7f] h-[100vh]">
        <div className="flex justify-center mx-96">
            <div className=" bg-white pt-8 px-6 mx-48 mt-16 rounded-lg">
                <div className=" font-bold text-center text-4xl">Sign Up</div>
                <div className=" text-center p-2 pb-3 pt-4 text-gray-500 text-lg">Enter your information to create an account</div>
                <div>
                    <div className=" font-semibold px-1 pt-3 pb-2 text-lg">First Name</div>
                    <input type="text" placeholder="" className=" border-gray-200 border-2 rounded-md w-full py-1" onChange={function(e){
                        firstName = e.target.value;
                    }} />
                </div>
                <div>
                    <div className=" font-semibold px-1 pt-4 pb-2 text-lg">Last Name</div>
                    <input type="text" placeholder="" className=" border-gray-200 border-2 rounded-md w-full py-1 " onChange={function(e){
                        lastName = e.target.value;
                    }} />
                </div>
                <div>
                    <div className=" font-semibold px-1 pt-4 pb-2 text-lg">Email</div>
                    <input placeholder="" className=" border-gray-200 border-2 rounded-md w-full py-1 " onChange={function(e){
                        username = e.target.value;
                    }} />
                </div>
                <div>
                    <div className=" font-semibold px-1 pt-4 pb-2 text-lg">Password</div>
                    <input placeholder="" className=" border-gray-200 border-2 rounded-md w-full py-1 " onChange={function(e){
                        password = e.target.value;
                    }} />
                </div>
                <button className=" bg-black text-white rounded w-full  py-2 mt-4" onClick={sendData}>Sign Up</button>
                <div className=" font-semibold px-1 pt-4 pb-6 text-center ">Already have an account? <a href="http://localhost:5173/signin"><u>Login</u></a></div>
            </div>
        </div>
    </div>
}