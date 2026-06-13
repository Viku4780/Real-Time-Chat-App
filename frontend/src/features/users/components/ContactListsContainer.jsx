import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import useContactList from "../hooks/useContactList";
import ContactList from "./ContactList";


function ContactListsContainer() {
  const { allContacts, isUsersLoading, onlineUsers
    , isUsersError, handleFetch } = useContactList();



  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    !isUsersError ?
      <>
        {allContacts.map((contact) => (
          <ContactList contact={contact} handleFetch={handleFetch} onlineUsers={onlineUsers} />
        ))}
      </>
      : <div>
        <p className="text-red-600">error while loading contact</p>
      </div>

  );
}
export default ContactListsContainer;