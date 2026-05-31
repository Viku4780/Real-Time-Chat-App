import { useEffect } from "react";
import UsersLoadingSkeleton from "../../users/components/UsersLoadingSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts,setSelectedUser } from "../chatSlice";

function ContactList() {
  const {allContacts, isUsersLoading} = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const { onlineUsers } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getAllContacts());
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => dispatch(setSelectedUser(contact))}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers?.includes(contact._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img src={contact.profilePic || "/avatar.png"} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium">{contact.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ContactList;