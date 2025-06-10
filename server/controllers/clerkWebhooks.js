import User from "../models/User.js"; // Ensure this path is correct
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    console.log("Clerk Webhook received!");
    // Log the headers to ensure they are present
    console.log("Headers:", req.headers);

    try {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
        if (!WEBHOOK_SECRET) {
            console.error("CLERK_WEBHOOK_SECRET is not set in environment variables!");
            return res.status(500).json({ success: false, message: "Server configuration error: Webhook secret missing." });
        }

        const whook = new Webhook(WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        let evt;
        try {
            // Verify the webhook payload
            evt = whook.verify(req.body.toString(), headers);
            console.log("Webhook verified successfully!");
        } catch (err) {
            console.error("Webhook verification failed:", err.message);
            // Return 400 if verification fails
            return res.status(400).json({ success: false, message: "Webhook verification failed." });
        }

        const { data, type } = evt; // Use 'evt.data' and 'evt.type' after verification

        console.log(`Webhook Type: ${type}`);
        console.log("Webhook Data:", data);

     

        console.log("Prepared User Data:", userData);

        switch (type) {
            case "user.created": {
                console.log("Attempting to create user...");
                   const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username: data.first_name
                        ? `${data.first_name} ${data.last_name || ''}`.trim()
                        : data.email_addresses[0].email_address,
                    image: data.image_url,
                    recentSearchedCities: [],
            };
                await User.create(userData);
                console.log("User created successfully!");
                break;
            }
            case "user.updated": {
                console.log(`Attempting to update user with ID: ${data.id}...`);
                   const userData = {
                        _id: data.id,
                        email: data.email_addresses[0].email_address,
                        username: data.first_name
                            ? `${data.first_name} ${data.last_name || ''}`.trim()
                            : data.email_addresses[0].email_address,
                        image: data.image_url,
                        recentSearchedCities: [],
                        };
                await User.findByIdAndUpdate(data.id, userData, { new: true }); // { new: true } returns the updated document
                console.log("User updated successfully!");
                break;
            }
            case "user.deleted": {
                console.log(`Attempting to delete user with ID: ${data.id}...`);
                await User.findByIdAndDelete(data.id);
                console.log("User deleted successfully!");
                break;
            }
            default:
                console.log(`Unhandled webhook type: ${type}`);
                break;
        }

        res.json({ success: true, message: "webhook received" });
    } catch (error) {
        console.error("Error in clerkWebhooks:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export default clerkWebhooks;