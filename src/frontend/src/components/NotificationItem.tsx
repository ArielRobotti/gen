import { useEffect, useState } from 'react';
import { Notification } from '../declarations/backend/backend.did';
import { useSession } from '../context/sessionContext';

interface Props {
  notif: Notification;
  onClick?: () => void;
}

const NotificationItem = ({ notif, onClick }: Props) => {
  const [id, setId] = useState<number | null>(null);
  const { backend } = useSession();

  console.log(notif.read)

  useEffect(() => {
    const kind = notif.kind;
    if ("MintingCompleted" in kind) {
      setId(Number(kind.MintingCompleted));
    } else if ("ReproductionCompleted" in kind) {
      setId(Number(kind.ReproductionCompleted));
    } else if ("CritterDied" in kind) {
      setId(Number(kind.CritterDied));
    }
  }, [notif]);

  const getNotificationText = () => {
    const kind = notif.kind;
    if ("Welcome" in kind) {
      return "Welcome to Crypto Critters!";
    } else if ("MintingCompleted" in kind) {
      return `🐣 Your Critter #${kind.MintingCompleted} was successfully minted!!`;
    } else if ("ReproductionCompleted" in kind) {
      return `Your critter #${kind.ReproductionCompleted} has finished reproducing.`;
    } else if ("CritterDied" in kind) {
      return `Unfortunately, your critter #${kind.CritterDied} has died.`;
    } else {
      return "Unknown notification.";
    }
  };

  const handleClick = async () => {
    if (id !== null) {
      const critter = await backend.getCritter(BigInt(id));
      console.log({critter: critter})
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 border-b last:border-b-0 last:rounded-b-lg cursor-pointer ${
        notif.read
          ? 'hover:bg-gray-800'
          : 'bg-[#00ff0050] hover:bg-[#00ff0040]'
      }`}
    >
      <div className="text-[11px] text-right text-gray-300">
        {new Date(Number(notif.date) / 1000000).toLocaleString()}
      </div>
      <p className='text-[16px]'>{getNotificationText()}</p>
    </div>
  );
};

export default NotificationItem;
