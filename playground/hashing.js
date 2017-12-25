const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let message = "I am user number 3";
let hash = SHA256(message);

console.log(`message: ${message}`);
console.log(`hash: ${hash}`);

let data = {
    id: 4,
};
let password = '123abc!';
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(`hash: ${hash}`);
        bcrypt.compare(password, hash, (err, res) => {
            console.log(`res; ${res}`);
        })
    });
});

//let token = jwt.sign(data, '123abc');
//console.log(token);

let tokenString = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNTEzOTk2ODA1fQ.nT62xIh9JO7bB_l_GNcdSqOZRda589DhhJvpiMsZgkc';
let decoded = jwt.verify(tokenString, '123abc');
console.log(decoded);
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString(),
// };
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// }
// else {
//     console.log('Data was changed. Do not trust.');
// }