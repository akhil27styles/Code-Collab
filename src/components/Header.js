// import React from 'react'
// import ACTIONS from '../constants/Actions';

// const Header = ({roomId, setReceivedCode,socketRef}) => {
//    console.log(setReceivedCode);
//     const handleFileUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//           const reader = new FileReader();
//           reader.onload = (e) => {
//             const fileContent = e.target.result;
//             setReceivedCode(fileContent);
//             // Emit the code to the server using socket.io
//             socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//               roomId,
//               code: fileContent,
//             });
//           };
//           reader.readAsText(file);
//         }
//       };
//   return (
//     <div className='header'>
//     <label className="custom-file-input">
//       <input type="file" onChange={handleFileUpload} />
//       upload a File...
//     </label>
//     </div> 
//   )
// }

// export default Header