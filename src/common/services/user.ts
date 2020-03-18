import axios from 'axios';

export async function saveUser(userToSave: any) {
  return axios.post('api/v1/user');
}
