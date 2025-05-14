import { useEffect, useState } from 'react';
import { Notification } from '../declarations/backend/backend.did';
import { useSession } from '../context/sessionContext';

interface Props {
  notif: Notification;
  onClick?: () => void;
}

const NotificationItem = ({ notif, onClick }: Props) => {
  const [id, setId] = useState<bigint | null>(null);
  const { backend } = useSession();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    const kind = notif.kind;
    if ("MintingCompleted" in kind) {
      setId(kind.MintingCompleted);
      setTitle("Minting Completed");
      setBody(`Your Critter has been successfully minted. Its Intergalactic Identity Document (IID) number is: ${kind.MintingCompleted}`);
    } else if ("ReproductionCompleted" in kind) {
      setId(kind.ReproductionCompleted);
      setTitle("Reproduction Completed");
      setBody("");
    } else if ("CritterDied" in kind) {
      setId(kind.CritterDied);
      setTitle("Your Critter has passed away");
      setBody(`Unfortunately we have to inform you that your Critter ${kind.CritterDied} has passed on to a more ethereal plane of existence.`)
    } else if ("NewRefferal" in kind) {
      setTitle("New user referral")
      setBody(`Congratulations! The user "${kind.NewRefferal}" has just registered with their referral code. You have earned redeemable points.`)

    }
  }, [notif]);

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
          ? 'bg-gray-500 hover:bg-gray-700'
          : 'bg-gray-800 hover:bg-gray-900'
      }`}
    >
      <div className="text-[11px] text-right text-gray-300">
        {new Date(Number(notif.date) / 1000000).toLocaleString()}
      </div>
      <p className='text-[16px]'>{title}</p>
      <p className='text-[16px]'>{body}</p>
    </div>
  );
};

export default NotificationItem;
