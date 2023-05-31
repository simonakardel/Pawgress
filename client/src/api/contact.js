import {
    apiRequest
} from "./instance";

const sendMessage = (data) => apiRequest("post", "/contact", data);


const ContactAPI = {
    sendMessage

}

export default ContactAPI;