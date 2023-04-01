import { Router } from 'express';
import { userRequest, aiResponse } from '../routes/path.js';
import UserRequest from '../service/userRequest.js';
import UserResponse from '../service/userResponse.js';

export default (eventEmitter) => {
    const api = Router();
    api.post(userRequest, (req, res) => {
        new UserRequest({ ...req, ...res }).execute().then((response) => {
            eventEmitter.emit('audio', response);
            console.log(response);
        }).catch((error) => {
            console.log(error);
        })
    });
    api.get(aiResponse, UserResponse)
    return api;
}