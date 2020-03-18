import axios from 'axios';
import Services from './services';

class DocService extends Services {
  static getDocs() {
    return axios.get(DocService.getDocsURL());
  }

  static postDoc(doc: any) {
    return axios.post(DocService.postDocURL(), doc);
  }
}

export default DocService;
