import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { tokenAtom, userAtom, balanceAtom } from '../atoms';

export function SignInPage(){
    const navigate = useNavigate();
    const [Jwt_Token, setJwt_Token] = useRecoilState(tokenAtom);
    const setBalance = useSetRecoilState(balanceAtom);
    const setUsers = useSetRecoilState(userAtom);
    let username, password;

    async function sendData(){
        try{
            const response = await axios.post("http://localhost:3000/api/vi/user/signin",{
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
            setBalance(account.data.balance);
            navigate('/dashboard')
        }catch(err){
            console.log(err)
        }
    }

    return <div className=" bg-[#7f7f7f] h-[100vh]">
        <div className="flex justify-center mx-96">
            <div className=" bg-white pt-8 px-8 mx-48 mt-28 rounded-lg">
                <div className=" font-bold text-center text-4xl">Sign In</div>
                <div className=" text-center p-2 pb-3 pt-4 text-gray-500 text-lg">Enter your credentials to access your account</div>
                <div>
                    <div className=" font-semibold px-1 pt-4 pb-2 text-lg">Email</div>
                    <input type="text" placeholder="" className=" border-gray-200 border-2 rounded-md w-full py-1" onChange={function(e){
                        username = e.target.value;
                    }} />
                </div>
                <div>
                    <div className=" font-semibold px-1 pt-4 pb-2 text-lg">Password</div>
                    <input type="text" placeholder="" className=" border-gray-200 border-2 rounded-md w-full py-1" onChange={function(e){
                        password = e.target.value;
                    }} />
                </div>
                <button className=" bg-black text-white rounded-md w-full  py-2 mt-4 " onClick={sendData}>Sign In</button>
                <div className=" font-semibold px-1 pt-4 pb-6 text-center ">Don't have an account? <a href="http://localhost:5173/signup"><u>Sign Up</u></a></div>
            </div>
        </div>
    </div>
}