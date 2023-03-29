import { Router } from 'express';
import { userRequest } from '../routes/path';

export default () => {
    const api = Router();
    api.post(userRequest, () => {
        new UserRequest().execute().then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        })
    });
    return api;
}