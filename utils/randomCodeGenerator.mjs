import crypto from "crypto"

 const generateRandomString=(length)=>{
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charLength = characters.length;

  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charLength);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export {generateRandomString}

// const uniqueString = generateRandomString(8);
// console.log(uniqueString);