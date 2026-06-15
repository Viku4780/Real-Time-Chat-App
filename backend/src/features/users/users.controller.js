import User from "../auth/auth.model.js";

export const getAllcontacts = async(req, res) => {
    // console.log('running getAllContacts handler')
    try {
        const filteredUsers = await User.find({_id: {$ne: req.user._id}}).select({fullName: 1, profilePic: 1});

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message});
    }
}