// import axios from axios;
// import useAuth from "./useAuth";

// const useRefreshToken = () => {
//     const { setAuth } = useAuth();

//     const refresh = async () => {
//         const response = await axios.get('/api/users/refreshToken', {
//             withCredentials: true
//         });

//         setAuth(prev => {
//             console.log(JSON.stringify(prev));
//             console.log(JSON.stringify(response.data));
//             return { ...prev, accessToken: response.data.accessToken }
//         });
//         return response.data.accessToken;
//     }

//     return refresh;
// }

// export default useRefreshToken