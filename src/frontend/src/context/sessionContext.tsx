import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { HttpAgent, Identity, AnonymousIdentity, ActorSubclass } from '@dfinity/agent';
import { User, Notification, EconomyData, _SERVICE } from '../declarations/backend/backend.did';
import { createActor } from "../declarations/backend";
import { AuthClient } from '@dfinity/auth-client';
import ModalProviderSelect from '../components/auth/ModalProviderSelect';

const canisterId = import.meta.env.VITE_CANISTER_ID_BACKEND as string
const host = import.meta.env.VITE_DFX_NETWORK === "local" ? "http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai" : "https://identity.ic0.app";

interface MessagePreview {
  title: string; 
  sender: string; 
  date: bigint
};
type SessionContextType = {
  user: User | null;
  notifications: Notification[];
  messagesPrev: MessagePreview[];
  activityData: EconomyData[];
  identity: Identity;
  isAuthenticated: boolean;
  backend: ActorSubclass<_SERVICE>;
  login: () => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  updateNotifications: (notifications: Notification[]) => void;
  updateUnreadMessages: (messagesPrev: MessagePreview[]) => void;
  markNotificationAsRead: (id: bigint) => void;
};

const defaultSessionContext: SessionContextType = {
  user: null,
  notifications: [],
  messagesPrev: [],
  activityData: [],
  identity: new AnonymousIdentity(),
  isAuthenticated: false,
  backend: createActor(canisterId, {
    agentOptions: { identity: new AnonymousIdentity(), host }
  }),
  login: () => { },
  logout: async () => { },
  updateUser: () => { },
  updateNotifications: () =>{ },
  updateUnreadMessages: () => {},
  markNotificationAsRead: () => {},

};

export const SessionContext = createContext<SessionContextType>(defaultSessionContext);

type SessionProviderProps = {
  children: ReactNode;
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [messagesPrev, setMessagesPrev] = useState<MessagePreview[]>([])
  const [activityData, setActivityData] = useState<EconomyData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity>(new AnonymousIdentity());
  const [backend, setBackend] = useState<ActorSubclass<_SERVICE>>(
    createActor(canisterId, {
      agentOptions: { identity: new AnonymousIdentity(), host }
    })
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const markNotificationAsRead = (id: bigint) => {
    setNotifications((prev) =>
      prev.map((n) => (n.date === id ? { ...n, read: true } : n))
    );
  };
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const setupAgent = async () => {
      const agent = await HttpAgent.create({
        identity,
        host,
      });
      setBackend(createActor(canisterId, { agent }));

    };
    setupAgent();
  }, [identity]);


  useEffect(() => {
    const getUser = async () => {
      const attempts = [
        backend.signIn(),
        backend.signIn(),
        backend.signIn(),
      ];
  
      const results = await Promise.allSettled(attempts);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
      
        if (result.status === "fulfilled") {
          const dataUser = result.value;
          if ("Ok" in dataUser) {
            setUser(dataUser.Ok.user);
            setNotifications(dataUser.Ok.notifications);
            setMessagesPrev(dataUser.Ok.messagesPrev);
            setActivityData(dataUser.Ok.activityStatus);
            console.log(`✅ Usuario encontrado en la llamada ${i}`);
            break;
          }
        }
      }
    };
  
    getUser();
  }, [isAuthenticated, backend]);
  

  async function init() {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    setIdentity(identity);

    if (!identity.getPrincipal().isAnonymous()) {
      setIsAuthenticated(true);
    };
  };

  const updateUser = (user: User) => {
    setUser(user);
  };

  const updateNotifications = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications);
  };

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const updateUnreadMessages = (updatedMessages: MessagePreview[]) => {
    setMessagesPrev(updatedMessages)
  };

  const login = async (providerUrl: string) => {
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: providerUrl,
      onSuccess: () => {
        const identity = authClient.getIdentity();
        setIdentity(identity);
        setIsAuthenticated(true);
      },
      onError: (err) => console.error("Error al iniciar sesión:", err),
    });
  };

  const handleProviderSelection = async (providerUrl: string) => {
    setIsModalOpen(false);      // Cierra el modal
    await login(providerUrl);   // Llama a `login` con el proveedor seleccionado
  };

  const logout = async () => {
    setUser(null);
    const authClient = await AuthClient.create();
    await authClient.logout();
    setIdentity(new AnonymousIdentity());
    setIsAuthenticated(false);
    setBackend(
      createActor(canisterId, {
        agentOptions: { identity: new AnonymousIdentity(), host }
      })
    );
  };

  return (
    <SessionContext.Provider value={
      { 
        user, notifications, activityData, messagesPrev, identity, backend, isAuthenticated, markNotificationAsRead,
        updateUser, updateNotifications,  updateUnreadMessages, login: handleLoginClick, logout }
      }
    >
      {children}
      <ModalProviderSelect
        internetIdentityUrl= {host}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProvider={handleProviderSelection}
      />
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
