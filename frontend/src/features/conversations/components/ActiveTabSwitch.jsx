
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../chatSlice';


const ActiveTabSwitch = () => {
  const { activeTab } = useSelector(state => state.chat);
  const dispatch = useDispatch();

  return (
    <div className='tabs tabs-boxed bg-transparent p-2 m-2'>
      <button
        onClick={() => dispatch(setActiveTab('chats'))}
        className={`tab ${activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
      >
        Chats
      </button>

      <button onClick={() => dispatch(setActiveTab('contacts'))}
        className={`tab ${activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}>
        Contacts
      </button>

    </div>
  )
}

export default ActiveTabSwitch
