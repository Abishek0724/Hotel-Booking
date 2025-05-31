import { Message } from "svix/dist/api/message.js";
import User from "../models/User.js";
import { Webhook } from "svix";


const clerkWebhooks= async(req,res)=>{
    try {

        //create a svix instance with clerk webhook
        const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET)
       //getting headers
        const headers={
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"],
        };

        //verfiying headers
        await whook.verify(JSON.stringify(req.body),headers)
        //getting data from requst body
        const{data,type}=req.body

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address, 
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
            
        };
        //switcjh casefor dffevents

        switch (type) {
            case "user.created":{
                await User.create(data.id,userData);
                break;
            }
            case "user.updated":{
                await User.findbyIdAndUpdate(data.id);
                break;
            }
            case "user.deleted":{
                await User.findbyIdAndDelete(data.id);
                break;
            }
             default:
                break;
        }
        res.json({sucess:true, message:"webhook recieved"})
    } catch (error) {
        console.log(error.message);
        res.json({sucess:false, message:error.message})
    }
}
export default clerkWebhooks;